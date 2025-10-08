Simple Notes App (Frontend)

- Remix + Vite template with Tailwind already configured.
- Ocean Professional theme via app/styles/global.css with CSS variables.
- Client-side persistence using localStorage 'notes_v1' (see app/utils/storage.client.ts).
- Routes:
  - _index.tsx: Layout with sidebar + empty state and actions for create/update/delete.
  - notes.$noteId.tsx: View/edit a specific note using loader/action and Editor component.
- Components:
  - Sidebar, NoteList, Editor, ConfirmDialog.
- Accessibility:
  - Buttons have clear labels, confirm dialog is focusable, Escape to close.
- Seed:
  - On first load, a 'Welcome' note is created if no notes exist.

Dev:
  npm run dev
```Open http://localhost:3000```
