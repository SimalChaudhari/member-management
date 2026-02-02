/**
 * ============================================================================
 * PAYMENTS & CREDITS MODULE - My Payments Page
 * ============================================================================
 * 
 * This component displays payment transactions in a dynamic table format.
 * Fetches data from the courseAndEvents/getPayments API endpoint.
 * 
 * Related Files:
 * - store/action/MyPaymentsActions.tsx: Fetches payments data
 * - store/types/payments.ts: Type definitions for payments data
 * - store/reducer/MyPaymentsReducer.tsx: Manages payments state
 * - config/appColors.ts: Centralized color configuration
 * - components/table/DataTable.tsx: Reusable table component
 * ============================================================================
 */

import { ReactElement, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { fetchMyPayments } from 'store/action/MyPaymentsActions';
import DataTable, { Column } from 'components/table/DataTable';
import PageLoader from 'components/loading/PageLoader';
import { appColors } from 'config/appColors';
import type { PaymentRecord, PaymentColumn } from 'store/types/payments';

/**
 * My Payments Page Component
 * Displays payment transactions in a dynamic table with download actions
 */
const MyPayments = (): ReactElement => {
  const dispatch = useAppDispatch();

  // Redux state for payments data
  const { paymentsData, columns, loading, error } = useAppSelector(
    (state) => state.myPayments
  );

  /**
   * Fetch payments data on component mount
   */
  useEffect(() => {
    if (!paymentsData && !loading) {
      dispatch(fetchMyPayments());
    }
  }, [dispatch, paymentsData, loading]);

  /**
   * Build dynamic table columns from API response
   */
  const paymentsColumns: Column<PaymentRecord>[] = useMemo(() => {
    if (!columns || columns.length === 0) return [];

    const tableColumns: Column<PaymentRecord>[] = [];
    const addedKeys = new Set<string>();

    columns.forEach((col: PaymentColumn) => {
      // Skip Id column (it's used for download URL, not displayed as a column)
      if (col.apiName === 'Id') {
        return;
      }

      // Map API column names to record keys
      let key: keyof PaymentRecord;
      
      if (col.apiName === 'Billing_Date__c' || col.apiName === 'Collection_Date__c') {
        // Use computed Date field instead of individual date fields
        if (addedKeys.has('Date')) {
          return; // Skip if Date column already added
        }
        key = 'Date';
        addedKeys.add('Date');
      } else {
        key = col.apiName as keyof PaymentRecord;
        
        // Skip if this key was already added (handle duplicates)
        if (addedKeys.has(key)) {
          return;
        }
        addedKeys.add(key);
      }

      // Format amount column
      if (key === 'Billing_Amount__c') {
        tableColumns.push({
          key,
          header: col.label,
          sortable: true,
          render: (value) => {
            const amount = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
            return <span>S${amount.toFixed(2)}</span>;
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

    // Add Action column for download
    tableColumns.push({
      key: 'Id' as keyof PaymentRecord,
      header: 'Action',
      sortable: false,
      width: '120px',
      render: (_value, row) => {
        // Get download URL from the Id field (which contains the PDF URL)
        const downloadUrl = row.Id;
        if (!downloadUrl || !downloadUrl.startsWith('http')) {
          return null;
        }
        
        return (
          <button
            type="button"
            onClick={() => {
              window.open(downloadUrl, '_blank');
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
        );
      },
    });

    return tableColumns;
  }, [columns]);

  /**
   * Get table data
   */
  const tableData = useMemo(() => {
    return paymentsData || [];
  }, [paymentsData]);

  /**
   * Get unique transaction types for filter dropdown
   */
  const transactionTypeFilterOptions = useMemo(() => {
    if (!paymentsData || paymentsData.length === 0) return [];

    // Extract unique transaction types
    const uniqueTypes = new Set<string>();
    paymentsData.forEach((record: PaymentRecord) => {
      if (record.Transaction_Type__c) {
        uniqueTypes.add(record.Transaction_Type__c);
      }
    });

    // Convert to filter options format
    return Array.from(uniqueTypes)
      .sort()
      .map((type) => ({
        value: type,
        label: type,
      }));
  }, [paymentsData]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div style={{ backgroundColor: appColors.background.page }}>
      <h1
        className="text-xl font-bold pt-8 ml-6 mb-6"
        style={{ color: appColors.text.primary }}
      >
        My Payments
      </h1>

      <div className="ml-6 mr-6">
        <div className="rounded-lg shadow mb-6" style={{ backgroundColor: appColors.background.card }}>
          {/* Header with sidebar matching blue background */}
          <div
            className="px-6 py-4 rounded-t-lg"
            style={{
              backgroundColor: appColors.header.background,
              color: appColors.header.text,
            }}
          >
            <h2 className="text-lg font-semibold">Payment Transactions</h2>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            ) : (
              <DataTable<PaymentRecord>
                data={tableData}
                columns={paymentsColumns}
                emptyMessage="No payment records found"
                showSearch={true}
                showHeader={true}
                showFilters={transactionTypeFilterOptions.length > 0}
                filterOptions={
                  transactionTypeFilterOptions.length > 0
                    ? [
                        {
                          key: 'Transaction_Type__c' as keyof PaymentRecord,
                          label: 'Transaction Type',
                          options: transactionTypeFilterOptions,
                        },
                      ]
                    : []
                }
                defaultPageSize={10}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPayments;
