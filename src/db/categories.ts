import { getDb, now } from './client';
import { Category } from './types';

// ---------- Categories ----------
export async function listCategories() {
  return (await getDb()).getAllAsync<Category>(
    `SELECT c.*, (SELECT COUNT(*) FROM notes n WHERE n.category_id=c.id) AS note_count FROM categories c ORDER BY c.name COLLATE NOCASE`);
}
export async function saveCategory(i: { id?: number; name: string; icon: string; color: string }) {
  const name = i.name.trim();
  if (!name) throw new Error('Give your category a name.');
  if (name.length > 40) throw new Error('Name can be at most 40 characters.');
  const d = await getDb();
  try {
    if (i.id) await d.runAsync('UPDATE categories SET name=?,icon=?,color=? WHERE id=?', name, i.icon || '📒', i.color, i.id);
    else await d.runAsync('INSERT INTO categories(name,icon,color,created_at) VALUES(?,?,?,?)', name, i.icon || '📒', i.color, now());
  } catch (e: any) {
    if (String(e.message).includes('UNIQUE')) throw new Error('You already have a category with that name.');
    throw e;
  }
}
/** Refuses to delete a category that still has notes unless the caller explicitly chooses to move them to "No category". */
export async function deleteCategory(id: number, moveNotes = false) {
  const d = await getDb();
  const r = await d.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM notes WHERE category_id=?', id);
  if ((r?.n ?? 0) > 0 && !moveNotes) throw new Error('IN_USE');
  await d.withTransactionAsync(async () => {
    await d.runAsync('UPDATE notes SET category_id=NULL WHERE category_id=?', id);
    await d.runAsync('DELETE FROM categories WHERE id=?', id);
  });
}

