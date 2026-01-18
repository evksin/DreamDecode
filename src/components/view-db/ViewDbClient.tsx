"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  createRowAction,
  deleteRowAction,
  getTablePageAction,
  listTablesAction,
  updateRowAction,
  type ColumnInfo,
  type DbTarget,
  type TablePage,
} from "@/actions/view-db";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";

const PAGE_SIZE = 10;

type FieldValues = Record<string, string>;

function toDateValue(value: unknown) {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
}

function pad2(value: number) {
  return value.toString().padStart(2, "0");
}

function formatDateForInput(date: Date, mode: "date" | "time" | "datetime") {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  if (mode === "date") return `${year}-${month}-${day}`;
  if (mode === "time") return `${hours}:${minutes}`;
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function coerceValue(column: ColumnInfo, rawValue: string) {
  const value = rawValue.trim();
  if (!value) return undefined;
  if (value.toLowerCase() === "null") return null;
  const type = column.dataType.toLowerCase();
  if (type.includes("bool")) {
    return value === "true" || value === "1" || value === "yes";
  }
  if (
    type.includes("int") ||
    type.includes("numeric") ||
    type.includes("double") ||
    type.includes("real") ||
    type.includes("decimal")
  ) {
    const numeric = Number(value);
    return Number.isNaN(numeric) ? value : numeric;
  }
  if (type === "array" || type.includes("[]")) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (type.includes("json")) {
    try {
      return JSON.parse(value) as unknown;
    } catch {
      return value;
    }
  }
  return value;
}

function buildPayload(values: FieldValues, columns: ColumnInfo[]) {
  return columns.reduce<Record<string, unknown>>((acc, column) => {
    const raw = values[column.name];
    if (raw === undefined) return acc;
    const coerced = coerceValue(column, raw);
    if (coerced === undefined) return acc;
    acc[column.name] = coerced;
    return acc;
  }, {});
}

function formatValue(column: ColumnInfo, value: unknown) {
  if (value === null || value === undefined) return "—";
  const type = column.dataType.toLowerCase();
  if (type.includes("timestamp")) {
    const date = toDateValue(value);
    return date ? date.toLocaleString("ru-RU") : String(value);
  }
  if (type === "date" || (type.includes("date") && !type.includes("update"))) {
    const date = toDateValue(value);
    return date ? date.toLocaleDateString("ru-RU") : String(value);
  }
  if (type.includes("time") && typeof value === "string") {
    return value;
  }
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

function valueToInputString(column: ColumnInfo, value: unknown) {
  if (value === null || value === undefined) return "";
  const type = column.dataType.toLowerCase();
  if (type.includes("timestamp")) {
    const date = toDateValue(value);
    return date ? formatDateForInput(date, "datetime") : String(value);
  }
  if (type === "date" || (type.includes("date") && !type.includes("update"))) {
    const date = toDateValue(value);
    return date ? formatDateForInput(date, "date") : String(value);
  }
  if (type.includes("time")) {
    if (typeof value === "string") return value.slice(0, 5);
    const date = toDateValue(value);
    return date ? formatDateForInput(date, "time") : String(value);
  }
  if (type.includes("bool")) return value ? "true" : "false";
  if (Array.isArray(value)) return value.map((item) => String(item)).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function sampleValueForColumn(column: ColumnInfo) {
  const type = column.dataType.toLowerCase();
  if (type.includes("bool")) return "true";
  if (type.includes("int")) return "1";
  if (
    type.includes("numeric") ||
    type.includes("double") ||
    type.includes("real") ||
    type.includes("decimal")
  ) {
    return "1.5";
  }
  if (type.includes("uuid")) return "00000000-0000-0000-0000-000000000000";
  if (type.includes("json")) return "{}";
  if (type === "array" || type.includes("[]")) return "one, two";
  if (type.includes("timestamp")) return formatDateForInput(new Date(), "datetime");
  if (type === "date" || type.includes("date")) {
    return formatDateForInput(new Date(), "date");
  }
  if (type.includes("time")) return formatDateForInput(new Date(), "time");
  return "Пример";
}

export function ViewDbClient() {
  const [target, setTarget] = useState<DbTarget>("local");
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TablePage | null>(null);
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [createValues, setCreateValues] = useState<FieldValues>({});
  const [updateKeys, setUpdateKeys] = useState<FieldValues>({});
  const [updateValues, setUpdateValues] = useState<FieldValues>({});
  const [deleteKeys, setDeleteKeys] = useState<FieldValues>({});
  const [editingRowKey, setEditingRowKey] = useState<string | null>(null);
  const [rowEdits, setRowEdits] = useState<FieldValues>({});
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    startTransition(async () => {
      try {
        setError(null);
        const result = await listTablesAction(target);
        setTables(result);
        setSelectedTable(null);
        setTableData(null);
        setPage(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки таблиц.");
        setTables([]);
      }
    });
  }, [target]);

  useEffect(() => {
    setCreateValues({});
    setUpdateKeys({});
    setUpdateValues({});
    setDeleteKeys({});
    setEditingRowKey(null);
    setRowEdits({});
    setSortColumn(null);
    setSortDirection("asc");
  }, [selectedTable]);

  const primaryKeys = useMemo(() => {
    if (!tableData?.primaryKeys.length) return "нет";
    return tableData.primaryKeys.join(", ");
  }, [tableData]);

  function openTable(
    table: string,
    nextPage = 1,
    nextSortColumn: string | null = sortColumn,
    nextSortDirection: "asc" | "desc" = sortDirection
  ) {
    startTransition(async () => {
      try {
        setError(null);
        const result = await getTablePageAction(
          target,
          table,
          nextPage,
          PAGE_SIZE,
          nextSortColumn ?? undefined,
          nextSortDirection
        );
        setSelectedTable(table);
        setTableData(result);
        setPage(nextPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки таблицы.");
      }
    });
  }

  function refreshTable() {
    if (!selectedTable) return;
    openTable(selectedTable, page);
  }

  async function handleCreate() {
    if (!selectedTable) return;
    startTransition(async () => {
      try {
        setError(null);
        if (!tableData) return;
        const payload = buildPayload(createValues, tableData.columns);
        await createRowAction(target, selectedTable, payload);
        setCreateValues({});
        refreshTable();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка создания записи.");
      }
    });
  }

  async function handleUpdate() {
    if (!selectedTable) return;
    startTransition(async () => {
      try {
        setError(null);
        if (!tableData) return;
        const keyColumns = tableData.columns.filter((column) => column.isPrimaryKey);
        const dataColumns = tableData.columns.filter((column) => !column.isPrimaryKey);
        const where = buildPayload(updateKeys, keyColumns);
        const data = buildPayload(updateValues, dataColumns);
        await updateRowAction(target, selectedTable, where, data);
        setUpdateKeys({});
        setUpdateValues({});
        refreshTable();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка обновления записи.");
      }
    });
  }

  async function handleDelete() {
    if (!selectedTable) return;
    startTransition(async () => {
      try {
        setError(null);
        if (!tableData) return;
        const keyColumns = tableData.columns.filter((column) => column.isPrimaryKey);
        const where = buildPayload(deleteKeys, keyColumns);
        await deleteRowAction(target, selectedTable, where);
        setDeleteKeys({});
        refreshTable();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка удаления записи.");
      }
    });
  }

  const totalPages = tableData
    ? Math.max(1, Math.ceil(tableData.total / tableData.pageSize))
    : 1;

  const keyColumns = tableData?.columns.filter((column) => column.isPrimaryKey) ?? [];
  const dataColumns =
    tableData?.columns.filter((column) => !column.isPrimaryKey) ?? [];

  function toggleSort(column: string) {
    if (!tableData) return;
    if (editingRowKey) return;
    const nextDirection =
      sortColumn === column ? (sortDirection === "asc" ? "desc" : "asc") : "asc";
    const nextColumn = column;
    setPage(1);
    setSortColumn(nextColumn);
    setSortDirection(nextDirection);
    openTable(selectedTable ?? tableData.table, 1, nextColumn, nextDirection);
  }

  function renderSortIndicator(column: string) {
    if (sortColumn !== column) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  }

  function getRowKey(row: Record<string, unknown>, rowIndex: number) {
    if (!keyColumns.length) return `${rowIndex}`;
    return keyColumns
      .map((column) => String(row[column.name] ?? ""))
      .join("|");
  }

  function beginInlineEdit(row: Record<string, unknown>, rowIndex: number) {
    const key = getRowKey(row, rowIndex);
    setEditingRowKey(key);
    setRowEdits(
      dataColumns.reduce<FieldValues>((acc, column) => {
        acc[column.name] = valueToInputString(column, row[column.name]);
        return acc;
      }, {})
    );
  }

  function cancelInlineEdit() {
    setEditingRowKey(null);
    setRowEdits({});
  }

  async function saveInlineEdit(row: Record<string, unknown>) {
    if (!selectedTable) return;
    if (!keyColumns.length) {
      setError("У таблицы нет первичного ключа для обновления.");
      return;
    }
    startTransition(async () => {
      try {
        setError(null);
        const where = keyColumns.reduce<Record<string, unknown>>((acc, column) => {
          acc[column.name] = row[column.name];
          return acc;
        }, {});
        const data = buildPayload(rowEdits, dataColumns);
        await updateRowAction(target, selectedTable, where, data);
        cancelInlineEdit();
        refreshTable();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка обновления строки.");
      }
    });
  }

  async function deleteInlineRow(row: Record<string, unknown>) {
    if (!selectedTable) return;
    if (!keyColumns.length) {
      setError("У таблицы нет первичного ключа для удаления.");
      return;
    }
    if (!window.confirm("Удалить выбранную строку?")) return;
    startTransition(async () => {
      try {
        setError(null);
        const where = keyColumns.reduce<Record<string, unknown>>((acc, column) => {
          acc[column.name] = row[column.name];
          return acc;
        }, {});
        await deleteRowAction(target, selectedTable, where);
        refreshTable();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка удаления строки.");
      }
    });
  }

  function fillCreateExample() {
    if (!tableData) return;
    setCreateValues(
      tableData.columns.reduce<FieldValues>((acc, column) => {
        acc[column.name] = sampleValueForColumn(column);
        return acc;
      }, {})
    );
  }

  function renderField(
    column: ColumnInfo,
    value: string,
    onChange: (next: string) => void
  ) {
    const type = column.dataType.toLowerCase();
    if (type.includes("timestamp")) {
      return (
        <Input
          type="datetime-local"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`Тип: ${column.dataType}`}
        />
      );
    }
    if (type === "date" || (type.includes("date") && !type.includes("update"))) {
      return (
        <Input
          type="date"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`Тип: ${column.dataType}`}
        />
      );
    }
    if (type.includes("time")) {
      return (
        <Input
          type="time"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`Тип: ${column.dataType}`}
        />
      );
    }
    if (type.includes("bool")) {
      return (
        <select
          className="form-input"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">—</option>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      );
    }
    if (type.includes("text")) {
      return (
        <Textarea
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`Тип: ${column.dataType}`}
          style={{ minHeight: "80px" }}
        />
      );
    }
    return (
      <Input
        type={
          type.includes("int") ||
          type.includes("numeric") ||
          type.includes("double") ||
          type.includes("real") ||
          type.includes("decimal")
            ? "number"
            : "text"
        }
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Тип: ${column.dataType}`}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="dreams-grid">
        <div className="dream-card">
          <h3 className="dream-title">Подключение</h3>
          <p className="dream-description">
            Выберите базу данных для просмотра.
          </p>
          <div className="emotion-chips">
            <button
              type="button"
              onClick={() => setTarget("local")}
              className={`emotion-chip ${target === "local" ? "active" : ""}`}
            >
              Локальная
            </button>
            <button
              type="button"
              onClick={() => setTarget("prod")}
              className={`emotion-chip ${target === "prod" ? "active" : ""}`}
            >
              Рабочая
            </button>
          </div>

          <div className="form-group" style={{ marginTop: "24px" }}>
            <div className="form-label">Список таблиц</div>
            {tables.length ? (
              <div className="space-y-2">
                {tables.map((table) => (
                  <div
                    key={table}
                    className="flex items-center justify-between"
                  >
                    <span className="dream-description">{table}</span>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => openTable(table)}
                    >
                      Открыть
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="dream-description">Таблицы не найдены.</p>
            )}
          </div>
        </div>

        <div className="dream-card">
          <h3 className="dream-title">
            {selectedTable ? `Таблица: ${selectedTable}` : "Данные таблицы"}
          </h3>
          <p className="dream-description">
            {tableData
              ? `PK: ${primaryKeys}. Строк: ${tableData.total}`
              : "Выберите таблицу слева."}
          </p>

          {tableData ? (
            <div style={{ overflowX: "auto", marginTop: "16px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr>
                    {tableData.columns.map((column) => (
                      <th
                        key={column.name}
                        style={{
                          textAlign: "left",
                          padding: "8px",
                          borderBottom: "1px solid var(--border-color)",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleSort(column.name)}
                      >
                        <span style={{ display: "inline-flex", gap: "6px" }}>
                          <span>{column.name}</span>
                          <span className="dream-description">
                            {renderSortIndicator(column.name)}
                          </span>
                        </span>
                      </th>
                    ))}
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px",
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rowIndex) => (
                    <tr key={`${tableData.table}-${rowIndex}`}>
                      {tableData.columns.map((column) => (
                        <td
                          key={`${rowIndex}-${column.name}`}
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid rgba(61, 59, 92, 0.4)",
                          }}
                        >
                          {editingRowKey === getRowKey(row, rowIndex) &&
                          !column.isPrimaryKey ? (
                            <div style={{ minWidth: "140px" }}>
                              {renderField(
                                column,
                                rowEdits[column.name] ?? "",
                                (next) =>
                                  setRowEdits((prev) => ({
                                    ...prev,
                                    [column.name]: next,
                                  }))
                              )}
                            </div>
                          ) : (
                            formatValue(column, row[column.name])
                          )}
                        </td>
                      ))}
                      <td
                        style={{
                          padding: "8px",
                          borderBottom: "1px solid rgba(61, 59, 92, 0.4)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {editingRowKey === getRowKey(row, rowIndex) ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => saveInlineEdit(row)}
                              disabled={pending}
                            >
                              Сохранить
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={cancelInlineEdit}
                              disabled={pending}
                            >
                              Отмена
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => beginInlineEdit(row, rowIndex)}
                              disabled={!keyColumns.length || pending}
                            >
                              Редактировать
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => deleteInlineRow(row)}
                              disabled={!keyColumns.length || pending}
                            >
                              Удалить
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {tableData ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                disabled={page <= 1 || pending}
                onClick={() => openTable(tableData.table, page - 1)}
              >
                ← Назад
              </button>
              <span className="dream-description">
                Страница {page} из {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={page >= totalPages || pending}
                onClick={() => openTable(tableData.table, page + 1)}
              >
                Вперёд →
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="dream-card">
          <p className="dream-description" style={{ color: "var(--accent-pink)" }}>
            {error}
          </p>
        </div>
      ) : null}

      {tableData ? (
        <div className="dreams-grid">
          <div className="dream-card">
            <h3 className="dream-title">Создать запись</h3>
            <p className="dream-description">
              Заполните нужные поля. Пустые значения будут пропущены.
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={fillCreateExample}
              disabled={pending}
              style={{ marginBottom: "12px" }}
            >
              Заполнить примером
            </button>
            <div className="space-y-3">
              {tableData.columns.map((column) => (
                <div key={`create-${column.name}`} className="form-group">
                  <label className="form-label">
                    {column.name}
                    {column.nullable ? "" : " *"}
                  </label>
                  {renderField(column, createValues[column.name] ?? "", (next) =>
                    setCreateValues((prev) => ({ ...prev, [column.name]: next }))
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: "12px" }}
              onClick={handleCreate}
              disabled={pending}
            >
              Создать
            </button>
          </div>

          <div className="dream-card">
            <h3 className="dream-title">Обновить запись</h3>
            <p className="dream-description">
              PK: {primaryKeys}. Сначала задайте ключи, затем поля для обновления.
            </p>
            <div className="space-y-3">
              {keyColumns.map((column) => (
                <div key={`update-key-${column.name}`} className="form-group">
                  <label className="form-label">{column.name} *</label>
                  {renderField(column, updateKeys[column.name] ?? "", (next) =>
                    setUpdateKeys((prev) => ({ ...prev, [column.name]: next }))
                  )}
                </div>
              ))}
            </div>
            <div style={{ height: "12px" }} />
            <div className="space-y-3">
              {dataColumns.map((column) => (
                <div key={`update-data-${column.name}`} className="form-group">
                  <label className="form-label">{column.name}</label>
                  {renderField(column, updateValues[column.name] ?? "", (next) =>
                    setUpdateValues((prev) => ({ ...prev, [column.name]: next }))
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: "12px" }}
              onClick={handleUpdate}
              disabled={pending}
            >
              Обновить
            </button>
          </div>

          <div className="dream-card">
            <h3 className="dream-title">Удалить запись</h3>
            <p className="dream-description">PK: {primaryKeys}.</p>
            <div className="space-y-3">
              {keyColumns.map((column) => (
                <div key={`delete-${column.name}`} className="form-group">
                  <label className="form-label">{column.name} *</label>
                  {renderField(column, deleteKeys[column.name] ?? "", (next) =>
                    setDeleteKeys((prev) => ({ ...prev, [column.name]: next }))
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: "12px" }}
              onClick={handleDelete}
              disabled={pending}
            >
              Удалить
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
