import { getDb, now } from './client';
import { MOODS, Mood, Note } from './types';

// ---------- Notes (Time Capsule enforced here: locked content is never returned) ----------
const SEL = `SELECT n.id,n.title,
  CASE WHEN COALESCE(n.unlock_at>?,0) THEN NULL ELSE n.content END AS content,
  n.category_id,n.mood,n.color,n.is_favorite,n.is_pinned,n.created_at,n.updated_at,n.unlock_at,
  COALESCE(n.unlock_at>?,0) AS locked, c.name AS category_name, c.icon AS category_icon
  FROM notes n LEFT JOIN categories c ON c.id=n.category_id`;
const SORTS = { newest: 'n.created_at DESC', oldest: 'n.created_at ASC', updated: 'n.updated_at DESC', title: 'n.title COLLATE NOCASE ASC' };
export type Sort = keyof typeof SORTS;

export async function listNotes(f: { q?: string; categoryId?: number | null; mood?: Mood | null; sort?: Sort; limit?: number } = {}) {
  const d = await getDb(); const t = now();
  const where: string[] = []; const args: (string | number)[] = [t, t];
  if (f.q?.trim()) { where.push('(n.title LIKE ? OR (COALESCE(n.unlock_at<=?,1) AND n.content LIKE ?))'); const s = `%${f.q.trim()}%`; args.push(s, t, s); }
  if (f.categoryId) { where.push('n.category_id=?'); args.push(f.categoryId); }
  if (f.mood) { where.push('n.mood=?'); args.push(f.mood); }
  const sql = `${SEL} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY n.is_pinned DESC, ${SORTS[f.sort ?? 'newest']} ${f.limit ? 'LIMIT ' + f.limit : ''}`;
  return d.getAllAsync<Note>(sql, args);
}
export async function getNote(id: number) {
  const d = await getDb(); const t = now();
  return d.getFirstAsync<Note>(`${SEL} WHERE n.id=?`, t, t, id);
}
export type NoteInput = {
  id?: number; title: string; content: string; category_id: number | null; mood: Mood | null; color: string | null;
  is_favorite: boolean; is_pinned: boolean; unlock_at: string | null;
};
export async function saveNote(i: NoteInput) {
  const title = i.title.trim();
  if (!title) throw new Error('Give your note a title.');
  if (title.length > 120) throw new Error('Title can be at most 120 characters.');
  if (i.content.length > 50000) throw new Error('Note is too long (50,000 characters max).');
  if (i.mood && !MOODS.includes(i.mood)) throw new Error('Unknown mood.');
  const d = await getDb(); const t = now();
  if (i.id) {
    // Content stays untouched while the capsule is locked, even if the UI sends something.
    await d.runAsync(
      `UPDATE notes SET title=?, content=CASE WHEN COALESCE(unlock_at>?,0) THEN content ELSE ? END, category_id=?, mood=?, color=?,
       is_favorite=?, is_pinned=?, unlock_at=?, updated_at=? WHERE id=?`,
      title, t, i.content, i.category_id, i.mood, i.color, +i.is_favorite, +i.is_pinned, i.unlock_at, t, i.id);
    return i.id;
  }
  const r = await d.runAsync(
    `INSERT INTO notes(title,content,category_id,mood,color,is_favorite,is_pinned,created_at,updated_at,unlock_at) VALUES(?,?,?,?,?,?,?,?,?,?)`,
    title, i.content, i.category_id, i.mood, i.color, +i.is_favorite, +i.is_pinned, t, t, i.unlock_at);
  return r.lastInsertRowId;
}
export async function deleteNote(id: number) { await (await getDb()).runAsync('DELETE FROM notes WHERE id=?', id); }
export async function toggleNote(id: number, col: 'is_favorite' | 'is_pinned') {
  await (await getDb()).runAsync(`UPDATE notes SET ${col}=1-${col} WHERE id=?`, id);
}
export async function openCapsuleNow(id: number) { await (await getDb()).runAsync('UPDATE notes SET unlock_at=NULL, updated_at=? WHERE id=?', now(), id); }

