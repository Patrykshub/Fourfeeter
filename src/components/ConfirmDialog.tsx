import { ModalHeader } from "./ModalHeader";

interface IConfirmDialogProps {
  title: string;
  message?: string;
  imageSrc?: string;
  imageAlt?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  title,
  message,
  imageSrc,
  imageAlt,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: IConfirmDialogProps) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-20">
    <div className="bg-[#061018] max-w-sm w-full rounded-lg p-6">
      <ModalHeader title={title} onClose={onCancel} />
      {imageSrc && (
        <img
          src={imageSrc}
          alt={imageAlt ?? ""}
          className="mt-4 w-full rounded-lg object-cover"
        />
      )}
      {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 bg-black/20 rounded">
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500/90 hover:bg-red-500 text-white rounded"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export { ConfirmDialog };
