import {
  MEMBERSHIP_FETCH_START,
  MEMBERSHIP_FETCH_SUCCESS,
  MEMBERSHIP_FETCH_ERROR,
  MEMBERSHIP_HISTORY_FETCH_START,
  MEMBERSHIP_HISTORY_FETCH_SUCCESS,
  MEMBERSHIP_HISTORY_FETCH_ERROR,
  type MembershipState,
  type MembershipAction,
} from '../types/membership';

const initialState: MembershipState = {
  membershipData: null,
  loading: false,
  error: null,
  historyData: null,
  historyLoading: false,
  historyError: null,
};

/**
 * Reducer for membership data state
 * Manages loading, success, and error states for membership details and history
 */
const MembershipReducer = (
  state: MembershipState = initialState,
  action: MembershipAction
): MembershipState => {
  switch (action.type) {
    case MEMBERSHIP_FETCH_START:
      return { ...state, loading: true, error: null };
    
    case MEMBERSHIP_FETCH_SUCCESS:
      return { 
        ...state, 
        membershipData: action.payload, 
        loading: false, 
        error: null 
      };
    
    case MEMBERSHIP_FETCH_ERROR:
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        membershipData: null 
      };
    
    case MEMBERSHIP_HISTORY_FETCH_START:
      return { ...state, historyLoading: true, historyError: null };
    
    case MEMBERSHIP_HISTORY_FETCH_SUCCESS:
      return { 
        ...state, 
        historyData: action.payload, 
        historyLoading: false, 
        historyError: null 
      };
    
    case MEMBERSHIP_HISTORY_FETCH_ERROR:
      return { 
        ...state, 
        historyLoading: false, 
        historyError: action.payload,
        historyData: null 
      };
    
    default:
      return state;
  }
};

export default MembershipReducer;
