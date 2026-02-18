/**
 * Reusable confirmation modal.
 * Use for delete or other destructive/important actions that need user confirmation.
 */

import { ReactElement } from 'react';

export type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 'danger' for red (e.g. delete), 'primary' for primary color */
  variant?: 'danger' | 'primary';
  /** When true, confirm button shows loading state and can be disabled */
  loading?: boolean;
  /** Text shown on confirm button when loading (default: "Please wait...") */
  loadingLabel?: string;
};

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  loadingLabel = 'Please wait...',
}: ConfirmModalProps): ReactElement => {
  if (!open) return <></>;

  const handleConfirm = () => {
    void Promise.resolve(onConfirm());
  };

  const confirmClass =
    variant === 'danger'
      ? 'px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50'
      : 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmClass}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
