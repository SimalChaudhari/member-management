import axiosInstance from "config/axios";

export const badgesList = () => async (dispatch: any) => {
    try {
        const response = await axiosInstance.get('/services/apexrest/v1/courseAndEvents/getBadges');
        dispatch({
            type: "BADGES_LIST",
            payload: response.data,
        });
        return true;
    } catch (error) {
        const errorMessage = error?.response?.data?.message;
        console.log(errorMessage);
    }
    return false;
};