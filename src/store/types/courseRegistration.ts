/**
 * Course Registration Types
 * API: /courseAndEvents/getCourseReg
 */

export type CourseRegistrationFieldValue = {
  valueStr: string;
  value: string | number;
  fieldName: string;
};

export type CourseRegistrationColumn = {
  sortOrder: string;
  label: string;
  fieldType: string;
  apiName: string;
};

export type CourseRegistrationRecord = Record<string, string | number>;

export type CourseRegistrationApiResponse = {
  data: CourseRegistrationFieldValue[][];
  columns: CourseRegistrationColumn[];
};

export type CourseRegistrationState = {
  data: CourseRegistrationRecord[] | null;
  columns: CourseRegistrationColumn[];
  loading: boolean;
  error: string | null;
};

export const COURSE_REG_FETCH_START = 'COURSE_REG_FETCH_START';
export const COURSE_REG_FETCH_SUCCESS = 'COURSE_REG_FETCH_SUCCESS';
export const COURSE_REG_FETCH_ERROR = 'COURSE_REG_FETCH_ERROR';

export type CourseRegistrationAction =
  | { type: typeof COURSE_REG_FETCH_START }
  | {
      type: typeof COURSE_REG_FETCH_SUCCESS;
      payload: { data: CourseRegistrationRecord[]; columns: CourseRegistrationColumn[] };
    }
  | { type: typeof COURSE_REG_FETCH_ERROR; payload: string };
