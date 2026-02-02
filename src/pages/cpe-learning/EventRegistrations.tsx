/**
 * ============================================================================
 * CPE LEARNING MODULE - Event Registrations (My Events > Registrations)
 * ============================================================================
 *
 * Displays course/event registration data from getCourseReg API.
 *
 * Related Files:
 * - store/action/CourseRegistrationActions.tsx
 * - store/types/courseRegistration.ts
 * - store/reducer/CourseRegistrationReducer.tsx
 * - config/appColors.ts
 * - components/table/DataTable.tsx
 * ============================================================================
 */

import { ReactElement, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { fetchCourseRegistrations } from 'store/action/CourseRegistrationActions';
import DataTable, { Column } from 'components/table/DataTable';
import PageLoader from 'components/loading/PageLoader';
import { appColors } from 'config/appColors';
import type {
  CourseRegistrationRecord,
  CourseRegistrationColumn,
} from 'store/types/courseRegistration';

const EventRegistrations = (): ReactElement => {
  const dispatch = useAppDispatch();

  const { data, columns, loading, error } = useAppSelector(
    (state) => state.courseRegistration
  );

  useEffect(() => {
    if (!data && !loading) {
      dispatch(fetchCourseRegistrations());
    }
  }, [dispatch, data, loading]);

  const tableColumns: Column<CourseRegistrationRecord>[] = useMemo(() => {
    if (!columns || columns.length === 0) return [];

    const result: Column<CourseRegistrationRecord>[] = [];

    const wrapColumns = [
      'Course_Instance__r.Course_Display_Name__c', // Course Title
      'Course_Instance__c', // Date & Time
    ];

    columns.forEach((col: CourseRegistrationColumn) => {
      if (col.apiName === 'Id' || col.apiName === 'SSO_Visibility_Date__c') {
        return;
      }

      result.push({
        key: col.apiName as keyof CourseRegistrationRecord,
        header: col.label,
        sortable: true,
        wrap: wrapColumns.includes(col.apiName),
      });
    });

    return result;
  }, [columns]);

  const tableData = useMemo(() => data || [], [data]);

  const trainingMethodologyFilterOptions = useMemo(() => {
    if (!data || data.length === 0) return [];
    const unique = new Set<string>();
    data.forEach((record: CourseRegistrationRecord) => {
      const val = record['Course_Code__r.Training_Methodology__c'];
      if (val) unique.add(String(val));
    });
    return Array.from(unique)
      .sort()
      .map((v) => ({ value: v, label: v }));
  }, [data]);

  const regStatusFilterOptions = useMemo(() => {
    if (!data || data.length === 0) return [];
    const unique = new Set<string>();
    data.forEach((record: CourseRegistrationRecord) => {
      const val = record['Registration_Status__c'];
      if (val) unique.add(String(val));
    });
    return Array.from(unique)
      .sort()
      .map((v) => ({ value: v, label: v }));
  }, [data]);

  const filterOptions = useMemo(() => {
    const options = [];
    if (trainingMethodologyFilterOptions.length > 0) {
      options.push({
        key: 'Course_Code__r.Training_Methodology__c' as keyof CourseRegistrationRecord,
        label: 'Training Methodology',
        options: trainingMethodologyFilterOptions,
      });
    }
    if (regStatusFilterOptions.length > 0) {
      options.push({
        key: 'Registration_Status__c' as keyof CourseRegistrationRecord,
        label: 'Reg. Status',
        options: regStatusFilterOptions,
      });
    }
    return options;
  }, [trainingMethodologyFilterOptions, regStatusFilterOptions]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div style={{ backgroundColor: appColors.background.page }}>
      <h1
        className="text-xl font-bold pt-4 px-2 sm:pt-8 sm:px-0 sm:ml-6 mb-4 sm:mb-6"
        style={{ color: appColors.text.primary }}
      >
        Registrations
      </h1>

      <div className="px-2 sm:px-0 sm:ml-6 sm:mr-6">
        <div
          className="rounded-lg shadow mb-4 sm:mb-6 overflow-hidden"
          style={{ backgroundColor: appColors.background.card }}
        >
          <div
            className="px-3 py-3 sm:px-6 sm:py-4 rounded-t-lg"
            style={{
              backgroundColor: appColors.header.background,
              color: appColors.header.text,
            }}
          >
            <h2 className="text-lg font-semibold">My Event Registrations</h2>
          </div>

          <div className="p-2 sm:p-6">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            ) : (
              <DataTable<CourseRegistrationRecord>
                data={tableData}
                columns={tableColumns}
                emptyMessage="No event registrations found"
                showSearch={true}
                showHeader={true}
                showFilters={filterOptions.length > 0}
                filterOptions={filterOptions}
                defaultPageSize={10}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrations;
