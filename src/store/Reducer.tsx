import { combineReducers } from 'redux';
import PaymentsReducer from './reducer/Payments';
import BadgesReducer from './reducer/BadgesReducer';
import AuthReducer from './reducer/AuthReducer';
import ProfileMetadataReducer from './reducer/ProfileMetadataReducer';
import AccountDataReducer from './reducer/AccountDataReducer';
import MembershipReducer from './reducer/MembershipReducer';

const reducer = combineReducers({
  payments: PaymentsReducer,
  badges: BadgesReducer,
  auth: AuthReducer,
  profileMetadata: ProfileMetadataReducer,
  accountData: AccountDataReducer,
  membership: MembershipReducer,
});

export default reducer;
