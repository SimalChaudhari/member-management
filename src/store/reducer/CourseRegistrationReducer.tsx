import {
  COURSE_REG_FETCH_START,
  COURSE_REG_FETCH_SUCCESS,
  COURSE_REG_FETCH_ERROR,
  type CourseRegistrationState,
  type CourseRegistrationAction,
} from '../types/courseRegistration';

const initialState: CourseRegistrationState = {
  data: null,
  columns: [],
  loading: false,
  error: null,
};

const CourseRegistrationReducer = (
  state: CourseRegistrationState = initialState,
  action: CourseRegistrationAction
): CourseRegistrationState => {
  switch (action.type) {
    case COURSE_REG_FETCH_START:
      return { ...state, loading: true, error: null };

    case COURSE_REG_FETCH_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        columns: action.payload.columns,
        loading: false,
        error: null,
      };

    case COURSE_REG_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: null,
        columns: [],
      };

    default:
      return state;
  }
};

export default CourseRegistrationReducer;
