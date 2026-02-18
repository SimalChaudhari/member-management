import { combineReducers } from 'redux';
import BadgesReducer from './reducer/BadgesReducer';
import AuthReducer from './reducer/AuthReducer';
import ProfileMetadataReducer from './reducer/ProfileMetadataReducer';
import AccountDataReducer from './reducer/AccountDataReducer';
import MembershipReducer from './reducer/MembershipReducer';
import MyPaymentsReducer from './reducer/MyPaymentsReducer';
import MyVouchersReducer from './reducer/MyVouchersReducer';
import MyCertificatesReducer from './reducer/MyCertificatesReducer';
import CourseRegistrationReducer from './reducer/CourseRegistrationReducer';
import WorkExperienceMetadataReducer from './reducer/WorkExperienceMetadataReducer';

const reducer = combineReducers({

  badges: BadgesReducer,
  auth: AuthReducer,
  profileMetadata: ProfileMetadataReducer,
  accountData: AccountDataReducer,
  membership: MembershipReducer,
  myPayments: MyPaymentsReducer,
  myVouchers: MyVouchersReducer,
  myCertificates: MyCertificatesReducer,
  courseRegistration: CourseRegistrationReducer,
  workExperienceMetadata: WorkExperienceMetadataReducer,
});

export default reducer;
