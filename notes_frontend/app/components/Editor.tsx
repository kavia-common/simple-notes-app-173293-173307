import { Form, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { Note } from "~/utils/types";
import ConfirmDialog from "~/components/ConfirmDialog";

// PUBLIC_INTERFACE
export default function Editor({
  note,
  onDelete,
}: {
  /** The currently selected note */
  note: Note;
  /** Handler to delete the note (opens confirm) */
  onDelete?: () => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState<null | "saved" | "deleted">(null);
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  useEffect(() => {
    if (isSubmitting) return;
    // show saved toast briefly when action finishes
    if (navigation.formMethod === "POST") {
      setSaved("saved");
      const t = setTimeout(() => setSaved(null), 1200);
      return () => clearTimeout(t);
    }
  }, [isSubmitting, navigation.formMethod]);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Edit Note
        </h2>
        <div className="flex items-center gap-2">
          {saved === "saved" && (
            <span className="text-sm text-green-600" role="status" aria-live="polite">
              Saved
            </span>
          )}
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setShowConfirm(true)}
            aria-label="Delete note"
          >
            Delete
          </button>
        </div>
      </div>

      <Form
        method="post"
        replace
        className="card flex flex-1 flex-col gap-3 p-4"
      >
        <input type="hidden" name="_action" value="update" />
        <input type="hidden" name="id" value={note.id} />
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={note.title}
            placeholder="Title"
            className="input mt-1"
            aria-label="Note title"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">
            Body (Markdown supported)
          </label>
          <textarea
            id="body"
            name="body"
            defaultValue={note.body}
            placeholder="Start typing..."
            className="textarea mt-1 h-64"
            aria-label="Note body"
          />
        </div>

        <div className="mt-auto flex items-center justify-end gap-2">
          <button type="submit" className="btn" aria-label="Save note" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </button>
        </div>
      </Form>

      <ConfirmDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          setSaved("deleted");
          onDelete?.();
        }}
        title="Delete this note?"
        description="This action cannot be undone. Your note will be permanently removed."
        confirmText="Delete"
        danger
      />
    </div>
  );
}
