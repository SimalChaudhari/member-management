/**
 * Employment History Tab
 * Renders Employment History section: current employment status, current employment table, previous work experience table.
 */

import { ReactElement, useState } from 'react';
import DynamicFormField from 'components/settings/DynamicFormField';
import DataTable, { Column } from 'components/table/DataTable';
import WorkExperienceModal from 'components/profile/WorkExperienceModal';
import type {
  ProfileField,
  ProfileSection,
  EmploymentHistoryRecord,
  AccountDataResponse,
} from 'store/types/profileMetadata';

export interface EmploymentHistoryTabProps {
  employmentHistory: ProfileSection;
  accountData: AccountDataResponse | null;
  formValues: Record<string, string>;
  onFieldChange: (apiName: string, value: string) => void;
  disabledFieldApis: Set<string>;
}

const EmploymentHistoryTab = ({
  employmentHistory,
  accountData,
  formValues,
  onFieldChange,
  disabledFieldApis,
}: EmploymentHistoryTabProps): ReactElement => {
  const [workExperienceModalOpen, setWorkExperienceModalOpen] = useState(false);

  const employmentRecords = accountData?.Employment_History__r?.records || [];
  const currentEmploymentRecords = employmentRecords.filter(
    (record: EmploymentHistoryRecord) => record.Is_Current_Employment__c === true,
  );
  const previousEmploymentRecords = employmentRecords.filter(
    (record: EmploymentHistoryRecord) => record.Is_Current_Employment__c !== true,
  );

  const currentEmploymentStatusField = employmentHistory.sectionFields.find(
    (field: ProfileField) =>
      field.apiName.toLowerCase().includes('current') &&
      field.apiName.toLowerCase().includes('status'),
  );

  const tableFields = employmentHistory.sectionFields.filter(
    (field: ProfileField) =>
      !field.apiName.toLowerCase().includes('current') &&
      !field.apiName.toLowerCase().includes('status') &&
      !field.apiName.toLowerCase().includes('responsibilities') &&
      !field.apiName.toLowerCase().includes('experience') &&
      !field.apiName.toLowerCase().includes('other') &&
      field.fieldType !== 'DATE' &&
      !field.apiName.toLowerCase().includes('date'),
  );

  const currentEmploymentColumns: Column<EmploymentHistoryRecord>[] = [
    {
      key: 'Id',
      header: 'No.',
      sortable: false,
      width: '60px',
      render: (_value, _row, index) => (index !== undefined ? index + 1 : ''),
    },
    ...tableFields.map((field: ProfileField) => ({
      key: field.apiName as keyof EmploymentHistoryRecord,
      header: field.label,
      sortable: true,
    })),
    {
      key: 'Id' as keyof EmploymentHistoryRecord,
      header: 'Action',
      sortable: false,
      width: '120px',
      render: () => (
        <div className="flex gap-2">
          <button type="button" className="text-blue-600 hover:text-blue-800">
            Edit
          </button>
          <span>|</span>
          <button type="button" className="text-red-600 hover:text-red-800">
            Delete
          </button>
        </div>
      ),
    },
  ];

  const previousEmploymentColumns: Column<EmploymentHistoryRecord>[] = [
    {
      key: 'Id',
      header: 'No.',
      sortable: false,
      width: '60px',
      render: (_value, _row, index) => (index !== undefined ? index + 1 : ''),
    },
    ...tableFields.map((field: ProfileField) => ({
      key: field.apiName as keyof EmploymentHistoryRecord,
      header: field.label,
      sortable: true,
    })),
    {
      key: 'Id' as keyof EmploymentHistoryRecord,
      header: 'Action',
      sortable: false,
      width: '120px',
      render: () => (
        <div className="flex gap-2">
          <button type="button" className="text-blue-600 hover:text-blue-800">
            Edit
          </button>
          <span>|</span>
          <button type="button" className="text-red-600 hover:text-red-800">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {currentEmploymentStatusField && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {currentEmploymentStatusField.label}
          </label>
          <DynamicFormField
            field={currentEmploymentStatusField}
            value={formValues[currentEmploymentStatusField.apiName] || ''}
            onChange={(value) => onFieldChange(currentEmploymentStatusField.apiName, value)}
            disabled={disabledFieldApis.has(currentEmploymentStatusField.apiName)}
          />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Current Employment</h2>
        </div>

        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="w-auto min-w-[300px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Primary Employment
            </label>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">Select</option>
              {currentEmploymentRecords.map((record: EmploymentHistoryRecord) => (
                <option key={record.Id} value={record.Id}>
                  {record.Employer_Name__c ||
                    record.Other_Organisation_Name__c ||
                    'Unnamed'}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 whitespace-nowrap"
            onClick={() => setWorkExperienceModalOpen(true)}
          >
            + New
          </button>
        </div>

        <DataTable<EmploymentHistoryRecord>
          data={currentEmploymentRecords}
          columns={currentEmploymentColumns}
          emptyMessage="No data available"
          showSearch={false}
          showHeader={false}
          defaultPageSize={10}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Previous Work Experience
          </h2>
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => setWorkExperienceModalOpen(true)}
          >
            + New
          </button>
        </div>

        <DataTable<EmploymentHistoryRecord>
          data={previousEmploymentRecords}
          columns={previousEmploymentColumns}
          emptyMessage="No data available"
          showSearch={false}
          showHeader={false}
          defaultPageSize={10}
        />
      </div>

      <WorkExperienceModal
        open={workExperienceModalOpen}
        onClose={() => setWorkExperienceModalOpen(false)}
        onSave={(data) => {
          // TODO: Call API to save employment record
          console.log('Work experience save:', data);
        }}
      />
    </div>
  );
};

export default EmploymentHistoryTab;
