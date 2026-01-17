import { getAuthHeaders } from "@/utils/auth";

// Get all bid requests for a customer
export const getReceipts = async (axiosInstance: any): Promise<any> => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/receipts/user`, {
            headers: {
                Authorization: getAuthHeaders()
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch receipts");
    }
};

export const getReceipt = async (axiosInstance: any, id: any): Promise<any> => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/receipts/${id}`, {
            headers: {
                Authorization: getAuthHeaders()
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch receipts");
    }
};

