import { combineReducers } from 'redux';
import PaymentsReducer from './reducer/Payments';
import BadgesReducer from './reducer/BadgesReducer';
const reducer = combineReducers({
    payments: PaymentsReducer,
    badges: BadgesReducer,
});

export default reducer;
