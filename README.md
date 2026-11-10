# MellowNotes (Expo SDK 58)

Your little corner of thoughts. Local-first notes, categories and daily moods (SQLite).

```bash
npm install
npx expo start          # scan QR with Expo Go / dev build
npx expo start --web    # web version (press "w")
npm run typecheck
```

If VS Code shows "Cannot use JSX unless the '--jsx' flag is provided": run `npm install`, then
Command Palette > "TypeScript: Restart TS Server". `tsconfig.json` sets `"jsx": "react-jsx"` explicitly.

## Web notes
- expo-sqlite on web is alpha. `metro.config.js` adds the `.wasm` asset type and sends the
  `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy` headers the dev server needs.
- If you host the web build (`npx expo export -p web`), your host must send the same two headers
  (`same-origin` and `credentialless`) or the database will not open.
- Web data lives in the browser (per browser/profile); it does not sync with the phone app.

## Structure
```
App.tsx, index.ts, metro.config.js
src/
  db/          client (open + migrations), types, notes, categories, moods, garden
  theme/       tokens (colors), styles (shared text/input styles)
  components/  Btn, Chip, Card, Cat, NoteCard, States, TabBar, Toast, Typography
  screens/     Home, Notes, NoteDetail, NoteEditor, Categories, Moods, Settings
  hooks/       useQuery, useMascot, useToast
  navigation/  types, useAppNavigation
  lib/         alert (web-safe Alert), actions (confirm/run), format
```
