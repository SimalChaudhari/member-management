import axiosInstance from "config/axios";

export const paymentsList = () => async (dispatch: any) => {
    try {
        const response = await axiosInstance.get('/services/apexrest/v1/courseAndEvents/getPayments');
        dispatch({
            type: "PAYMENTS_LIST",
            payload: response.data, // Assuming response contains the customers data
        });
        return true;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message ;
        console.log(errorMessage);
    }
    return false; // Return false for any errors
};