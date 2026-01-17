import { getAuthHeaders } from "@/utils/auth";

export const getNotifications = async (axiosInstance: any): Promise<any> => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/notifications`, {
            headers: {
                Authorization: getAuthHeaders()
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch receipts");
    }
};