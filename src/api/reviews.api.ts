import { getAuthHeaders } from "@/utils/auth";

export const createReview = async (axiosInstance: any, reviewData: any): Promise<any> => {
    try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_SERVER_URL}/api/reviews`, reviewData, {
            headers: {
                Authorization: getAuthHeaders()
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to create review");
    }
};

export const getReviews = async (axiosInstance: any, jobRequestId: string): Promise<any> => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/reviews/job/${jobRequestId}`, {
            headers: {
                Authorization: getAuthHeaders()
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch reviews");
    }
};
