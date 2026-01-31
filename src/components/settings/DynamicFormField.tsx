import { ReactElement } from 'react';
import type { ProfileField } from 'store/types/profileMetadata';

/**
 * Dynamic Form Field Component
 * Renders form fields based on field type from API metadata
 */
interface DynamicFormFieldProps {
  field: ProfileField;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const DynamicFormField = ({
  field,
  value = '',
  onChange,
  className = '',
}: DynamicFormFieldProps): ReactElement => {
  const isRequired = field.required === 'true';
  const labelClass = `block text-gray-700 mb-1 ${isRequired ? '' : ''}`;

  /**
   * Render input field based on fieldType
   */
  const renderField = () => {
    const baseInputClass = 'w-full border border-gray-300 rounded px-3 py-2';
    const baseSelectClass = 'w-full border border-gray-300 rounded px-3 py-2';

    switch (field.fieldType) {
      case 'PICKLIST':
        // For PICKLIST fields, render a select dropdown
        // Note: In a real implementation, you'd fetch picklist values from API
        // For now, if value exists, show it as selected option
        return (
          <select
            className={baseSelectClass}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
          >
            <option value="">Select</option>
            {/* Show current value as option if it exists and is not empty */}
            {/* This ensures the value is displayed as selected even if picklist options aren't loaded yet */}
            {value && value.trim() !== '' && (
              <option value={value}>
                {value}
              </option>
            )}
            {/* TODO: Fetch picklist values from API based on apiName */}
          </select>
        );

      case 'MULTIPICKLIST':
        // For MULTIPICKLIST fields, render checkboxes
        // Note: In a real implementation, you'd fetch picklist values from API
        return (
          <div className="space-y-2">
            {/* TODO: Fetch picklist values from API and render as checkboxes */}
            <p className="text-sm text-gray-500">Multi-select options will be loaded from API</p>
          </div>
        );

      case 'DATE':
        return (
          <input
            type="date"
            className={baseInputClass}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
          />
        );

      case 'EMAIL':
        return (
          <input
            type="email"
            className={baseInputClass}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
          />
        );

      case 'PHONE':
        return (
          <input
            type="tel"
            className={baseInputClass}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
          />
        );

      case 'DOUBLE':
        return (
          <input
            type="number"
            step="any"
            className={baseInputClass}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
          />
        );

      case 'TEXTAREA':
        return (
          <textarea
            className={`${baseInputClass} min-h-[100px]`}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
          />
        );

      case 'STRING':
      default:
        return (
          <input
            type="text"
            className={baseInputClass}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
          />
        );
    }
  };

  return (
    <div className={className}>
      <label className={labelClass}>
        {field.label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
    </div>
  );
};

export default DynamicFormField;
