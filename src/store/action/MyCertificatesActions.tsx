import axiosInstance from 'config/axios';
import { getStoredInstanceUrl } from 'services/sso';
import type { AppDispatch } from 'store/Store';
import type {
  CertificatesApiResponse,
  CertificateRecord,
  CertificateColumn,
  CertificateFieldValue,
} from 'store/types/certificates';
import {
  CERTIFICATES_FETCH_START,
  CERTIFICATES_FETCH_SUCCESS,
  CERTIFICATES_FETCH_ERROR,
} from 'store/types/certificates';

/**
 * Transform API response data (array of arrays) into array of certificate records
 * The API returns data as array of arrays where each inner array contains field objects
 */
const transformCertificatesData = (
  apiData: CertificateFieldValue[][],
  columns: CertificateColumn[]
): CertificateRecord[] => {
  return apiData.map((row: CertificateFieldValue[]) => {
    const record: Partial<CertificateRecord> = {};

    // Transform each row from array of field objects to a single record object
    row.forEach((field: CertificateFieldValue) => {
      const fieldName = field.fieldName as keyof CertificateRecord;
      
      if (fieldName === 'Course_Instance__r.Course_Start_Date__c' || fieldName === 'Date_of_generation__c') {
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

    return record as CertificateRecord;
  });
};

/**
 * Fetch certificates data from API
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export const fetchMyCertificates =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch({ type: CERTIFICATES_FETCH_START });

    try {
      const instanceUrl = getStoredInstanceUrl();
      if (!instanceUrl) {
        throw new Error('Instance URL not found');
      }
      const baseUrl = instanceUrl.replace(/\/$/, '');
      const url = `${baseUrl}/services/apexrest/v1/courseAndEvents/getCertificates`;

      const response = await axiosInstance.get<CertificatesApiResponse>(url);

      // Transform the data structure
      const transformedData = transformCertificatesData(response.data.data, response.data.columns);

      dispatch({
        type: CERTIFICATES_FETCH_SUCCESS,
        payload: {
          data: transformedData,
          columns: response.data.columns,
        },
      });

      return true;
    } catch (error: unknown) {
      let errorMessage = 'Failed to fetch certificates data';

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
        type: CERTIFICATES_FETCH_ERROR,
        payload: errorMessage,
      });

      return false;
    }
  };
