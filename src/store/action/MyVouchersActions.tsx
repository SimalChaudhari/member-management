import axiosInstance from 'config/axios';
import { getStoredInstanceUrl } from 'services/sso';
import type { AppDispatch } from 'store/Store';
import type {
  VouchersApiResponse,
  VoucherRecord,
  VoucherColumn,
  VoucherFieldValue,
} from 'store/types/vouchers';
import {
  VOUCHERS_FETCH_START,
  VOUCHERS_FETCH_SUCCESS,
  VOUCHERS_FETCH_ERROR,
} from 'store/types/vouchers';

/**
 * Transform API response data (array of arrays) into array of voucher records
 * The API returns data as array of arrays where each inner array contains field objects
 */
const transformVouchersData = (
  apiData: VoucherFieldValue[][],
  _columns: VoucherColumn[]
): VoucherRecord[] => {
  return apiData.map((row: VoucherFieldValue[]) => {
    const record: Partial<VoucherRecord> = {};

    // Transform each row from array of field objects to a single record object
    row.forEach((field: VoucherFieldValue) => {
      const fieldName = field.fieldName as keyof VoucherRecord;
      
      if (fieldName === 'Voucher_Balance') {
        // Handle balance as number or string
        record[fieldName] = typeof field.value === 'number' ? field.value : String(field.value);
      } else if (fieldName === 'Valid_From__c' || fieldName === 'Valid_To__c') {
        // Store date fields as strings
        const dateValue = String(field.value);
        // Extract date part if it's a datetime string
        if (dateValue.includes('T')) {
          record[fieldName] = dateValue.split('T')[0];
        } else if (dateValue.includes(' ')) {
          record[fieldName] = dateValue.split(' ')[0];
        } else {
          record[fieldName] = dateValue;
        }
      } else {
        // Store other fields as strings
        record[fieldName] = String(field.value);
      }
    });

    return record as VoucherRecord;
  });
};

/**
 * Fetch vouchers data from API
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export const fetchMyVouchers =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch({ type: VOUCHERS_FETCH_START });

    try {
      const instanceUrl = getStoredInstanceUrl();
      if (!instanceUrl) {
        throw new Error('Instance URL not found');
      }
      const baseUrl = instanceUrl.replace(/\/$/, '');
      const url = `${baseUrl}/services/apexrest/v1/courseAndEvents/getVouchers`;

      const response = await axiosInstance.get<VouchersApiResponse>(url);

      // Transform the data structure
      const transformedData = transformVouchersData(response.data.data, response.data.columns);

      dispatch({
        type: VOUCHERS_FETCH_SUCCESS,
        payload: {
          data: transformedData,
          columns: response.data.columns,
        },
      });

      return true;
    } catch (error: unknown) {
      let errorMessage = 'Failed to fetch vouchers data';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown } };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          if (typeof errorData === 'object' && errorData !== null) {
            // Handle Salesforce API error format
            if ('message' in errorData) {
              errorMessage = String(errorData.message);
            } else if ('error' in errorData && typeof errorData.error === 'string') {
              errorMessage = errorData.error;
            }
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      dispatch({
        type: VOUCHERS_FETCH_ERROR,
        payload: errorMessage,
      });

      return false;
    }
  };
