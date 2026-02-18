/**
 * Work Experience form constants
 * Picklist and option values for Employment History / Work Experience modal.
 * Keep in sync with Salesforce restricted picklists where applicable.
 */

export const ORGANISATION_TYPES = [
  'Public Accounting Firms (EY / Deloitte / KPMG / PwC)',
  'Public Accounting Firms (Others)',
  'Multinational Corporations (MNCs)',
  'Large Local Enterprises (> 200 staff or > $100 million revenue)',
  'SMEs (<200 staff or < $100 million revenue)',
  'Government',
  'Not For Profit',
  'Academia/Education',
  'Others',
] as const;

export const JOB_FUNCTIONS = [
  'Accounting',
  'Audit',
  'Tax',
  'Advisory',
  'Finance',
  'Others',
] as const;

export const EMPLOYMENT_STATUSES = [
  'Employed',
  'Self-Employed',
  'Not-Employed',
  'Student',
  'Others',
] as const;

export const INDUSTRIES = [
  'Agriculture',
  'Arts & Entertainment',
  'Banking',
  'Biotechnology',
  'Chemicals',
  'Commerce & Trading',
  'Construction',
  'Education',
  'Electronics',
  'Energy',
  'Engineering',
  'Environmental Services',
  'Finance & Insurance',
  'Food & Beverage',
  'Government',
  'Healthcare',
  'Hospitality & Tourism',
  'Manufacturing',
  'Maritime & Shipping',
  'Media & Communications',
  'Not For Profit',
  'Oil and Gas',
  'Others',
  'Real Estate',
  'Retail & Consumer Goods',
  'Technology',
  'Telecommunications',
  'Transportation',
  'Utilities',
  'Professional Services - Accounting',
  'Professional Services - Advisory & Consulting',
  'Professional Services - Audit & Assurance',
  'Professional Services - Business Process Outsourcing',
  'Professional Services - Corporate Secretariat',
  'Professional Services - Legal',
  'Professional Services - Tax',
  'Professional Services - Cybersecurity',
] as const;

/** Must match Salesforce restricted picklist for Job_Level__c */
export const JOB_LEVELS = [
  'Board of Directors',
  'Senior Management',
  'Middle Management',
  'Managerial',
  'Senior Associate/Senior Executive',
  'Associate/Executive/Assistant',
] as const;

export const EMPLOYER_NAMES = [
  'KPMG',
  'Deloitte',
  'EY',
  'PwC',
  'Public Accounting Firms (EY / Deloitte / KPMG / PwC)',
  'Others',
] as const;

export const JOB_RESPONSIBILITIES_MAX = 2500;
