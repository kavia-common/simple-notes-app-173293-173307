import { NavLink } from "@remix-run/react";
import type { Note } from "~/utils/types";

// PUBLIC_INTERFACE
export default function NoteList({ notes }: { notes: Note[] }) {
  /** Renders the list of notes with active highlight. */
  if (!notes.length) {
    return (
      <div className="text-sm text-gray-500">
        No notes found. Try creating a new note.
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {notes.map((n) => (
        <li key={n.id}>
          <NavLink
            prefetch="intent"
            to={`/notes/${n.id}`}
            className={({ isActive }) =>
              `block rounded-md border p-3 transition-colors ${
                isActive
                  ? "border-blue-200 bg-blue-50 text-blue-900"
                  : "border-transparent hover:border-blue-100 hover:bg-blue-50/50"
              }`
            }
            aria-label={`Open note: ${n.title || "Untitled"}`}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-medium">
                {n.title?.trim() || "Untitled"}
              </span>
              <time
                className="text-xs text-gray-500"
                dateTime={new Date(n.updatedAt).toISOString()}
                title={new Date(n.updatedAt).toLocaleString()}
              >
                {timeAgo(n.updatedAt)}
              </time>
            </div>
            {n.body ? (
              <p className="truncate text-sm text-gray-600">{n.body}</p>
            ) : (
              <p className="truncate text-sm italic text-gray-400">No content</p>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function timeAgo(ts: number): string {
  const delta = Math.max(0, Date.now() - ts);
  const sec = Math.floor(delta / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}
