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

function parseJson(value: string) {
  if (!value.trim()) return {};
  return JSON.parse(value) as Record<string, unknown>;
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function ViewDbClient() {
  const [target, setTarget] = useState<DbTarget>("local");
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TablePage | null>(null);
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [createJson, setCreateJson] = useState("");
  const [updateWhereJson, setUpdateWhereJson] = useState("");
  const [updateDataJson, setUpdateDataJson] = useState("");
  const [deleteWhereJson, setDeleteWhereJson] = useState("");

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

  const primaryKeys = useMemo(() => {
    if (!tableData?.primaryKeys.length) return "нет";
    return tableData.primaryKeys.join(", ");
  }, [tableData]);

  function openTable(table: string, nextPage = 1) {
    startTransition(async () => {
      try {
        setError(null);
        const result = await getTablePageAction(
          target,
          table,
          nextPage,
          PAGE_SIZE
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
        const payload = parseJson(createJson);
        await createRowAction(target, selectedTable, payload);
        setCreateJson("");
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
        const where = parseJson(updateWhereJson);
        const data = parseJson(updateDataJson);
        await updateRowAction(target, selectedTable, where, data);
        setUpdateWhereJson("");
        setUpdateDataJson("");
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
        const where = parseJson(deleteWhereJson);
        await deleteRowAction(target, selectedTable, where);
        setDeleteWhereJson("");
        refreshTable();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка удаления записи.");
      }
    });
  }

  const totalPages = tableData
    ? Math.max(1, Math.ceil(tableData.total / tableData.pageSize))
    : 1;

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
                        }}
                      >
                        {column.name}
                      </th>
                    ))}
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
                          {formatValue(row[column.name])}
                        </td>
                      ))}
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
            <p className="dream-description">JSON объекта для вставки.</p>
            <Textarea
              placeholder='{"title":"Новый сон","description":"..."}'
              value={createJson}
              onChange={(event) => setCreateJson(event.target.value)}
              style={{ minHeight: "120px" }}
            />
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
              PK: {primaryKeys}. Укажите JSON для ключей и полей.
            </p>
            <Input
              placeholder='{"id":"..."}'
              value={updateWhereJson}
              onChange={(event) => setUpdateWhereJson(event.target.value)}
            />
            <div style={{ height: "12px" }} />
            <Textarea
              placeholder='{"title":"Обновлённый"}'
              value={updateDataJson}
              onChange={(event) => setUpdateDataJson(event.target.value)}
              style={{ minHeight: "120px" }}
            />
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
            <Input
              placeholder='{"id":"..."}'
              value={deleteWhereJson}
              onChange={(event) => setDeleteWhereJson(event.target.value)}
            />
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
