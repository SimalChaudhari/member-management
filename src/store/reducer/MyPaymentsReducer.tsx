import {
  PAYMENTS_FETCH_START,
  PAYMENTS_FETCH_SUCCESS,
  PAYMENTS_FETCH_ERROR,
  type PaymentsState,
  type PaymentsAction,
} from '../types/payments';

const initialState: PaymentsState = {
  paymentsData: null,
  columns: [],
  loading: false,
  error: null,
};

/**
 * Reducer for payments data state
 * Manages loading, success, and error states for payments
 */
const MyPaymentsReducer = (
  state: PaymentsState = initialState,
  action: PaymentsAction
): PaymentsState => {
  switch (action.type) {
    case PAYMENTS_FETCH_START:
      return { ...state, loading: true, error: null };
    
    case PAYMENTS_FETCH_SUCCESS:
      return { 
        ...state, 
        paymentsData: action.payload.data,
        columns: action.payload.columns,
        loading: false, 
        error: null 
      };
    
    case PAYMENTS_FETCH_ERROR:
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        paymentsData: null,
        columns: []
      };
    
    default:
      return state;
  }
};

export default MyPaymentsReducer;
