import { Link, useLocation } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import type { Note } from "~/utils/types";
import NoteList from "~/components/NoteList";

// PUBLIC_INTERFACE
export default function Sidebar({
  notes,
  onNew,
}: {
  /** List of all notes to display in the sidebar */
  notes: Note[];
  /** Callback to create a new note (client-side optimistic) */
  onNew: () => void;
}) {
  const [query, setQuery] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset search when changing selection
    setQuery("");
  }, [pathname]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q)
    );
  }, [query, notes]);

  return (
    <aside className="sidebar h-full w-80 shrink-0 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          Notes
        </h2>
        <span className="badge" aria-label={`${notes.length} notes`}>
          {notes.length}
        </span>
      </div>

      <div className="mb-3">
        <label htmlFor="search" className="visually-hidden">
          Search notes
        </label>
        <input
          id="search"
          aria-label="Search notes"
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
          type="search"
        />
      </div>

      <div className="mb-4 flex gap-2">
        <button type="button" className="btn flex-1" onClick={onNew} aria-label="Create a new note">
          + New Note
        </button>
        <Link
          to="/"
          prefetch="intent"
          className="btn btn-secondary"
          aria-label="Home"
        >
          Home
        </Link>
      </div>

      <div className="overflow-auto pr-1" style={{ maxHeight: "calc(100% - 140px)" }}>
        <NoteList notes={filtered} />
      </div>
    </aside>
  );
}
