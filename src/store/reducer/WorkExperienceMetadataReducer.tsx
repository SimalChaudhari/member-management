import {
  WORK_EXPERIENCE_METADATA_FETCH_START,
  WORK_EXPERIENCE_METADATA_FETCH_SUCCESS,
  WORK_EXPERIENCE_METADATA_FETCH_ERROR,
  type WorkExperienceMetadataState,
  type WorkExperienceMetadataAction,
} from '../types/profileMetadata';

const initialState: WorkExperienceMetadataState = {
  metadata: null,
  loading: false,
  error: null,
};

const WorkExperienceMetadataReducer = (
  state: WorkExperienceMetadataState = initialState,
  action: WorkExperienceMetadataAction
): WorkExperienceMetadataState => {
  switch (action.type) {
    case WORK_EXPERIENCE_METADATA_FETCH_START:
      return { ...state, loading: true, error: null };
    case WORK_EXPERIENCE_METADATA_FETCH_SUCCESS:
      return { ...state, metadata: action.payload, loading: false, error: null };
    case WORK_EXPERIENCE_METADATA_FETCH_ERROR:
      return { ...state, loading: false, error: action.payload, metadata: null };
    default:
      return state;
  }
};

export default WorkExperienceMetadataReducer;
