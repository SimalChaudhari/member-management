import {
  CERTIFICATES_FETCH_START,
  CERTIFICATES_FETCH_SUCCESS,
  CERTIFICATES_FETCH_ERROR,
  type CertificatesState,
  type CertificatesAction,
} from '../types/certificates';

const initialState: CertificatesState = {
  certificatesData: null,
  columns: [],
  loading: false,
  error: null,
};

/**
 * Reducer for certificates data state
 * Manages loading, success, and error states for certificates
 */
const MyCertificatesReducer = (
  state: CertificatesState = initialState,
  action: CertificatesAction
): CertificatesState => {
  switch (action.type) {
    case CERTIFICATES_FETCH_START:
      return { ...state, loading: true, error: null };
    
    case CERTIFICATES_FETCH_SUCCESS:
      return { 
        ...state, 
        certificatesData: action.payload.data,
        columns: action.payload.columns,
        loading: false, 
        error: null 
      };
    
    case CERTIFICATES_FETCH_ERROR:
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        certificatesData: null,
        columns: []
      };
    
    default:
      return state;
  }
};

export default MyCertificatesReducer;
