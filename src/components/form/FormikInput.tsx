/**
 * Reusable Formik text/date input with label and error message.
 */

import { ReactElement } from 'react';
import { useField } from 'formik';

const inputClass = 'w-full border border-gray-300 rounded px-3 py-2';
const inputErrorClass = 'w-full border border-red-500 rounded px-3 py-2';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'text-red-600 text-xs mt-1';

export interface FormikInputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'date' | 'number';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  maxLength?: number;
}

const FormikInput = ({
  name,
  label,
  type = 'text',
  placeholder,
  required,
  disabled,
  readOnly,
  className = '',
  maxLength,
}: FormikInputProps): ReactElement => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  const baseClass = hasError ? inputErrorClass : inputClass;

  return (
    <div className={className}>
      <label className={labelClass} htmlFor={name}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={name}
        type={type}
        className={readOnly ? `${baseClass} bg-gray-50` : baseClass}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        tabIndex={readOnly ? -1 : undefined}
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

export default FormikInput;
