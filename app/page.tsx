import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Заметки</h1>
        <p className={styles.subtitle}>
          Данные читаются из PostgreSQL (Neon) через Prisma.
        </p>
        <ul className={styles.list}>
          {notes.map((note) => (
            <li key={note.id} className={styles.card}>
              <div className={styles.cardTitle}>{note.title}</div>
              <div className={styles.cardMeta}>
                {note.createdAt.toISOString()}
              </div>
            </li>
          ))}
          {notes.length === 0 && (
            <li className={styles.empty}>Нет заметок</li>
          )}
        </ul>
      </main>
    </div>
  );
}
