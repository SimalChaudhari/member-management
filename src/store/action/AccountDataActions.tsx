import axiosInstance from 'config/axios';
import { getStoredInstanceUrl } from 'services/sso';
import type { AppDispatch } from 'store/Store';
import type { SalesforceQueryResponse } from 'store/types/profileMetadata';
import {
  ACCOUNT_DATA_FETCH_START,
  ACCOUNT_DATA_FETCH_SUCCESS,
  ACCOUNT_DATA_FETCH_ERROR,
} from 'store/types/profileMetadata';

/**
 * Build Salesforce SOQL query for account data
 * Fetches all account fields needed for the profile form
 */
const buildAccountQuery = (accountId: string): string => {
  const fields = [
    'Id',
    'Primary_Company_Name__c',
    'Current_Employment_Status__c',
    'Salutation',
    'FirstName',
    'LastName',
    'Name_As_Per_Id__c',
    'Alias__c',
    'ID_Type__c',
    'ID_Number__c',
    'Nationality__c',
    'Citizenship__c',
    'Date_of_Birth__c',
    'Gender__c',
    'Marital_Status__c',
    'Residential_Country__c',
    'Residential_Postal_Code__c',
    'Residential_Unit_Number__c',
    'Residential_Address_Line1__c',
    'Residential_Address_Line2__c',
    'Residential_City__c',
    'Residential_State__c',
    'PersonMailingCountry',
    'PersonMailingPostalCode',
    'Mailing_Unit_Number__c',
    'Mailing_Address_Line1__c',
    'Mailing_Address_Line2__c',
    'PersonMailingCity',
    'PersonMailingState',
    'Mobile_Country_Code__c',
    'PersonMobilePhone',
    'Other_Phone_Country_Code__c',
    'PersonOtherPhone',
    'PersonEmail',
    'AlternateEmail__c',
    'School_Email_Address__c',
    'Topic_Preference__c',
    'Internship_Opportunities__c',
    'Area_of_Interest__c',
    'Subscription_Preference__c',
    'Voice_Calls__c',
    'Text_Messages__c',
    'Fax_Messages__c',
  ];

  const employmentHistoryFields = [
    'Id',
    'Employer_Name__c',
    'Is_Current_Employment__c',
    'Other_Organisation_Name__c',
    'Organisation_Type__c',
    'Industry__c',
    'Other_Industry__c',
    'Job_Position__c',
    'Job_Level__c',
    'Job_Function__c',
    'Other_Job_Function__c',
    'Employment_Start_Date__c',
    'Employment_End_Date__c',
    'Employment_Status__c',
    'Areas_of_Specialisation__c',
    'Country_of_Employment__c',
    'Job_Responsibilities__c',
    'Experience__c',
  ];

  const employmentHistorySubquery = `(SELECT ${employmentHistoryFields.join(',')} FROM Employment_History__r)`;
  const query = `SELECT ${fields.join(',')},${employmentHistorySubquery} FROM Account WHERE Id = '${accountId}' LIMIT 1`;

  return encodeURIComponent(query);
};

/**
 * Fetch account data from Salesforce query API
 * This fetches the actual values for all form fields
 */
export const fetchAccountData =
  (accountId: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch({ type: ACCOUNT_DATA_FETCH_START });

    try {
      const instanceUrl = getStoredInstanceUrl();
      if (!instanceUrl) {
        throw new Error('No instance URL available');
      }

      // Build the SOQL query
      const query = buildAccountQuery(accountId);
      
      // Use instance URL for Salesforce API calls
      const baseUrl = instanceUrl.replace(/\/$/, '');
      const url = `${baseUrl}/services/data/v52.0/query?q=${query}`;

      const response = await axiosInstance.get<SalesforceQueryResponse>(url);
      
      // Extract account data from response
      const accountData = response.data?.records?.[0] || null;

      if (!accountData) {
        throw new Error('No account data received from API');
      }

      dispatch({ 
        type: ACCOUNT_DATA_FETCH_SUCCESS, 
        payload: accountData 
      });
      
      return true;
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as Error).message)
          : 'Failed to load account data';
      
      dispatch({ 
        type: ACCOUNT_DATA_FETCH_ERROR, 
        payload: message 
      });
      
      return false;
    }
  };
