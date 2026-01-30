  
const initialState = {
    payments: [],

};
const PaymentsReducer = (state = initialState, { type, payload }: { type: string; payload: any }) => {
    switch (type) {
        case "PAYMENTS_LIST":
            return {
                ...state,
                payments: payload,
            };
      
        default:
            return state;
    }
};
export default PaymentsReducer;
