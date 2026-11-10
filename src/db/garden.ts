import { getDb } from './client';

// ---------- Memory Garden: one plant per day you actually wrote, computed from notes ----------
export async function garden() {
  return (await getDb()).getAllAsync<{ d: string; n: number }>(
    `SELECT date(created_at,'localtime') AS d, COUNT(*) AS n FROM notes GROUP BY d ORDER BY d DESC LIMIT 28`);
}
