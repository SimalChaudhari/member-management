/**
 * Reusable Formik checkbox with label and error message.
 */

import { ReactElement } from 'react';
import { useField } from 'formik';

const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'text-red-600 text-xs mt-1';

export interface FormikCheckboxProps {
  name: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

const FormikCheckbox = ({
  name,
  label,
  description,
  disabled,
  className = '',
}: FormikCheckboxProps): ReactElement => {
  const [field, meta] = useField({ name, type: 'checkbox' });
  const hasError = meta.touched && meta.error;

  return (
    <div className={className}>
      <span className={labelClass}>{label}</span>
      <label className="flex items-center gap-2 cursor-pointer mt-2">
        <input
          type="checkbox"
          className="rounded border-gray-300"
          disabled={disabled}
          aria-invalid={hasError ? 'true' : undefined}
          {...field}
        />
        <span className="text-sm text-gray-700">{description ?? 'Yes'}</span>
      </label>
      {hasError && (
        <p className={errorClass} role="alert">
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default FormikCheckbox;
