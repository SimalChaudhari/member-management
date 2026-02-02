import axiosInstance from 'config/axios';
import { getStoredInstanceUrl } from 'services/sso';
import type { AppDispatch } from 'store/Store';
import type {
  MembershipDetailResponse,
  MembershipHistoryResponse,
} from 'store/types/membership';
import {
  MEMBERSHIP_FETCH_START,
  MEMBERSHIP_FETCH_SUCCESS,
  MEMBERSHIP_FETCH_ERROR,
  MEMBERSHIP_HISTORY_FETCH_START,
  MEMBERSHIP_HISTORY_FETCH_SUCCESS,
  MEMBERSHIP_HISTORY_FETCH_ERROR,
} from 'store/types/membership';

/**
 * Fetch membership details from API
 * @param userId - The user ID to fetch membership details for
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export const fetchMembershipDetail =
  (userId: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch({ type: MEMBERSHIP_FETCH_START });

    try {
      const instanceUrl = getStoredInstanceUrl();
      if (!instanceUrl) {
        throw new Error('Instance URL not found');
      }
      const baseUrl = instanceUrl.replace(/\/$/, '');
      const url = `${baseUrl}/services/apexrest/mobileAPI/V1/membershipDetail?userId=${userId}`;

      const response = await axiosInstance.get<MembershipDetailResponse>(url);

      dispatch({
        type: MEMBERSHIP_FETCH_SUCCESS,
        payload: response.data,
      });

      return true;
    } catch (error: unknown) {
      let errorMessage = 'Failed to fetch membership details';

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
        type: MEMBERSHIP_FETCH_ERROR,
        payload: errorMessage,
      });

      return false;
    }
  };

/**
 * Fetch membership history/application data from API
 * @param userId - The user ID to fetch membership history for (currently not used in URL, but kept for future use)
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export const fetchMembershipHistory =
  (_userId: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch({ type: MEMBERSHIP_HISTORY_FETCH_START });

    try {
      const instanceUrl = getStoredInstanceUrl();
      if (!instanceUrl) {
        throw new Error('Instance URL not found');
      }
      const baseUrl = instanceUrl.replace(/\/$/, '');
      const url = `${baseUrl}/services/apexrest/mobileAPI/v1/RenewalMembership/MyApplication`;

      const response = await axiosInstance.get<MembershipHistoryResponse>(url);

      dispatch({
        type: MEMBERSHIP_HISTORY_FETCH_SUCCESS,
        payload: response.data,
      });

      return true;
    } catch (error: unknown) {
      let errorMessage = 'Failed to fetch membership history';

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
        type: MEMBERSHIP_HISTORY_FETCH_ERROR,
        payload: errorMessage,
      });

      return false;
    }
  };
