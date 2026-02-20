/**
 * Employment History Tab
 * Renders Employment History from Work Experience Metadata API: current employment status,
 * current employment table, previous work experience table. CRUD via Salesforce sobjects APIs.
 */

import { ReactElement, useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import DynamicFormField from 'components/settings/DynamicFormField';
import DataTable, { Column } from 'components/table/DataTable';
import WorkExperienceModal from 'components/profile/WorkExperienceModal';
import ConfirmModal from 'components/feedback/ConfirmModal';
import { fetchWorkExperienceMetadata } from 'store/action/EmploymentHistoryActions';
import {
  createEmploymentRecord,
  updateEmploymentRecord,
  deleteEmploymentRecord,
} from 'store/action/EmploymentHistoryActions';
import type {
  ProfileField,
  EmploymentHistoryRecord,
} from 'store/types/profileMetadata';

/** Default pagination: 5 records per page */
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export interface EmploymentHistoryTabProps {
  accountId: string;
  formValues: Record<string, string>;
  onFieldChange: (apiName: string, value: string) => void;
  disabledFieldApis: Set<string>;
  /** Records per page (default 5) */
  defaultPageSize?: number;
  /** Page size dropdown options (default [5, 10, 25, 50]) */
  pageSizeOptions?: number[];
}

/** Fields to hide from table columns (show in modal only) */
const HIDE_FROM_TABLE_APIS = new Set([
  'Job_Responsibilities__c',
  'Experience__c',
]);

/** Only Organisation Type column gets fixed width + truncate (long picklist values) */
const ORGANISATION_TYPE_WIDTH = '260px';

const EmploymentHistoryTab = ({
  accountId,
  formValues,
  onFieldChange,
  disabledFieldApis,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: EmploymentHistoryTabProps): ReactElement => {
  const dispatch = useAppDispatch();
  const workExperienceMetadata = useAppSelector(
    (state) => state.workExperienceMetadata.metadata
  );
  const accountData = useAppSelector((state) => state.accountData.accountData);
  const [workExperienceModalOpen, setWorkExperienceModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EmploymentHistoryRecord | null>(null);
  const [deleteConfirmRecord, setDeleteConfirmRecord] = useState<EmploymentHistoryRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchWorkExperienceMetadata());
  }, [dispatch]);

  const employmentRecords = accountData?.Employment_History__r?.records ?? [];
  const currentEmploymentRecords = employmentRecords.filter(
    (r: EmploymentHistoryRecord) => r.Is_Current_Employment__c === true
  );
  const previousEmploymentRecords = employmentRecords.filter(
    (r: EmploymentHistoryRecord) => r.Is_Current_Employment__c !== true
  );

  const metadata = workExperienceMetadata;
  const currentEmploymentStatusField = metadata?.currentEmploymentStatus ?? null;
  const subSection1 = metadata?.subSection1;
  const subSection2 = metadata?.subSection2;

  const tableFieldsFromSection = (section: { sectionFields: ProfileField[] } | undefined) =>
    section?.sectionFields.filter(
      (f: ProfileField) => !HIDE_FROM_TABLE_APIS.has(f.apiName)
    ) ?? [];

  const currentTableFields = tableFieldsFromSection(subSection1);
  const previousTableFields = tableFieldsFromSection(subSection2);

  const buildColumns = (
    tableFields: ProfileField[]
  ): Column<EmploymentHistoryRecord>[] => [
    {
      key: 'Id',
      header: 'No.',
      sortable: false,
      width: '60px',
      render: (_value, _row, index) => (index !== undefined ? index + 1 : ''),
    },
    ...tableFields.map((field: ProfileField) => {
      const key = field.apiName as keyof EmploymentHistoryRecord;
      const isOrgType = field.apiName === 'Organisation_Type__c';
      return {
        key,
        header: field.label,
        sortable: true,
        ...(isOrgType && {
          width: ORGANISATION_TYPE_WIDTH,
          render: (_val: unknown, row: EmploymentHistoryRecord) => {
            const text = row[key] != null ? String(row[key]) : '';
            return (
              <span
                className="block truncate max-w-full"
                title={text || undefined}
                style={{ maxWidth: ORGANISATION_TYPE_WIDTH }}
              >
                {text}
              </span>
            );
          },
        }),
      };
    }),
    {
      key: 'Id' as keyof EmploymentHistoryRecord,
      header: 'Action',
      sortable: false,
      width: '120px',
      render: (_value, row) => (
        <div className="flex gap-2">
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => {
              setEditingRecord(row);
              setWorkExperienceModalOpen(true);
            }}
          >
            Edit
          </button>
          <span>|</span>
          <button
            type="button"
            className="text-red-600 hover:text-red-800"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirmRecord(row);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const currentEmploymentColumns = useMemo(
    () => buildColumns(currentTableFields),
    [currentTableFields]
  );
  const previousEmploymentColumns = useMemo(
    () => buildColumns(previousTableFields),
    [previousTableFields]
  );

  const handleDelete = async (row: EmploymentHistoryRecord) => {
    if (!row.Id) return;
    setActionError(null);
    setDeleting(true);
    try {
      await dispatch(deleteEmploymentRecord(row.Id, accountId));
      setDeleteConfirmRecord(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };


  const handleModalSave = async (data: Partial<EmploymentHistoryRecord>) => {
    setActionError(null);
    const body: Record<string, unknown> = { ...data };
    try {
      if (editingRecord?.Id) {
        await dispatch(updateEmploymentRecord(editingRecord.Id, accountId, body));
      } else {
        await dispatch(createEmploymentRecord(accountId, body));
      }
      setEditingRecord(null);
      setWorkExperienceModalOpen(false);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Save failed');
    }
  };

  const handleCloseModal = () => {
    setEditingRecord(null);
    setWorkExperienceModalOpen(false);
  };

  const handleOpenNew = () => {
    setEditingRecord(null);
    setWorkExperienceModalOpen(true);
  };

  if (!metadata) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Loading employment history...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {actionError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
          {actionError}
        </div>
      )}

      {currentEmploymentStatusField && (
        <div className="mb-4">
        
          <DynamicFormField
            field={currentEmploymentStatusField}
            value={formValues[currentEmploymentStatusField.apiName] ?? ''}
            onChange={(value) => onFieldChange(currentEmploymentStatusField.apiName, value)}
            disabled={disabledFieldApis.has(currentEmploymentStatusField.apiName)}
          />
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {subSection1?.subSectionName ?? 'Current Employment'}
          </h2>
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
            onClick={handleOpenNew}
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
          defaultPageSize={defaultPageSize}
          pageSizeOptions={pageSizeOptions}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {subSection2?.subSectionName ?? 'Previous Work Experience'}
          </h2>
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleOpenNew}
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
          defaultPageSize={defaultPageSize}
          pageSizeOptions={pageSizeOptions}
        />
      </div>

      <WorkExperienceModal
        open={workExperienceModalOpen}
        onClose={handleCloseModal}
        onSave={handleModalSave}
        initialData={editingRecord ?? undefined}
      />

      <ConfirmModal
        open={!!deleteConfirmRecord}
        onClose={() => setDeleteConfirmRecord(null)}
        onConfirm={() => {
          if (deleteConfirmRecord) void handleDelete(deleteConfirmRecord);
        }}
        title="Delete employment record?"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleting}
        loadingLabel="Deleting..."
      />
    </div>
  );
};

export default EmploymentHistoryTab;
