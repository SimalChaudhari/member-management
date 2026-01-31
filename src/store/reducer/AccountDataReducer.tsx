import {
  ACCOUNT_DATA_FETCH_START,
  ACCOUNT_DATA_FETCH_SUCCESS,
  ACCOUNT_DATA_FETCH_ERROR,
  type AccountDataState,
  type AccountDataAction,
} from '../types/profileMetadata';

const initialState: AccountDataState = {
  accountData: null,
  loading: false,
  error: null,
};

/**
 * Reducer for account data state
 * Manages loading, success, and error states for account form data
 */
const AccountDataReducer = (
  state: AccountDataState = initialState,
  action: AccountDataAction
): AccountDataState => {
  switch (action.type) {
    case ACCOUNT_DATA_FETCH_START:
      return { ...state, loading: true, error: null };
    
    case ACCOUNT_DATA_FETCH_SUCCESS:
      return { 
        ...state, 
        accountData: action.payload, 
        loading: false, 
        error: null 
      };
    
    case ACCOUNT_DATA_FETCH_ERROR:
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        accountData: null 
      };
    
    default:
      return state;
  }
};

export default AccountDataReducer;
