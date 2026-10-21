import { AlertCircle, CheckCircle, X } from "lucide-react";

interface AlertProps {
  message: string;
  type?: "success" | "error";
  onClose?: () => void;
}

export default function Alert({
  message,
  type = "success",
  onClose,
}: AlertProps) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      role="alert"
      className={`mb-5 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {isSuccess ? (
        <CheckCircle size={18} className="shrink-0" />
      ) : (
        <AlertCircle size={18} className="shrink-0" />
      )}

      <span className="flex-1">{message}</span>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="ml-auto inline-flex shrink-0 items-center justify-center rounded-md p-1 transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-current"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}