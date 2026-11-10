import { getDb, now } from './client';
import { DayMood, MOODS, Mood } from './types';

// ---------- Daily moods (one entry per day) ----------
export const listMoods = async () => (await getDb()).getAllAsync<DayMood>('SELECT * FROM daily_moods ORDER BY mood_date DESC');
export async function saveMood(i: { id?: number; mood: Mood; reflection: string; mood_date: string }) {
  if (!MOODS.includes(i.mood)) throw new Error('Pick one of the moods.');
  if (i.reflection.length > 1000) throw new Error('Reflection can be at most 1,000 characters.');
  const d = await getDb(); const ref = i.reflection.trim() || null;
  if (i.id) await d.runAsync('UPDATE daily_moods SET mood=?,reflection=? WHERE id=?', i.mood, ref, i.id);
  else await d.runAsync(
    `INSERT INTO daily_moods(mood,reflection,mood_date,created_at) VALUES(?,?,?,?)
     ON CONFLICT(mood_date) DO UPDATE SET mood=excluded.mood, reflection=excluded.reflection`, i.mood, ref, i.mood_date, now());
}
export const deleteMood = async (id: number) => { await (await getDb()).runAsync('DELETE FROM daily_moods WHERE id=?', id); };

