import axiosInstance from 'config/axios';
import { getStoredInstanceUrl } from 'services/sso';
import type { AppDispatch } from 'store/Store';
import type {
  PaymentsApiResponse,
  PaymentRecord,
  PaymentColumn,
  PaymentFieldValue,
} from 'store/types/payments';
import {
  PAYMENTS_FETCH_START,
  PAYMENTS_FETCH_SUCCESS,
  PAYMENTS_FETCH_ERROR,
} from 'store/types/payments';

/**
 * Transform API response data (array of arrays) into array of payment records
 * The API returns data as array of arrays where each inner array contains field objects
 */
const transformPaymentsData = (
  apiData: PaymentFieldValue[][],
  columns: PaymentColumn[]
): PaymentRecord[] => {
  return apiData.map((row: PaymentFieldValue[]) => {
    const record: Partial<PaymentRecord> = {};

    // Transform each row from array of field objects to a single record object
    row.forEach((field: PaymentFieldValue) => {
      const fieldName = field.fieldName as keyof PaymentRecord;
      
      if (fieldName === 'Billing_Amount__c') {
        // Handle amount as number
        record[fieldName] = typeof field.value === 'number' ? field.value : parseFloat(String(field.value)) || 0;
      } else if (fieldName === 'Billing_Date__c' || fieldName === 'Collection_Date__c') {
        // Store date fields as strings
        const dateValue = String(field.value);
        record[fieldName] = dateValue;
        
        // Extract date part if it's a datetime string
        if (dateValue.includes('T')) {
          record[fieldName] = dateValue.split('T')[0];
        } else if (dateValue.includes(' ')) {
          record[fieldName] = dateValue.split(' ')[0];
        }
      } else {
        // Store other fields as strings
        record[fieldName] = String(field.value);
      }
    });

    // Compute Date field (use Billing_Date__c or Collection_Date__c)
    if (record.Billing_Date__c) {
      record.Date = record.Billing_Date__c;
    } else if (record.Collection_Date__c) {
      record.Date = record.Collection_Date__c;
    }

    return record as PaymentRecord;
  });
};

/**
 * Fetch payments data from API
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export const fetchMyPayments =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch({ type: PAYMENTS_FETCH_START });

    try {
      const instanceUrl = getStoredInstanceUrl();
      if (!instanceUrl) {
        throw new Error('Instance URL not found');
      }
      const baseUrl = instanceUrl.replace(/\/$/, '');
      const url = `${baseUrl}/services/apexrest/v1/courseAndEvents/getPayments`;

      const response = await axiosInstance.get<PaymentsApiResponse>(url);

      // Transform the data structure
      const transformedData = transformPaymentsData(response.data.data, response.data.columns);

      dispatch({
        type: PAYMENTS_FETCH_SUCCESS,
        payload: {
          data: transformedData,
          columns: response.data.columns,
        },
      });

      return true;
    } catch (error: unknown) {
      let errorMessage = 'Failed to fetch payments data';

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
        type: PAYMENTS_FETCH_ERROR,
        payload: errorMessage,
      });

      return false;
    }
  };
