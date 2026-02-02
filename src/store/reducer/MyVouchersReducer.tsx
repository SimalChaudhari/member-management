import {
  VOUCHERS_FETCH_START,
  VOUCHERS_FETCH_SUCCESS,
  VOUCHERS_FETCH_ERROR,
  type VouchersState,
  type VouchersAction,
} from '../types/vouchers';

const initialState: VouchersState = {
  vouchersData: null,
  columns: [],
  loading: false,
  error: null,
};

/**
 * Reducer for vouchers data state
 * Manages loading, success, and error states for vouchers
 */
const MyVouchersReducer = (
  state: VouchersState = initialState,
  action: VouchersAction
): VouchersState => {
  switch (action.type) {
    case VOUCHERS_FETCH_START:
      return { ...state, loading: true, error: null };
    
    case VOUCHERS_FETCH_SUCCESS:
      return { 
        ...state, 
        vouchersData: action.payload.data,
        columns: action.payload.columns,
        loading: false, 
        error: null 
      };
    
    case VOUCHERS_FETCH_ERROR:
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        vouchersData: null,
        columns: []
      };
    
    default:
      return state;
  }
};

export default MyVouchersReducer;
