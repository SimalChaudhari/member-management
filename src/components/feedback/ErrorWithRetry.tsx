/**
 * Reusable error state with retry button.
 * Use when a fetch or action fails and the user can retry.
 * Full width, centered, with an attractive card-style UI.
 */

import { ReactElement } from 'react';
import { appColors } from 'config/appColors';

export type ErrorWithRetryProps = {
  /** Error message to display */
  message: string;
  /** Called when the user clicks Retry */
  onRetry: () => void;
  /** Button label (default: "Retry") */
  retryLabel?: string;
  /** Optional class names for the outer wrapper */
  className?: string;
};

const ErrorWithRetry = ({
  message,
  onRetry,
  retryLabel = 'Retry',
  className = '',
}: ErrorWithRetryProps): ReactElement => {
  return (
    <div
      className={`w-full min-h-[80vh] flex items-center justify-center p-8 ${className}`}
      style={{ backgroundColor: appColors.background.page }}
    >
      <div
        className="w-full max-w-md rounded-xl shadow-lg border p-8 text-center"
        style={{
          backgroundColor: appColors.background.card,
          borderColor: 'rgba(220, 38, 38, 0.2)',
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{ color: '#dc2626' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: appColors.text.primary }}
        >
          Something went wrong
        </h3>
        <p className="text-sm mb-6 text-red-600">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: appColors.primary.main }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = appColors.primary.hover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = appColors.primary.main;
          }}
        >
          {retryLabel}
        </button>
      </div>
    </div>
  );
};

export default ErrorWithRetry;
