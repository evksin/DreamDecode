"use server";

import { PrismaClient } from "@prisma/client";

export type DbTarget = "local" | "prod";

export type ColumnInfo = {
  name: string;
  dataType: string;
  nullable: boolean;
  defaultValue: string | null;
  isPrimaryKey: boolean;
};

export type TablePage = {
  table: string;
  columns: ColumnInfo[];
  primaryKeys: string[];
  rows: Record<string, unknown>[];
  total: number;
  page: number;
  pageSize: number;
};

function getDbUrl(target: DbTarget) {
  if (target === "local" && process.env.VIEW_DB_LOCAL_URL) {
    return process.env.VIEW_DB_LOCAL_URL;
  }
  if (target === "prod" && process.env.VIEW_DB_PROD_URL) {
    return process.env.VIEW_DB_PROD_URL;
  }
  throw new Error(
    target === "local"
      ? "Не задан VIEW_DB_LOCAL_URL для локальной базы."
      : "Не задан VIEW_DB_PROD_URL для рабочей базы."
  );
}

function quoteIdentifier(name: string) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    throw new Error("Недопустимое имя таблицы или столбца.");
  }
  return `"${name}"`;
}

async function withDb<T>(target: DbTarget, fn: (db: PrismaClient) => Promise<T>) {
  const prisma = new PrismaClient({
    datasources: { db: { url: getDbUrl(target) } },
    log: ["error"],
  });
  try {
    return await fn(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

async function fetchTableNames(prisma: PrismaClient) {
  const rows = (await prisma.$queryRaw<
    Array<{ table_name: string }>
  >`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name`) ?? [];
  return rows.map((row) => row.table_name);
}

async function fetchColumns(prisma: PrismaClient, table: string) {
  const rows = (await prisma.$queryRaw<
    Array<{
      column_name: string;
      data_type: string;
      is_nullable: "YES" | "NO";
      column_default: string | null;
    }>
  >`SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'public' AND table_name = ${table} ORDER BY ordinal_position`) ?? [];
  return rows;
}

async function fetchPrimaryKeys(prisma: PrismaClient, table: string) {
  const rows = (await prisma.$queryRaw<
    Array<{ column_name: string }>
  >`SELECT kcu.column_name FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema WHERE tc.table_schema = 'public' AND tc.table_name = ${table} AND tc.constraint_type = 'PRIMARY KEY' ORDER BY kcu.ordinal_position`) ?? [];
  return rows.map((row) => row.column_name);
}

async function loadTableMeta(prisma: PrismaClient, table: string) {
  const tables = await fetchTableNames(prisma);
  if (!tables.includes(table)) {
    throw new Error("Таблица не найдена.");
  }
  const columns = await fetchColumns(prisma, table);
  const primaryKeys = await fetchPrimaryKeys(prisma, table);
  const columnInfo: ColumnInfo[] = columns.map((column) => ({
    name: column.column_name,
    dataType: column.data_type,
    nullable: column.is_nullable === "YES",
    defaultValue: column.column_default,
    isPrimaryKey: primaryKeys.includes(column.column_name),
  }));
  return { columnInfo, primaryKeys };
}

export async function listTablesAction(target: DbTarget) {
  return withDb(target, async (prisma) => fetchTableNames(prisma));
}

export async function getTablePageAction(
  target: DbTarget,
  table: string,
  page: number,
  pageSize: number,
  sortColumn?: string,
  sortDirection?: "asc" | "desc"
) {
  return withDb(target, async (prisma) => {
    const { columnInfo, primaryKeys } = await loadTableMeta(prisma, table);
    const safeTable = quoteIdentifier(table);
    const allowedColumns = new Set(columnInfo.map((column) => column.name));
    const safeSortColumn =
      sortColumn && allowedColumns.has(sortColumn) ? sortColumn : null;
    const safeSortDirection = sortDirection === "desc" ? "DESC" : "ASC";
    const orderColumns = primaryKeys.length
      ? primaryKeys
      : columnInfo[0]
        ? [columnInfo[0].name]
        : [];
    const orderBy = safeSortColumn
      ? `ORDER BY ${quoteIdentifier(safeSortColumn)} ${safeSortDirection}`
      : orderColumns.length
        ? `ORDER BY ${orderColumns.map(quoteIdentifier).join(", ")}`
        : "";
    const offset = (page - 1) * pageSize;
    const rows = (await prisma.$queryRawUnsafe(
      `SELECT * FROM ${safeTable} ${orderBy} LIMIT $1 OFFSET $2`,
      pageSize,
      offset
    )) as Record<string, unknown>[];
    const totalResult = (await prisma.$queryRawUnsafe(
      `SELECT COUNT(*)::int AS count FROM ${safeTable}`
    )) as Array<{ count: number }>;
    const total = totalResult?.[0]?.count ?? 0;
    return {
      table,
      columns: columnInfo,
      primaryKeys,
      rows,
      total,
      page,
      pageSize,
    } satisfies TablePage;
  });
}

export async function createRowAction(
  target: DbTarget,
  table: string,
  input: Record<string, unknown>
) {
  return withDb(target, async (prisma) => {
    const { columnInfo } = await loadTableMeta(prisma, table);
    const allowed = new Set(columnInfo.map((column) => column.name));
    const entries = Object.entries(input).filter(([key]) => allowed.has(key));
    if (!entries.length) {
      throw new Error("Нет доступных полей для вставки.");
    }
    const columns = entries.map(([key]) => quoteIdentifier(key));
    const values = entries.map(([, value]) => value);
    const placeholders = values.map((_, index) => `$${index + 1}`);
    const sql = `INSERT INTO ${quoteIdentifier(table)} (${columns.join(
      ", "
    )}) VALUES (${placeholders.join(", ")}) RETURNING *`;
    const rows = (await prisma.$queryRawUnsafe(sql, ...values)) as Array<
      Record<string, unknown>
    >;
    return rows[0] ?? null;
  });
}

export async function updateRowAction(
  target: DbTarget,
  table: string,
  where: Record<string, unknown>,
  data: Record<string, unknown>
) {
  return withDb(target, async (prisma) => {
    const { columnInfo, primaryKeys } = await loadTableMeta(prisma, table);
    if (!primaryKeys.length) {
      throw new Error("У таблицы нет первичного ключа.");
    }
    const allowed = new Set(columnInfo.map((column) => column.name));
    const updates = Object.entries(data).filter(([key]) => allowed.has(key));
    if (!updates.length) {
      throw new Error("Нет полей для обновления.");
    }
    const missingKeys = primaryKeys.filter(
      (key) => where[key] === undefined || where[key] === null
    );
    if (missingKeys.length) {
      throw new Error(`Не заданы ключи: ${missingKeys.join(", ")}`);
    }
    const setClause = updates
      .map(([key], index) => `${quoteIdentifier(key)} = $${index + 1}`)
      .join(", ");
    const whereValues = primaryKeys.map((key) => where[key]);
    const whereClause = primaryKeys
      .map((key, index) => `${quoteIdentifier(key)} = $${updates.length + index + 1}`)
      .join(" AND ");
    const values = [...updates.map(([, value]) => value), ...whereValues];
    const sql = `UPDATE ${quoteIdentifier(table)} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    const rows = (await prisma.$queryRawUnsafe(sql, ...values)) as Array<
      Record<string, unknown>
    >;
    return rows[0] ?? null;
  });
}

export async function deleteRowAction(
  target: DbTarget,
  table: string,
  where: Record<string, unknown>
) {
  return withDb(target, async (prisma) => {
    const { primaryKeys } = await loadTableMeta(prisma, table);
    if (!primaryKeys.length) {
      throw new Error("У таблицы нет первичного ключа.");
    }
    const missingKeys = primaryKeys.filter(
      (key) => where[key] === undefined || where[key] === null
    );
    if (missingKeys.length) {
      throw new Error(`Не заданы ключи: ${missingKeys.join(", ")}`);
    }
    const whereValues = primaryKeys.map((key) => where[key]);
    const whereClause = primaryKeys
      .map((key, index) => `${quoteIdentifier(key)} = $${index + 1}`)
      .join(" AND ");
    const sql = `DELETE FROM ${quoteIdentifier(table)} WHERE ${whereClause} RETURNING *`;
    const rows = (await prisma.$queryRawUnsafe(sql, ...whereValues)) as Array<
      Record<string, unknown>
    >;
    return rows[0] ?? null;
  });
}
