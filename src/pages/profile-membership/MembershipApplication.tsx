/**
 * ============================================================================
 * PROFILE & MEMBERSHIP MODULE - Membership Application Page
 * ============================================================================
 * 
 * This component displays membership application data in a dynamic table format.
 * Fetches data from the RenewalMembership/MyApplication API endpoint.
 * 
 * Related Files:
 * - store/action/MembershipActions.tsx: Fetches membership application data
 * - store/types/membership.ts: Type definitions for application data
 * - store/reducer/MembershipReducer.tsx: Manages membership state
 * - config/appColors.ts: Centralized color configuration
 * - components/table/DataTable.tsx: Reusable table component
 * ============================================================================
 */

import { ReactElement, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { fetchMembershipHistory } from 'store/action/MembershipActions';
import DataTable, { Column } from 'components/table/DataTable';
import PageLoader from 'components/loading/PageLoader';
import { appColors } from 'config/appColors';
import type { MembershipApplicationRecord, MembershipApplicationColumn } from 'store/types/membership';

/**
 * Membership Application Page Component
 * Displays membership application data in a dynamic table with download/delete actions
 */
const MembershipApplication = (): ReactElement => {
  const dispatch = useAppDispatch();

  // Redux state for membership application data (using history endpoint)
  const { historyData, historyLoading, historyError } = useAppSelector(
    (state) => state.membership
  );

  // Get user ID from auth profile
  const { profile } = useAppSelector((state) => state.auth);

  /**
   * Get User ID from profile or use default for testing
   */
  const getUserId = (): string => {
    // Try to get from auth profile first
    if (profile?.user_id) {
      return profile.user_id;
    }
    
    // Check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('userId');
    
    if (userIdFromUrl) {
      return userIdFromUrl;
    }
    
    // Default user ID for testing - in production, this should always come from profile
    // TODO: Ensure user_id is available in auth profile
    return '005fV000000iqHdQAI';
  };

  /**
   * Fetch membership application data on component mount
   */
  useEffect(() => {
    const userId = getUserId();
    if (!historyData && !historyLoading) {
      dispatch(fetchMembershipHistory(userId));
    }
  }, [dispatch, historyData, historyLoading]);

  /**
   * Build dynamic table columns from API response
   * Filters out Action-related columns and creates a custom Action column
   */
  const applicationColumns: Column<MembershipApplicationRecord>[] = useMemo(() => {
    if (!historyData?.columns) return [];

    const columns: Column<MembershipApplicationRecord>[] = [];

    // Filter out action-related columns and create custom columns
    historyData.columns.forEach((col: MembershipApplicationColumn) => {
      // Skip action-related columns (we'll create a custom Action column)
      if (col.name === 'downloadUrl' || col.name === 'isDownload' || col.name === 'isDelete') {
        return;
      }

      // Map API column names to record keys
      let key: keyof MembershipApplicationRecord;
      if (col.name === 'Name') {
        key = 'ID';
      } else if (col.name === 'RecordType') {
        key = 'Type';
      } else if (col.name === 'Application_Status__c') {
        key = 'Status';
      } else if (col.name === 'Id') {
        key = 'applicationID';
      } else {
        key = col.name as keyof MembershipApplicationRecord;
      }

      columns.push({
        key,
        header: col.label,
        sortable: true,
      });
    });

    // Add custom Action column at the end
    columns.push({
      key: 'ID' as keyof MembershipApplicationRecord,
      header: 'Action',
      sortable: false,
      width: '150px',
      render: (_value, row) => (
        <div className="flex gap-2">
          {row.isDownload && (
            <button
              type="button"
              onClick={() => {
                if (row.downloadUrl) {
                  window.open(row.downloadUrl, '_blank');
                }
              }}
              className="px-3 py-1 text-xs text-white rounded hover:opacity-90"
              style={{ backgroundColor: appColors.primary.main }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = appColors.primary.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = appColors.primary.main;
              }}
            >
              Download
            </button>
          )}
          {row.isDelete && (
            <button
              type="button"
              onClick={() => {
                // TODO: Implement delete functionality
                if (window.confirm('Are you sure you want to delete this application?')) {
                  console.log('Delete application:', row.applicationID);
                }
              }}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      ),
    });

    return columns;
  }, [historyData]);

  /**
   * Get table data from API response
   */
  const applicationTableData = useMemo(() => {
    return historyData?.data || [];
  }, [historyData]);

  if (historyLoading) {
    return <PageLoader />;
  }

  return (
    <div style={{ backgroundColor: appColors.background.page }}>
      <h1
        className="text-xl font-bold pt-4 px-2 sm:pt-8 sm:px-0 sm:ml-6 mb-4 sm:mb-6"
        style={{ color: appColors.text.primary }}
      >
        Membership Application
      </h1>

      <div className="px-2 sm:px-0 sm:ml-6 sm:mr-6">
        <div className="rounded-lg shadow mb-4 sm:mb-6 overflow-hidden" style={{ backgroundColor: appColors.background.card }}>
          {/* Header with sidebar matching blue background */}
          <div
            className="px-3 py-3 sm:px-6 sm:py-4 rounded-t-lg"
            style={{
              backgroundColor: appColors.header.background,
              color: appColors.header.text,
            }}
          >
            <h2 className="text-lg font-semibold">My Applications</h2>
          </div>
          
          {/* Content */}
          <div className="p-2 sm:p-6">
            {historyError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{historyError}</p>
              </div>
            ) : (
              <DataTable<MembershipApplicationRecord>
                data={applicationTableData}
                columns={applicationColumns}
                emptyMessage="No Records to see currently"
                showSearch={true}
                showHeader={true}
                defaultPageSize={10}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipApplication;
