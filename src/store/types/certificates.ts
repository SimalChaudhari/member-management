/**
 * Certificates Types
 * Defines the structure of the API response from /courseAndEvents/getCertificates endpoint
 */

// Certificate field value from API response
export type CertificateFieldValue = {
  valueStr: string;
  value: string | number;
  fieldName: string;
};

// Certificate column definition from API
export type CertificateColumn = {
  sortOrder: string;
  label: string;
  fieldType: string;
  apiName: string;
};

// Certificate record (transformed from API response)
export type CertificateRecord = {
  Serial_No__c: string; // Certificate No
  Course_Code__c: string;
  Course_Title__c: string;
  'Course_Instance__r.Course_Start_Date__c': string; // Course Date
  Date_of_generation__c: string; // Date & Time
  Attachment: string; // Download URL
};

// Certificates API Response
export type CertificatesApiResponse = {
  data: CertificateFieldValue[][]; // Array of arrays, each inner array represents a row
  columns: CertificateColumn[];
};

// Redux state for certificates data
export type CertificatesState = {
  certificatesData: CertificateRecord[] | null;
  columns: CertificateColumn[];
  loading: boolean;
  error: string | null;
};

// Action types
export const CERTIFICATES_FETCH_START = 'CERTIFICATES_FETCH_START';
export const CERTIFICATES_FETCH_SUCCESS = 'CERTIFICATES_FETCH_SUCCESS';
export const CERTIFICATES_FETCH_ERROR = 'CERTIFICATES_FETCH_ERROR';

// Action creators types
export type CertificatesAction =
  | { type: typeof CERTIFICATES_FETCH_START }
  | { type: typeof CERTIFICATES_FETCH_SUCCESS; payload: { data: CertificateRecord[]; columns: CertificateColumn[] } }
  | { type: typeof CERTIFICATES_FETCH_ERROR; payload: string };
