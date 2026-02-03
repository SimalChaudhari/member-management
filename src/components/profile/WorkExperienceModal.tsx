/**
 * Work Experience Modal
 * Form modal for adding/editing employment history. UI matches Edit Profile (Tailwind, same form style).
 */

import { ReactElement, useState, useEffect } from 'react';
import IconifyIcon from 'components/base/IconifyIcon';
import type { EmploymentHistoryRecord } from 'store/types/profileMetadata';
import { iscaBlue } from 'theme/colors';

const ORGANISATION_TYPES = ['Public', 'Private', 'NGO', 'Government', 'Others'];
const JOB_FUNCTIONS = ['Accounting', 'Audit', 'Tax', 'Advisory', 'Finance', 'Others'];
const EMPLOYMENT_STATUSES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Others'];
const INDUSTRIES = ['Accounting', 'Banking', 'Consulting', 'Manufacturing', 'Others'];
const JOB_LEVELS = ['Entry', 'Mid', 'Senior', 'Manager', 'Director', 'Others'];

const JOB_RESPONSIBILITIES_MAX = 2500;

const inputClass = 'w-full border border-gray-300 rounded px-3 py-2';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export interface WorkExperienceModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: Partial<EmploymentHistoryRecord>) => void;
  initialData?: Partial<EmploymentHistoryRecord> | null;
}

const emptyForm = {
  Employer_Name__c: '',
  Other_Organisation_Name__c: '',
  Organisation_Type__c: '',
  Job_Position__c: '',
  Job_Function__c: '',
  Employment_Start_Date__c: '',
  Employment_Status__c: '',
  Is_Current_Employment__c: true,
  Industry__c: '',
  Job_Level__c: '',
  Job_Responsibilities__c: '',
};

const WorkExperienceModal = ({
  open,
  onClose,
  onSave,
  initialData,
}: WorkExperienceModalProps): ReactElement => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          ...emptyForm,
          Employer_Name__c: initialData.Employer_Name__c ?? '',
          Other_Organisation_Name__c: initialData.Other_Organisation_Name__c ?? '',
          Organisation_Type__c: initialData.Organisation_Type__c ?? '',
          Job_Position__c: initialData.Job_Position__c ?? '',
          Job_Function__c: initialData.Job_Function__c ?? '',
          Employment_Start_Date__c: initialData.Employment_Start_Date__c ?? '',
          Employment_Status__c: initialData.Employment_Status__c ?? '',
          Is_Current_Employment__c: initialData.Is_Current_Employment__c ?? true,
          Industry__c: initialData.Industry__c ?? '',
          Job_Level__c: initialData.Job_Level__c ?? '',
          Job_Responsibilities__c: initialData.Job_Responsibilities__c ?? '',
        });
      } else {
        setForm({ ...emptyForm });
      }
    }
  }, [open, initialData]);

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const payload: Partial<EmploymentHistoryRecord> = {
      Employer_Name__c: form.Other_Organisation_Name__c || undefined,
      Other_Organisation_Name__c: form.Other_Organisation_Name__c || undefined,
      Organisation_Type__c: form.Organisation_Type__c || undefined,
      Job_Position__c: form.Job_Position__c || undefined,
      Job_Function__c: form.Job_Function__c || undefined,
      Employment_Start_Date__c: form.Employment_Start_Date__c || undefined,
      Employment_Status__c: form.Employment_Status__c || undefined,
      Is_Current_Employment__c: !!form.Is_Current_Employment__c,
      Industry__c: form.Industry__c || undefined,
      Job_Level__c: form.Job_Level__c || undefined,
      Job_Responsibilities__c: form.Job_Responsibilities__c || undefined,
    };
    onSave?.(payload);
    setForm({ ...emptyForm });
    onClose();
  };

  const handleClose = () => {
    setForm({ ...emptyForm });
    onClose();
  };

  if (!open) return <></>;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-experience-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - same style as Edit Profile sections */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 pb-4">
          <h2 id="work-experience-title" className="text-xl font-semibold text-gray-800">
            Work Experience
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
            aria-label="Close"
          >
            <IconifyIcon icon="mdi:close" width={24} height={24} />
          </button>
        </div>

        {/* Form - row by row: left field | right field (line to line) */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4 items-start">
            {/* Row 1 */}
            <div>
              <label className={labelClass}>
                Organisation Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="Organisation Name"
                value={form.Other_Organisation_Name__c}
                onChange={(e) => handleChange('Other_Organisation_Name__c', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                (If your organisation is not in the list, please type &apos;Others&apos;)
              </p>
            </div>
            <div>
              <span className={labelClass}>Is Current Employment?</span>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={form.Is_Current_Employment__c}
                  onChange={(e) =>
                    handleChange('Is_Current_Employment__c', e.target.checked)
                  }
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
            </div>

            {/* Row 2 */}
            <div>
              <label className={labelClass}>
                Organisation Type <span className="text-red-500">*</span>
              </label>
              <select
                className={inputClass}
                value={form.Organisation_Type__c}
                onChange={(e) => handleChange('Organisation_Type__c', e.target.value)}
              >
                <option value="">--Choose--</option>
                {ORGANISATION_TYPES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                className={inputClass}
                value={form.Industry__c}
                onChange={(e) => handleChange('Industry__c', e.target.value)}
              >
                <option value="">--Choose--</option>
                {INDUSTRIES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 3 */}
            <div>
              <label className={labelClass}>
                Job Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="Job Position"
                value={form.Job_Position__c}
                onChange={(e) => handleChange('Job_Position__c', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>
                Job Level <span className="text-red-500">*</span>
              </label>
              <select
                className={inputClass}
                value={form.Job_Level__c}
                onChange={(e) => handleChange('Job_Level__c', e.target.value)}
              >
                <option value="">--Choose--</option>
                {JOB_LEVELS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 4: Job Function, Period From, Employment Status - one line */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>
                  Job Function <span className="text-red-500">*</span>
                </label>
                <select
                  className={inputClass}
                  value={form.Job_Function__c}
                  onChange={(e) => handleChange('Job_Function__c', e.target.value)}
                >
                  <option value="">--Choose--</option>
                  {JOB_FUNCTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Period From <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="DD/MM/YYYY"
                  value={form.Employment_Start_Date__c}
                  onChange={(e) => handleChange('Employment_Start_Date__c', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Employment Status <span className="text-red-500">*</span>
                </label>
                <select
                  className={inputClass}
                  value={form.Employment_Status__c}
                  onChange={(e) => handleChange('Employment_Status__c', e.target.value)}
                >
                  <option value="">--Choose--</option>
                  {EMPLOYMENT_STATUSES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description - full width at the end */}
          <div className="mt-4">
            <label className={labelClass}>
              Description of Job Responsibilities <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`${inputClass} min-h-[100px] w-full`}
              placeholder="Description of Job Responsibilities"
              value={form.Job_Responsibilities__c}
              onChange={(e) =>
                handleChange(
                  'Job_Responsibilities__c',
                  e.target.value.slice(0, JOB_RESPONSIBILITIES_MAX),
                )
              }
              maxLength={JOB_RESPONSIBILITIES_MAX}
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Max {JOB_RESPONSIBILITIES_MAX} characters
            </p>
          </div>

          {/* Footer - buttons on right end */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 text-white rounded hover:opacity-90"
                style={{ backgroundColor: iscaBlue[500] }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceModal;
