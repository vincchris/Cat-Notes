import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { MOODS } from './types';

export const now = () => new Date().toISOString();
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const moodList = MOODS.map((m) => `'${m}'`).join(',');

let conn: Promise<SQLite.SQLiteDatabase> | null = null;
export const getDb = () => (conn ??= open());

async function open() {
  const d = await SQLite.openDatabaseAsync('mellownotes.db');
  await d.execAsync('PRAGMA foreign_keys = ON;');
  if (Platform.OS !== 'web') await d.execAsync('PRAGMA journal_mode = WAL;');
  const row = await d.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  if ((row?.user_version ?? 0) < 1) {
    await d.withTransactionAsync(async () => {
      await d.execAsync(`
        CREATE TABLE categories(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK(length(trim(name)) BETWEEN 1 AND 40),
          icon TEXT NOT NULL DEFAULT '📒', color TEXT NOT NULL, created_at TEXT NOT NULL);
        CREATE TABLE notes(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL CHECK(length(trim(title)) BETWEEN 1 AND 120),
          content TEXT NOT NULL DEFAULT '',
          category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
          mood TEXT CHECK(mood IS NULL OR mood IN (${moodList})),
          color TEXT, is_favorite INTEGER NOT NULL DEFAULT 0, is_pinned INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL, updated_at TEXT NOT NULL, unlock_at TEXT);
        CREATE TABLE daily_moods(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          mood TEXT NOT NULL CHECK(mood IN (${moodList})),
          reflection TEXT, mood_date TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL);
        CREATE INDEX idx_notes_category ON notes(category_id);
        CREATE INDEX idx_notes_created ON notes(created_at);`);
      // Starter categories (real rows the user can edit or delete).
      const starters: [string, string, string][] = [['Daily', '☀️', '#F7DDB2'], ['Ideas', '💡', '#DCD3F7'], ['Dreams', '🌙', '#F6C9D4']];
      for (const [n, i, c] of starters) await d.runAsync('INSERT INTO categories(name,icon,color,created_at) VALUES(?,?,?,?)', n, i, c, now());
      await d.execAsync('PRAGMA user_version = 1');
    });
  }
  return d;
}

