/**
 * Reusable Formik select dropdown with label and error message.
 */

import { ReactElement } from 'react';
import { useField } from 'formik';

const selectClass = 'w-full border border-gray-300 rounded px-3 py-2';
const selectErrorClass = 'w-full border border-red-500 rounded px-3 py-2';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'text-red-600 text-xs mt-1';

export interface FormikSelectOption {
  value: string;
  label: string;
}

export interface FormikSelectProps {
  name: string;
  label: string;
  options: readonly string[] | FormikSelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const FormikSelect = ({
  name,
  label,
  options,
  placeholder = '--Choose--',
  required,
  disabled,
  className = '',
}: FormikSelectProps): ReactElement => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  const baseClass = hasError ? selectErrorClass : selectClass;

  const optionList: FormikSelectOption[] = options.length > 0 && typeof options[0] === 'string'
    ? (options as readonly string[]).map((opt) => ({ value: opt, label: opt }))
    : (options as FormikSelectOption[]);

  return (
    <div className={className}>
      <label className={labelClass} htmlFor={name}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <select
        id={name}
        className={baseClass}
        disabled={disabled}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? `${name}-error` : undefined}
        {...field}
      >
        <option value="">{placeholder}</option>
        {optionList.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hasError && (
        <p id={`${name}-error`} className={errorClass} role="alert">
          {meta.error}
        </p>
      )}
    </div>
  );
};

export default FormikSelect;
