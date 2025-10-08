import type { Note } from "~/utils/types";

/**
 * In-browser localStorage CRUD for notes.
 * Persists under key 'notes_v1' and seeds with a default note if empty.
 */
const STORAGE_KEY = "notes_v1";

// PUBLIC_INTERFACE
export function getNotes(): Note[] {
  /** Returns all notes sorted by updatedAt desc, seeding if none exist. */
  const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
  let notes: Note[] = [];
  if (raw) {
    try {
      notes = JSON.parse(raw) as Note[];
    } catch {
      notes = [];
    }
  }
  if (!notes || notes.length === 0) {
    notes = [seedNote()];
    persist(notes);
  }
  return notes.sort((a, b) => b.updatedAt - a.updatedAt);
}

// PUBLIC_INTERFACE
export function getNote(id: string): Note | undefined {
  /** Fetch a note by id from localStorage. */
  return getNotes().find((n) => n.id === id);
}

// PUBLIC_INTERFACE
export function createNote(data?: Partial<Pick<Note, "title" | "body">>): Note {
  /** Creates a new note with a generated ID and persists it. */
  const id = safeUUID();
  const now = Date.now();
  const newNote: Note = {
    id,
    title: data?.title ?? "Untitled",
    body: data?.body ?? "",
    updatedAt: now,
  };
  const notes = getNotes();
  const next = [newNote, ...notes];
  persist(next);
  return newNote;
}

// PUBLIC_INTERFACE
export function updateNote(id: string, patch: Partial<Pick<Note, "title" | "body">>): Note | undefined {
  /** Updates a note with partial fields and persists changes. */
  const notes = getNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return undefined;
  const updated: Note = {
    ...notes[idx],
    ...patch,
    updatedAt: Date.now(),
  };
  const next = [...notes];
  next[idx] = updated;
  persist(next);
  return updated;
}

// PUBLIC_INTERFACE
export function deleteNote(id: string): boolean {
  /** Deletes a note by id and persists. Returns true if deleted. */
  const notes = getNotes();
  const next = notes.filter((n) => n.id !== id);
  persist(next);
  return next.length !== notes.length;
}

function persist(notes: Note[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function seedNote(): Note {
  return {
    id: safeUUID(),
    title: "Welcome",
    body:
      "Welcome to Simple Notes!\n\n" +
      "- Create a new note with the New Note button.\n" +
      "- Click a note to edit its title and body.\n" +
      "- Your notes are saved in your browser.\n\n" +
      "This is a temporary local-only store. A backend can be added later.",
    updatedAt: Date.now(),
  };
}

function safeUUID(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    try {
      return crypto.randomUUID();
    } catch {
      // fallthrough
    }
  }
  return `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
