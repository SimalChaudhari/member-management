/**
 * Vouchers Types
 * Defines the structure of the API response from /courseAndEvents/getVouchers endpoint
 */

// Voucher field value from API response
export type VoucherFieldValue = {
  valueStr: string;
  value: string | number;
  fieldName: string;
};

// Voucher column definition from API
export type VoucherColumn = {
  sortOrder: string;
  label: string;
  fieldType: string;
  apiName: string;
};

// Voucher record (transformed from API response)
export type VoucherRecord = {
  Name: string; // Voucher Code
  Id: string; // Voucher ID
  Valid_From__c: string;
  Valid_To__c: string;
  Issued_To: string;
  Voucher_Status__c: string;
  'Recordtype.Name': string; // Voucher Type
  Voucher_Balance: string | number;
};

// Vouchers API Response
export type VouchersApiResponse = {
  data: VoucherFieldValue[][]; // Array of arrays, each inner array represents a row
  columns: VoucherColumn[];
};

// Redux state for vouchers data
export type VouchersState = {
  vouchersData: VoucherRecord[] | null;
  columns: VoucherColumn[];
  loading: boolean;
  error: string | null;
};

// Action types
export const VOUCHERS_FETCH_START = 'VOUCHERS_FETCH_START';
export const VOUCHERS_FETCH_SUCCESS = 'VOUCHERS_FETCH_SUCCESS';
export const VOUCHERS_FETCH_ERROR = 'VOUCHERS_FETCH_ERROR';

// Action creators types
export type VouchersAction =
  | { type: typeof VOUCHERS_FETCH_START }
  | { type: typeof VOUCHERS_FETCH_SUCCESS; payload: { data: VoucherRecord[]; columns: VoucherColumn[] } }
  | { type: typeof VOUCHERS_FETCH_ERROR; payload: string };
