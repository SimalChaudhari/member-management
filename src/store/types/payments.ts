/**
 * Payments Types
 * Defines the structure of the API response from /courseAndEvents/getPayments endpoint
 */

// Payment field value from API response
export type PaymentFieldValue = {
  valueStr: string;
  value: string | number;
  fieldName: string;
};

// Payment column definition from API
export type PaymentColumn = {
  sortOrder: string;
  label: string;
  fieldType: string;
  apiName: string;
};

// Payment record (transformed from API response)
export type PaymentRecord = {
  Invoice_No__c: string;
  Id: string; // Download URL
  RelatedInvoice: string;
  Billing_Date__c?: string;
  Collection_Date__c?: string;
  Transaction_Type__c: string;
  Billing_Amount__c: number;
  Document_Type__c: string;
  Status__c: string;
  // Computed fields
  Date?: string; // Either Billing_Date__c or Collection_Date__c
};

// Payments API Response
export type PaymentsApiResponse = {
  data: PaymentFieldValue[][]; // Array of arrays, each inner array represents a row
  columns: PaymentColumn[];
};

// Redux state for payments data
export type PaymentsState = {
  paymentsData: PaymentRecord[] | null;
  columns: PaymentColumn[];
  loading: boolean;
  error: string | null;
};

// Action types
export const PAYMENTS_FETCH_START = 'PAYMENTS_FETCH_START';
export const PAYMENTS_FETCH_SUCCESS = 'PAYMENTS_FETCH_SUCCESS';
export const PAYMENTS_FETCH_ERROR = 'PAYMENTS_FETCH_ERROR';

// Action creators types
export type PaymentsAction =
  | { type: typeof PAYMENTS_FETCH_START }
  | { type: typeof PAYMENTS_FETCH_SUCCESS; payload: { data: PaymentRecord[]; columns: PaymentColumn[] } }
  | { type: typeof PAYMENTS_FETCH_ERROR; payload: string };
