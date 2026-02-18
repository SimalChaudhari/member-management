/**
 * Reusable Formik textarea with label and error message.
 */

import { ReactElement } from 'react';
import { useField, useFormikContext } from 'formik';

const textareaClass = 'w-full border border-gray-300 rounded px-3 py-2 min-h-[100px]';
const textareaErrorClass = 'w-full border border-red-500 rounded px-3 py-2 min-h-[100px]';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'text-red-600 text-xs mt-1';

export interface FormikTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}

const FormikTextarea = ({
  name,
  label,
  placeholder,
  required,
  disabled,
  rows = 4,
  maxLength,
  className = '',
}: FormikTextareaProps): ReactElement => {
  const [field, meta] = useField(name);
  const { submitCount } = useFormikContext();
  const hasError = (meta.touched || submitCount > 0) && meta.error;
  const baseClass = hasError ? textareaErrorClass : textareaClass;

  return (
    <div className={className}>
      <label className={labelClass} htmlFor={name}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <textarea
        id={name}
        className={baseClass}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${name}-error` : undefined}
        {...field}
      />
      {hasError && (
        <p id={`${name}-error`} className={errorClass} role="alert">
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default FormikTextarea;
