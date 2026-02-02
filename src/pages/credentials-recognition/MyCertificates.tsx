/**
 * ============================================================================
 * CREDENTIALS & RECOGNITION MODULE - My Certificates Page
 * ============================================================================
 * 
 * This component displays certificate data in a dynamic table format.
 * Fetches data from the courseAndEvents/getCertificates API endpoint.
 * 
 * Related Files:
 * - store/action/MyCertificatesActions.tsx: Fetches certificates data
 * - store/types/certificates.ts: Type definitions for certificates data
 * - store/reducer/MyCertificatesReducer.tsx: Manages certificates state
 * - config/appColors.ts: Centralized color configuration
 * - components/table/DataTable.tsx: Reusable table component
 * ============================================================================
 */

import { ReactElement, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { fetchMyCertificates } from 'store/action/MyCertificatesActions';
import DataTable, { Column } from 'components/table/DataTable';
import { appColors } from 'config/appColors';
import type { CertificateRecord, CertificateColumn } from 'store/types/certificates';

/**
 * My Certificates Page Component
 * Displays certificates in a dynamic table with download actions
 */
const MyCertificates = (): ReactElement => {
  const dispatch = useAppDispatch();

  // Redux state for certificates data
  const { certificatesData, columns, loading, error } = useAppSelector(
    (state) => state.myCertificates
  );

  /**
   * Fetch certificates data on component mount
   */
  useEffect(() => {
    if (!certificatesData && !loading) {
      dispatch(fetchMyCertificates());
    }
  }, [dispatch, certificatesData, loading]);

  /**
   * Build dynamic table columns from API response
   */
  const certificatesColumns: Column<CertificateRecord>[] = useMemo(() => {
    if (!columns || columns.length === 0) return [];

    const tableColumns: Column<CertificateRecord>[] = [];

    columns.forEach((col: CertificateColumn) => {
      // Skip Action column (we'll create a custom Action column)
      if (col.apiName === 'Attachment') {
        return;
      }

      // Map API column names to record keys
      const key = col.apiName as keyof CertificateRecord;

      tableColumns.push({
        key,
        header: col.label,
        sortable: true,
      });
    });

    // Add custom Action column for download
    tableColumns.push({
      key: 'Attachment' as keyof CertificateRecord,
      header: 'Action',
      sortable: false,
      width: '120px',
      render: (_value, row) => {
        // Get download URL from the Attachment field
        const downloadUrl = row.Attachment;
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
    return certificatesData || [];
  }, [certificatesData]);

  return (
    <div style={{ backgroundColor: appColors.background.page }}>
      <h1
        className="text-xl font-bold pt-8 ml-6 mb-6"
        style={{ color: appColors.text.primary }}
      >
        My Certificates
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
            <h2 className="text-lg font-semibold">My Certificates</h2>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div style={{ color: appColors.text.secondary }}>Loading certificates...</div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            ) : (
              <DataTable<CertificateRecord>
                data={tableData}
                columns={certificatesColumns}
                emptyMessage="No certificates found"
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

export default MyCertificates;
