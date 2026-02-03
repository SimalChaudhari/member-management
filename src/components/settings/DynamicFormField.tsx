import { ReactElement } from 'react';
import type { ProfileField } from 'store/types/profileMetadata';

/** Predefined picklist options by field apiName */
const PICKLIST_OPTIONS: Record<string, string[]> = {
  Gender__c: ['Male', 'Female'],
  Marital_Status__c: ['Single', 'Married', 'Divorced', 'Separated', 'Widowed'],
  Communication_Preference__c: ['Email', 'Post', 'SMS', 'In-App', 'None'],
  Voice_Calls__c: ['Consent', 'Do Not Consent'],
  Text_Messages__c: ['Consent', 'Do Not Consent'],
  Fax_Messages__c: ['Consent', 'Do Not Consent'],
};

/** Predefined multipicklist options by field apiName (matches API response values) */
const MULTIPICKLIST_OPTIONS: Record<string, string[]> = {
  Topic_Preference__c: ['Accounting', 'Tax', 'Audit', 'Advisory', 'Other'],
  Internship_Opportunities__c: ['Accounting', 'Tax', 'Audit', 'Advisory', 'Other'], // Area of Interest
  Area_of_Interest__c: ['Accounting', 'Tax', 'Audit', 'Advisory', 'Other'],
  Subscription_Preference__c: [
    "Practitioners' Bulletin",
    'Business & Finance Bulletin',
    'Monthly Chartered Accountants Lab',
    'Special ISCA offerings and events',
    "Participate in ISCA's research and surveys",
    'ISCAccountify Bulletin',
    'Financial Forensic Focus',
    'Unsubscribe from the above EDMs.',
  ], // Electronic Mailer Subscription
  Voice_Calls__c: ['Consent', 'Do Not Consent'],
  Text_Messages__c: ['Consent', 'Do Not Consent'],
  Fax_Messages__c: ['Consent', 'Do Not Consent'],
};

/** PICKLIST fields that use radio buttons instead of dropdown */
const PICKLIST_RADIO_FIELDS = new Set([
  'Voice_Calls__c',
  'Text_Messages__c',
  'Fax_Messages__c',
]);

/**
 * Dynamic Form Field Component
 * Renders form fields based on field type from API metadata
 */
interface DynamicFormFieldProps {
  field: ProfileField;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const DynamicFormField = ({
  field,
  value = '',
  onChange,
  className = '',
  disabled = false,
}: DynamicFormFieldProps): ReactElement => {
  const isRequired = field.required === 'true';
  const labelClass = `block text-gray-700 mb-1 ${isRequired ? '' : ''}`;

  /**
   * Render input field based on fieldType
   */
  const renderField = () => {
    const disabledClass = disabled ? ' bg-gray-100 cursor-not-allowed' : '';
    const baseInputClass = `w-full border border-gray-300 rounded px-3 py-2${disabledClass}`;
    const baseSelectClass = `w-full border border-gray-300 rounded px-3 py-2${disabledClass}`;

    switch (field.fieldType) {
      case 'PICKLIST': {
        const options = PICKLIST_OPTIONS[field.apiName];
        const useRadio = PICKLIST_RADIO_FIELDS.has(field.apiName) && options?.length;
        if (useRadio) {
          return (
            <div className="space-y-2">
              {options.map((opt: string) => (
                <label
                  key={opt}
                  className={`flex items-center gap-2 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  <input
                    type="radio"
                    name={field.apiName}
                    value={opt}
                    checked={(value || '') === opt}
                    onChange={() => onChange?.(opt)}
                    disabled={disabled}
                    className="border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          );
        }
        return (
          <select
            className={baseSelectClass}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
            disabled={disabled}
          >
            <option value="">Select</option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            {/* Fallback: show current value if not in predefined options */}
            {!options && value && value.trim() !== '' && (
              <option value={value}>{value}</option>
            )}
          </select>
        );
      }

      case 'MULTIPICKLIST': {
        const options =
          field.picklistValues ??
          MULTIPICKLIST_OPTIONS[field.apiName] ??
          (value
            ? value
                .split(/[;,]/)
                .map((v) => v.trim())
                .filter(Boolean)
            : []);
        const selectedSet = new Set(
          (value ?? '')
            .split(/[;,]/)
            .map((v) => v.trim())
            .filter(Boolean)
        );
        const handleToggle = (opt: string, checked: boolean) => {
          const newSet = new Set(selectedSet);
          if (checked) newSet.add(opt);
          else newSet.delete(opt);
          onChange?.(Array.from(newSet).join(';'));
        };
        if (options.length === 0) {
          return (
            <p className="text-sm text-gray-500">
              {value ? value : 'No options available'}
            </p>
          );
        }
        return (
          <div className="space-y-2">
            {options.map((opt: string) => (
              <label
                key={opt}
                className={`flex items-center gap-2 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedSet.has(opt)}
                  onChange={(e) => handleToggle(opt, e.target.checked)}
                  disabled={disabled}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        );
      }

      case 'DATE':
        return (
          <input
            type="date"
            className={baseInputClass}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
          />
        );

      case 'TEXTAREA':
        return (
          <textarea
            className={`${baseInputClass} min-h-[100px]`}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            required={isRequired}
            disabled={disabled}
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
            disabled={disabled}
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
