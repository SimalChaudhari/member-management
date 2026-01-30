import { combineReducers } from 'redux';
import PaymentsReducer from './reducer/Payments';
import BadgesReducer from './reducer/BadgesReducer';
import AuthReducer from './reducer/AuthReducer';

const reducer = combineReducers({
  payments: PaymentsReducer,
  badges: BadgesReducer,
  auth: AuthReducer,
});

export default reducer;
