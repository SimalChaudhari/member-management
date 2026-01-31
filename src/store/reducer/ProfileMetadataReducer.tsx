import {
  PROFILE_METADATA_FETCH_START,
  PROFILE_METADATA_FETCH_SUCCESS,
  PROFILE_METADATA_FETCH_ERROR,
  type ProfileMetadataState,
  type ProfileMetadataAction,
} from '../types/profileMetadata';

const initialState: ProfileMetadataState = {
  metadata: null,
  loading: false,
  error: null,
};

/**
 * Reducer for profile metadata state
 * Manages loading, success, and error states for profile form metadata
 */
const ProfileMetadataReducer = (
  state: ProfileMetadataState = initialState,
  action: ProfileMetadataAction
): ProfileMetadataState => {
  switch (action.type) {
    case PROFILE_METADATA_FETCH_START:
      return { ...state, loading: true, error: null };
    
    case PROFILE_METADATA_FETCH_SUCCESS:
      return { 
        ...state, 
        metadata: action.payload, 
        loading: false, 
        error: null 
      };
    
    case PROFILE_METADATA_FETCH_ERROR:
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        metadata: null 
      };
    
    default:
      return state;
  }
};

export default ProfileMetadataReducer;
