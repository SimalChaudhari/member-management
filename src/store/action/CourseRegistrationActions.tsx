import axiosInstance from 'config/axios';
import { getStoredInstanceUrl } from 'services/sso';
import type { AppDispatch } from 'store/Store';
import type {
  CourseRegistrationApiResponse,
  CourseRegistrationRecord,
  CourseRegistrationFieldValue,
} from 'store/types/courseRegistration';
import {
  COURSE_REG_FETCH_START,
  COURSE_REG_FETCH_SUCCESS,
  COURSE_REG_FETCH_ERROR,
} from 'store/types/courseRegistration';

const transformCourseRegData = (
  apiData: CourseRegistrationFieldValue[][]
): CourseRegistrationRecord[] => {
  return apiData.map((row: CourseRegistrationFieldValue[]) => {
    const record: CourseRegistrationRecord = {};
    row.forEach((field: CourseRegistrationFieldValue) => {
      const key = field.fieldName;
      const val = field.value;
      record[key] = typeof val === 'number' ? val : String(val ?? '');
    });
    return record;
  });
};

export const fetchCourseRegistrations =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch({ type: COURSE_REG_FETCH_START });

    try {
      const instanceUrl = getStoredInstanceUrl();
      if (!instanceUrl) {
        throw new Error('Instance URL not found');
      }
      const baseUrl = instanceUrl.replace(/\/$/, '');
      const url = `${baseUrl}/services/apexrest/v1/courseAndEvents/getCourseReg`;

      const response = await axiosInstance.get<CourseRegistrationApiResponse>(url);

      const transformedData = transformCourseRegData(response.data.data);

      dispatch({
        type: COURSE_REG_FETCH_SUCCESS,
        payload: {
          data: transformedData,
          columns: response.data.columns,
        },
      });

      return true;
    } catch (error: unknown) {
      let errorMessage = 'Failed to fetch course registrations';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown } };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          if (typeof errorData === 'object' && errorData !== null) {
            if ('message' in errorData) {
              errorMessage = String(errorData.message);
            } else if ('error' in errorData && typeof errorData.error === 'string') {
              errorMessage = (errorData as { error: string }).error;
            }
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      dispatch({ type: COURSE_REG_FETCH_ERROR, payload: errorMessage });
      return false;
    }
  };
