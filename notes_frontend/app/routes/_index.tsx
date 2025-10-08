import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useNavigate } from "@remix-run/react";
import { useCallback } from "react";
import Sidebar from "~/components/Sidebar";
import { createNote, getNotes, updateNote, deleteNote } from "~/utils/storage.client";

// Index route will render the base 2-column layout with sidebar and an empty state in main.

// PUBLIC_INTERFACE
export async function loader() {
  /** Loader returns placeholder; notes are hydrated client-side from localStorage. */
  return json({ ok: true });
}

// PUBLIC_INTERFACE
export async function action({ request }: ActionFunctionArgs) {
  /** Handle create/update/delete actions issued from this index route. */
  const form = await request.formData();
  const intent = form.get("_action");

  if (intent === "create") {
    const title = String(form.get("title") || "");
    const body = String(form.get("body") || "");
    const note = createNote({ title: title || "Untitled", body });
    return redirect(`/notes/${note.id}`);
  }

  if (intent === "update") {
    const id = String(form.get("id") || "");
    const title = String(form.get("title") || "");
    const body = String(form.get("body") || "");
    if (!id) return json({ ok: false, error: "Missing id" }, { status: 400 });
    const updated = updateNote(id, { title, body });
    return json({ ok: !!updated, id });
  }

  if (intent === "delete") {
    const id = String(form.get("id") || "");
    if (!id) return json({ ok: false, error: "Missing id" }, { status: 400 });
    deleteNote(id);
    return redirect("/");
  }

  if (intent === "new") {
    const note = createNote();
    return redirect(`/notes/${note.id}`);
  }

  return json({ ok: true });
}

export default function Index() {
  const notes = getNotes(); // hydrate from localStorage on client
  const navigate = useNavigate();

  const handleNew = useCallback(() => {
    const note = createNote();
    navigate(`/notes/${note.id}`);
  }, [navigate]);

  return (
    <div className="flex h-screen">
      <Sidebar notes={notes} onNew={handleNew} />
      <main className="flex min-w-0 flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Simple Notes</h1>
            <p className="text-sm text-gray-500">
              Ocean Professional • Clean and modern with blue & amber accents
            </p>
          </div>
          <form method="post">
            <input type="hidden" name="_action" value="new" />
            <button className="btn" type="submit" aria-label="Create new note">
              + New Note
            </button>
          </form>
        </div>

        <section className="card flex flex-1 items-center justify-center p-8 text-center">
          <div>
            <h2 className="mb-2 text-lg font-medium">No note selected</h2>
            <p className="mb-4 text-gray-600">
              Create a new note or pick one from the sidebar to get started.
            </p>
            <form method="post">
              <input type="hidden" name="_action" value="new" />
              <button className="btn" type="submit">
                + Create your first note
              </button>
            </form>
          </div>
        </section>
      </main>
      <Outlet />
    </div>
  );
}
