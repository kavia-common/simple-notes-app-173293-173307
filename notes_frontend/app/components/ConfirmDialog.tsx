import { useEffect } from "react";

// PUBLIC_INTERFACE
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: {
  /** Whether the dialog is visible */
  open: boolean;
  /** Dialog title */
  title: string;
  /** Dialog description */
  description?: string;
  /** Confirm button label */
  confirmText?: string;
  /** Cancel button label */
  cancelText?: string;
  /** Danger styling for destructive actions */
  danger?: boolean;
  /** Confirm callback */
  onConfirm: () => void;
  /** Cancel callback */
  onCancel: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="card relative z-10 w-full max-w-md p-5">
        <h3 id="confirm-title" className="text-lg font-semibold">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel} aria-label={cancelText}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${danger ? "btn-danger" : ""}`}
            onClick={onConfirm}
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
