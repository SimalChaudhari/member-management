import axiosInstance from 'config/axios';
import { getStoredInstanceUrl } from 'services/sso';
import type { AppDispatch } from 'store/Store';

/**
 * Change Password Request Type
 */
export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

/**
 * Change Password API Response Type
 */
export type ChangePasswordResponse = {
  success?: boolean;
  message?: string;
};

/**
 * Change password API call
 * POST /services/data/v66.0/sobjects/User/{userId}/password
 * 
 * @param userId - Salesforce User ID
 * @param newPassword - New password to set
 */
export const changePasswordAPI = async (
  userId: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {
  const instanceUrl = getStoredInstanceUrl();
  if (!instanceUrl) {
    throw new Error('No instance URL available');
  }

  const baseUrl = instanceUrl.replace(/\/$/, '');
  const url = `${baseUrl}/services/data/v66.0/sobjects/User/${userId}/password`;

  const response = await axiosInstance.post<ChangePasswordResponse>(
    url,
    {
      NewPassword: newPassword,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

/**
 * Redux action to change password
 * This can be used if you want to manage password change state in Redux
 */
export const changePassword =
  (userId: string, newPassword: string) =>
  async (_dispatch: AppDispatch): Promise<boolean> => {
    try {
      await changePasswordAPI(userId, newPassword);
      return true;
    } catch (error) {
      throw error;
    }
  };
