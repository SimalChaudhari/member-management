/**
 * ============================================================================
 * PAYMENTS & CREDITS MODULE - My Vouchers Page
 * ============================================================================
 * 
 * This component displays voucher data in a dynamic table format.
 * Fetches data from the courseAndEvents/getVouchers API endpoint.
 * 
 * Related Files:
 * - store/action/MyVouchersActions.tsx: Fetches vouchers data
 * - store/types/vouchers.ts: Type definitions for vouchers data
 * - store/reducer/MyVouchersReducer.tsx: Manages vouchers state
 * - config/appColors.ts: Centralized color configuration
 * - components/table/DataTable.tsx: Reusable table component
 * ============================================================================
 */

import { ReactElement, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { fetchMyVouchers } from 'store/action/MyVouchersActions';
import DataTable, { Column } from 'components/table/DataTable';
import PageLoader from 'components/loading/PageLoader';
import { appColors } from 'config/appColors';
import type { VoucherRecord, VoucherColumn } from 'store/types/vouchers';

/**
 * My Vouchers Page Component
 * Displays vouchers in a dynamic table
 */
const MyVouchers = (): ReactElement => {
  const dispatch = useAppDispatch();

  // Redux state for vouchers data
  const { vouchersData, columns, loading, error } = useAppSelector(
    (state) => state.myVouchers
  );

  /**
   * Fetch vouchers data on component mount
   */
  useEffect(() => {
    if (!vouchersData && !loading) {
      dispatch(fetchMyVouchers());
    }
  }, [dispatch, vouchersData, loading]);

  /**
   * Build dynamic table columns from API response
   */
  const vouchersColumns: Column<VoucherRecord>[] = useMemo(() => {
    if (!columns || columns.length === 0) return [];

    const tableColumns: Column<VoucherRecord>[] = [];
    const addedKeys = new Set<string>();

    columns.forEach((col: VoucherColumn) => {
      // Skip Id column (it's a duplicate of Name/Voucher Code)
      if (col.apiName === 'Id') {
        return;
      }

      // Map API column names to record keys
      const key = col.apiName as keyof VoucherRecord;
      
      // Skip if this key was already added (handle duplicates)
      if (addedKeys.has(key)) {
        return;
      }
      addedKeys.add(key);

      // Format balance column
      if (key === 'Voucher_Balance') {
        tableColumns.push({
          key,
          header: col.label,
          sortable: true,
          render: (value) => {
            const balance = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
            return <span>S${balance.toFixed(2)}</span>;
          },
        });
      } else {
        tableColumns.push({
          key,
          header: col.label,
          sortable: true,
        });
      }
    });

    return tableColumns;
  }, [columns]);

  /**
   * Get table data
   */
  const tableData = useMemo(() => {
    return vouchersData || [];
  }, [vouchersData]);

  /**
   * Get unique voucher statuses for filter dropdown
   */
  const statusFilterOptions = useMemo(() => {
    if (!vouchersData || vouchersData.length === 0) return [];

    // Extract unique statuses
    const uniqueStatuses = new Set<string>();
    vouchersData.forEach((record: VoucherRecord) => {
      if (record.Voucher_Status__c) {
        uniqueStatuses.add(record.Voucher_Status__c);
      }
    });

    // Convert to filter options format
    return Array.from(uniqueStatuses)
      .sort()
      .map((status) => ({
        value: status,
        label: status,
      }));
  }, [vouchersData]);

  /**
   * Get unique voucher types for filter dropdown
   */
  const voucherTypeFilterOptions = useMemo(() => {
    if (!vouchersData || vouchersData.length === 0) return [];

    // Extract unique voucher types
    const uniqueTypes = new Set<string>();
    vouchersData.forEach((record: VoucherRecord) => {
      if (record['Recordtype.Name']) {
        uniqueTypes.add(record['Recordtype.Name']);
      }
    });

    // Convert to filter options format
    return Array.from(uniqueTypes)
      .sort()
      .map((type) => ({
        value: type,
        label: type,
      }));
  }, [vouchersData]);

  // Combine filter options
  const filterOptions = useMemo(() => {
    const options = [];
    
    if (statusFilterOptions.length > 0) {
      options.push({
        key: 'Voucher_Status__c' as keyof VoucherRecord,
        label: 'Status',
        options: statusFilterOptions,
      });
    }
    
    if (voucherTypeFilterOptions.length > 0) {
      options.push({
        key: 'Recordtype.Name' as keyof VoucherRecord,
        label: 'Voucher Type',
        options: voucherTypeFilterOptions,
      });
    }
    
    return options;
  }, [statusFilterOptions, voucherTypeFilterOptions]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div style={{ backgroundColor: appColors.background.page }}>
      <h1
        className="text-xl font-bold pt-4 px-2 sm:pt-8 sm:px-0 sm:ml-6 mb-4 sm:mb-6"
        style={{ color: appColors.text.primary }}
      >
        My Vouchers
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
            <h2 className="text-lg font-semibold">My Vouchers</h2>
          </div>
          
          {/* Content */}
          <div className="p-2 sm:p-6">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            ) : (
              <DataTable<VoucherRecord>
                data={tableData}
                columns={vouchersColumns}
                emptyMessage="No vouchers found"
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

export default MyVouchers;
