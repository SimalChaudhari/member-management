/**
 * Work Experience Modal
 * Form modal for adding/editing employment history. Uses Formik + Yup validation and reusable form components.
 */

import { ReactElement, useMemo } from 'react';
import { Formik, Form } from 'formik';
import IconifyIcon from 'components/base/IconifyIcon';
import type { EmploymentHistoryRecord } from 'store/types/profileMetadata';
import { iscaBlue } from 'theme/colors';
import {
  ORGANISATION_TYPES,
  JOB_FUNCTIONS,
  EMPLOYMENT_STATUSES,
  INDUSTRIES,
  JOB_LEVELS,
  JOB_RESPONSIBILITIES_MAX,
} from 'config/workExperienceConstants';
import { workExperienceFormSchema, type WorkExperienceFormValues } from 'config/workExperienceValidation';
import { FormikInput, FormikSelect, FormikTextarea, FormikCheckbox } from 'components/form';

/** Format Salesforce Experience__c for display */
function formatExperienceDisplay(value: string): string {
  if (!value || typeof value !== 'string') return value;
  return value
    .replace(/\bYear\(s\)/g, 'Years')
    .replace(/\bMonth\(s\)/g, 'Months')
    .replace(/\bYear\b(?!s)/g, 'Year')
    .replace(/\bMonth\b(?!s)/g, 'Month');
}

export interface WorkExperienceModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: Partial<EmploymentHistoryRecord>) => void;
  initialData?: Partial<EmploymentHistoryRecord> | null;
  saving?: boolean;
}

const emptyFormValues: WorkExperienceFormValues = {
  Employer_Name__c: '',
  Other_Organisation_Name__c: '',
  Organisation_Type__c: '',
  Job_Position__c: '',
  Job_Function__c: '',
  Employment_Start_Date__c: '',
  Employment_End_Date__c: '',
  Employment_Status__c: '',
  Is_Current_Employment__c: true,
  Industry__c: '',
  Job_Level__c: '',
  Job_Responsibilities__c: '',
  Experience__c: '',
};

const WorkExperienceModal = ({
  open,
  onClose,
  onSave,
  initialData,
  saving = false,
}: WorkExperienceModalProps): ReactElement => {
  const initialValues = useMemo((): WorkExperienceFormValues => {
    if (!open) return emptyFormValues;
    if (initialData) {
      return {
        ...emptyFormValues,
        Employer_Name__c: initialData.Employer_Name__c ?? '',
        Other_Organisation_Name__c: initialData.Other_Organisation_Name__c ?? '',
        Organisation_Type__c: initialData.Organisation_Type__c ?? '',
        Job_Position__c: initialData.Job_Position__c ?? '',
        Job_Function__c: initialData.Job_Function__c ?? '',
        Employment_Start_Date__c: initialData.Employment_Start_Date__c ?? '',
        Employment_End_Date__c: initialData.Employment_End_Date__c ?? '',
        Employment_Status__c: initialData.Employment_Status__c ?? '',
        Is_Current_Employment__c: initialData.Is_Current_Employment__c ?? true,
        Industry__c: initialData.Industry__c ?? '',
        Job_Level__c: initialData.Job_Level__c ?? '',
        Job_Responsibilities__c: initialData.Job_Responsibilities__c ?? '',
        Experience__c: formatExperienceDisplay(initialData.Experience__c ?? ''),
      };
    }
    return emptyFormValues;
  }, [open, initialData]);

  const handleSubmit = (values: WorkExperienceFormValues) => {
    const payload: Partial<EmploymentHistoryRecord> = {
      Employer_Name__c: values.Employer_Name__c || (values.Other_Organisation_Name__c ? 'Others' : undefined),
      Other_Organisation_Name__c: values.Other_Organisation_Name__c || undefined,
      Organisation_Type__c: values.Organisation_Type__c || undefined,
      Job_Position__c: values.Job_Position__c || undefined,
      Job_Function__c: values.Job_Function__c || undefined,
      Employment_Start_Date__c: values.Employment_Start_Date__c || undefined,
      Employment_End_Date__c: values.Employment_End_Date__c || undefined,
      Employment_Status__c: values.Employment_Status__c || undefined,
      Is_Current_Employment__c: !!values.Is_Current_Employment__c,
      Industry__c: values.Industry__c || undefined,
      Job_Level__c: values.Job_Level__c || undefined,
      Job_Responsibilities__c: values.Job_Responsibilities__c || undefined,
    };
    onSave?.(payload);
    onClose();
  };

  if (!open) return <></>;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-experience-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-6 pb-4">
          <h2 id="work-experience-title" className="text-xl font-semibold text-gray-800">
            Work Experience
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-600"
            aria-label="Close"
          >
            <IconifyIcon icon="mdi:close" width={24} height={24} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={workExperienceFormSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          <Form className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4 items-start">
              <div>
                <FormikInput
                  name="Other_Organisation_Name__c"
                  label="Organisation Name"
                  placeholder="Organisation Name"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  (If your organisation is not in the list, please type &apos;Others&apos;)
                </p>
              </div>
              <FormikCheckbox name="Is_Current_Employment__c" label="Is Current Employment?" />

              <FormikSelect
                name="Organisation_Type__c"
                label="Organisation Type"
                options={ORGANISATION_TYPES}
                required
              />
              <FormikSelect
                name="Industry__c"
                label="Industry"
                options={INDUSTRIES}
                required
              />

              <FormikInput
                name="Job_Position__c"
                label="Job Position"
                placeholder="Job Position"
                required
              />
              <FormikSelect
                name="Job_Level__c"
                label="Job Level"
                options={JOB_LEVELS}
                required
              />

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormikSelect
                  name="Job_Function__c"
                  label="Job Function"
                  options={JOB_FUNCTIONS}
                  required
                />
                <FormikInput
                  name="Employment_Start_Date__c"
                  label="Period From"
                  type="date"
                  required
                />
                <FormikInput name="Employment_End_Date__c" label="Period To" type="date" />
                <FormikSelect
                  name="Employment_Status__c"
                  label="Employment Status"
                  options={EMPLOYMENT_STATUSES}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <FormikInput
                  name="Experience__c"
                  label="Experience"
                  placeholder="Auto-calculated from dates"
                  readOnly
                />
              </div>
            </div>

            <div className="mt-4">
              <FormikTextarea
                name="Job_Responsibilities__c"
                label="Description of Job Responsibilities"
                placeholder="Description of Job Responsibilities"
                required
                rows={4}
                maxLength={JOB_RESPONSIBILITIES_MAX}
              />
              <p className="text-xs text-gray-500 mt-1">Max {JOB_RESPONSIBILITIES_MAX} characters</p>
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white rounded hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: iscaBlue[500] }}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default WorkExperienceModal;
