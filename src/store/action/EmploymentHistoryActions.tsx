import axiosInstance from 'config/axios';
import { getStoredInstanceUrl } from 'services/sso';
import type { AppDispatch } from 'store/Store';
import type { WorkExperienceMetadataResponse } from 'store/types/profileMetadata';
import {
  WORK_EXPERIENCE_METADATA_FETCH_START,
  WORK_EXPERIENCE_METADATA_FETCH_SUCCESS,
  WORK_EXPERIENCE_METADATA_FETCH_ERROR,
} from 'store/types/profileMetadata';
import { fetchAccountData } from 'store/action/AccountDataActions';

const WORK_EXPERIENCE_METADATA_PATH =
  '/services/apexrest/mobileAPI/v1/RenewalMembership/ImportantNotice/WorkExperience/Metadata';

/**
 * Fetch Work Experience metadata (section structure and field definitions).
 */
export const fetchWorkExperienceMetadata =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch({ type: WORK_EXPERIENCE_METADATA_FETCH_START });
    try {
      const response = await axiosInstance.get<WorkExperienceMetadataResponse>(WORK_EXPERIENCE_METADATA_PATH);
      const metadata = response.data;
      if (!metadata?.subSection1?.sectionFields || !metadata?.subSection2?.sectionFields) {
        throw new Error('Invalid Work Experience metadata');
      }
      dispatch({ type: WORK_EXPERIENCE_METADATA_FETCH_SUCCESS, payload: metadata });
      return true;
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as Error).message)
          : 'Failed to load Work Experience metadata';
      dispatch({ type: WORK_EXPERIENCE_METADATA_FETCH_ERROR, payload: message });
      return false;
    }
  };

/**
 * Build Salesforce API base URL from stored instance URL.
 */
function getSalesforceBaseUrl(): string {
  const instanceUrl = getStoredInstanceUrl();
  if (!instanceUrl) throw new Error('No instance URL available');
  return instanceUrl.replace(/\/$/, '');
}

/**
 * POST new Employment_History__c record. On success, refetches account data.
 */
export const createEmploymentRecord =
  (accountId: string, body: Record<string, unknown>) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const baseUrl = getSalesforceBaseUrl();
      const url = `${baseUrl}/services/data/v52.0/sobjects/Employment_History__c`;
      const payload = { ...body, Person_ID__c: accountId };
      await axiosInstance.post(url, payload);
      await dispatch(fetchAccountData(accountId));
      return true;
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as Error).message)
          : 'Failed to create employment record';
      throw new Error(message);
    }
  };

/**
 * PATCH existing Employment_History__c record. On success, refetches account data.
 */
export const updateEmploymentRecord =
  (recordId: string, accountId: string, body: Record<string, unknown>) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const baseUrl = getSalesforceBaseUrl();
      const url = `${baseUrl}/services/data/v52.0/sobjects/Employment_History__c/${recordId}`;
      await axiosInstance.patch(url, body);
      await dispatch(fetchAccountData(accountId));
      return true;
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as Error).message)
          : 'Failed to update employment record';
      throw new Error(message);
    }
  };

/**
 * DELETE Employment_History__c record. On success, refetches account data.
 */
export const deleteEmploymentRecord =
  (recordId: string, accountId: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const baseUrl = getSalesforceBaseUrl();
      const url = `${baseUrl}/services/data/v53.0/sobjects/Employment_History__c/${recordId}`;
      await axiosInstance.delete(url);
      await dispatch(fetchAccountData(accountId));
      return true;
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as Error).message)
          : 'Failed to delete employment record';
      throw new Error(message);
    }
  };
