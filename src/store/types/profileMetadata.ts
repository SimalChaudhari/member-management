/**
 * Profile Metadata Types
 * Defines the structure of the API response from /myProfileMetaData endpoint
 */

// Field types supported by the API
export type FieldType = 
  | 'PICKLIST' 
  | 'STRING' 
  | 'DATE' 
  | 'MULTIPICKLIST' 
  | 'EMAIL' 
  | 'PHONE' 
  | 'TEXTAREA' 
  | 'DOUBLE';

// Individual field definition from API
export type ProfileField = {
  required: string; // "true" or "false" as string
  label: string;
  fieldType: FieldType;
  apiName: string;
  picklistValues?: string[]; // Options for PICKLIST/MULTIPICKLIST (from API)
};

// Section with fields (for personalDetails, telemarketingInformation, etc.)
export type ProfileSection = {
  sectionName: string;
  sectionFields: ProfileField[];
};

// Contact details subsection (Residential Address, Mailing Address, etc.)
export type ContactSubSection = {
  subSectionName: string;
  sectionFields: ProfileField[];
};

// Main API response structure
export type ProfileMetadataResponse = {
  personalDetails: ProfileSection;
  contactDetails: ContactSubSection[];
  interestsAndPreferences: ProfileSection;
  telemarketingInformation: ProfileSection;
  employmentHistory?: ProfileSection; // Optional as it might not always be present
};

// Redux state for profile metadata
export type ProfileMetadataState = {
  metadata: ProfileMetadataResponse | null;
  loading: boolean;
  error: string | null;
};

// Action types
export const PROFILE_METADATA_FETCH_START = 'PROFILE_METADATA_FETCH_START';
export const PROFILE_METADATA_FETCH_SUCCESS = 'PROFILE_METADATA_FETCH_SUCCESS';
export const PROFILE_METADATA_FETCH_ERROR = 'PROFILE_METADATA_FETCH_ERROR';

// Action creators types
export type ProfileMetadataFetchStartAction = { 
  type: typeof PROFILE_METADATA_FETCH_START 
};

export type ProfileMetadataFetchSuccessAction = { 
  type: typeof PROFILE_METADATA_FETCH_SUCCESS; 
  payload: ProfileMetadataResponse 
};

export type ProfileMetadataFetchErrorAction = { 
  type: typeof PROFILE_METADATA_FETCH_ERROR; 
  payload: string 
};

export type ProfileMetadataAction =
  | ProfileMetadataFetchStartAction
  | ProfileMetadataFetchSuccessAction
  | ProfileMetadataFetchErrorAction;

// ============================================================================
// Account Data Types (for fetching actual account values)
// ============================================================================

// Employment History record structure
export type EmploymentHistoryRecord = {
  Id: string;
  Employer_Name__c?: string;
  Is_Current_Employment__c?: boolean;
  Other_Organisation_Name__c?: string;
  Organisation_Type__c?: string;
  Industry__c?: string;
  Other_Industry__c?: string;
  Job_Position__c?: string;
  Job_Level__c?: string;
  Job_Function__c?: string;
  Other_Job_Function__c?: string;
  Employment_Start_Date__c?: string;
  Employment_End_Date__c?: string;
  Employment_Status__c?: string;
  Areas_of_Specialisation__c?: string;
  Country_of_Employment__c?: string;
  Job_Responsibilities__c?: string;
  Experience__c?: string;
};

// Account data response structure from Salesforce query API
export type AccountDataResponse = {
  Id: string;
  Primary_Company_Name__c?: string | null;
  Current_Employment_Status__c?: string | null;
  Salutation?: string | null;
  FirstName?: string | null;
  LastName?: string | null;
  Name_As_Per_Id__c?: string | null;
  Alias__c?: string | null;
  ID_Type__c?: string | null;
  ID_Number__c?: string | null;
  Nationality__c?: string | null;
  Citizenship__c?: string | null;
  Date_of_Birth__c?: string | null;
  Gender__c?: string | null;
  Marital_Status__c?: string | null;
  Residential_Country__c?: string | null;
  Residential_Postal_Code__c?: string | null;
  Residential_Unit_Number__c?: string | null;
  Residential_Address_Line1__c?: string | null;
  Residential_Address_Line2__c?: string | null;
  Residential_City__c?: string | null;
  Residential_State__c?: string | null;
  PersonMailingCountry?: string | null;
  PersonMailingPostalCode?: string | null;
  Mailing_Unit_Number__c?: string | null;
  Mailing_Address_Line1__c?: string | null;
  Mailing_Address_Line2__c?: string | null;
  PersonMailingCity?: string | null;
  PersonMailingState?: string | null;
  Mobile_Country_Code__c?: number | null;
  PersonMobilePhone?: string | null;
  Other_Phone_Country_Code__c?: number | null;
  PersonOtherPhone?: string | null;
  PersonEmail?: string | null;
  AlternateEmail__c?: string | null;
  School_Email_Address__c?: string | null;
  Topic_Preference__c?: string | null;
  Internship_Opportunities__c?: string | null;
  Area_of_Interest__c?: string | null;
  Subscription_Preference__c?: string | null;
  Voice_Calls__c?: string | null;
  Text_Messages__c?: string | null;
  Fax_Messages__c?: string | null;
  Employment_History__r?: {
    totalSize: number;
    done: boolean;
    records: EmploymentHistoryRecord[];
  } | null;
};

// Salesforce query API response wrapper
export type SalesforceQueryResponse = {
  totalSize: number;
  done: boolean;
  records: AccountDataResponse[];
};

// Redux state for account data
export type AccountDataState = {
  accountData: AccountDataResponse | null;
  loading: boolean;
  error: string | null;
};

// Action types for account data
export const ACCOUNT_DATA_FETCH_START = 'ACCOUNT_DATA_FETCH_START';
export const ACCOUNT_DATA_FETCH_SUCCESS = 'ACCOUNT_DATA_FETCH_SUCCESS';
export const ACCOUNT_DATA_FETCH_ERROR = 'ACCOUNT_DATA_FETCH_ERROR';

// Action creators types for account data
export type AccountDataFetchStartAction = { 
  type: typeof ACCOUNT_DATA_FETCH_START 
};

export type AccountDataFetchSuccessAction = { 
  type: typeof ACCOUNT_DATA_FETCH_SUCCESS; 
  payload: AccountDataResponse 
};

export type AccountDataFetchErrorAction = { 
  type: typeof ACCOUNT_DATA_FETCH_ERROR; 
  payload: string 
};

export type AccountDataAction =
  | AccountDataFetchStartAction
  | AccountDataFetchSuccessAction
  | AccountDataFetchErrorAction;
