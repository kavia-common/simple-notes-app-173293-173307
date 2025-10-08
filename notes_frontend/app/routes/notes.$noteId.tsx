import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import Editor from "~/components/Editor";
import Sidebar from "~/components/Sidebar";
import { createNote, deleteNote, getNotes, updateNote } from "~/utils/storage.client";

// PUBLIC_INTERFACE
export async function loader({ params }: LoaderFunctionArgs) {
  /** Loads the selected note ID; content will be hydrated on client. */
  const noteId = params.noteId || "";
  return json({ noteId });
}

// PUBLIC_INTERFACE
export async function action({ request, params }: ActionFunctionArgs) {
  /** Handles update/delete for a specific note by ID. */
  const id = params.noteId || "";
  const form = await request.formData();
  const intent = form.get("_action");

  if (intent === "update") {
    const title = String(form.get("title") || "");
    const body = String(form.get("body") || "");
    const updated = updateNote(id, { title, body });
    return json({ ok: !!updated, id });
  }

  if (intent === "delete") {
    deleteNote(id);
    return redirect("/");
  }

  if (intent === "create") {
    const note = createNote();
    return redirect(`/notes/${note.id}`);
  }

  return json({ ok: true });
}

export default function NoteDetailRoute() {
  const { noteId } = useLoaderData<typeof loader>();
  const notes = getNotes();
  const note = notes.find((n) => n.id === noteId);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <Sidebar
        notes={notes}
        onNew={() => {
          const n = createNote();
          navigate(`/notes/${n.id}`);
        }}
      />

      <main className="flex min-w-0 flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Simple Notes</h1>
            <p className="text-sm text-gray-500">
              Ocean Professional • Clean and modern with blue & amber accents
            </p>
          </div>

          <Form method="post">
            <input type="hidden" name="_action" value="create" />
            <button className="btn" type="submit" aria-label="Create new note">
              + New Note
            </button>
          </Form>
        </div>

        {!note ? (
          <section className="card flex flex-1 items-center justify-center p-8 text-center">
            <div>
              <h2 className="mb-2 text-lg font-medium">Note not found</h2>
              <p className="mb-4 text-gray-600">
                The note you’re looking for doesn’t exist. Create a new one instead.
              </p>
              <Form method="post">
                <input type="hidden" name="_action" value="create" />
                <button className="btn" type="submit">
                  + Create note
                </button>
              </Form>
            </div>
          </section>
        ) : (
          <section className="card flex-1 p-4">
            <Editor
              note={note}
              onDelete={() => {
                // Submit a delete form programmatically
                const form = document.createElement("form");
                form.method = "post";
                const a = document.createElement("input");
                a.type = "hidden";
                a.name = "_action";
                a.value = "delete";
                form.appendChild(a);
                document.body.appendChild(form);
                form.submit();
              }}
            />
          </section>
        )}
      </main>
    </div>
  );
}
