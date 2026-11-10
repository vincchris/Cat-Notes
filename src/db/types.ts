export const MOODS = ['happy', 'calm', 'excited', 'sad', 'overwhelmed'] as const;
export type Mood = (typeof MOODS)[number];
export const MOOD_ICON: Record<Mood, string> = { happy: '😊', calm: '😌', excited: '🤩', sad: '😢', overwhelmed: '😵' };
export type Note = {
  id: number; title: string; content: string | null; category_id: number | null; mood: Mood | null; color: string | null;
  is_favorite: number; is_pinned: number; created_at: string; updated_at: string; unlock_at: string | null; locked: number;
  category_name: string | null; category_icon: string | null;
};
export type Category = { id: number; name: string; icon: string; color: string; created_at: string; note_count: number };
export type DayMood = { id: number; mood: Mood; reflection: string | null; mood_date: string; created_at: string };

