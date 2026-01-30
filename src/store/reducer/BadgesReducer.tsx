const initialState = {
    badges: [],
};

const BadgesReducer = (state = initialState, { type, payload }: { type: string; payload: any }) => {
    switch (type) {
        case "BADGES_LIST":
            return {
                ...state,
                badges: payload,
            };
        default:
            return state;
    }
};

export default BadgesReducer;