import { X } from "lucide-react";

function ErrorMessage({ error, className = "", onClose=undefined }: ErrorMessageProps) {
  return (
    <div
      className={`w-full flex justify-between bg-red-500 px-2 py-1 rounded font-bold text-red-200 z-30 ${className}`}
    >
      <p>{error}</p>
      {onClose && (
        <X
          className="cursor-pointer hover:scale-110 transition-transform"
          onClick={onClose}
        />
      )}
    </div>
  );
}

export default ErrorMessage;
