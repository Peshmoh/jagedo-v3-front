/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthHeaders } from "@/utils/auth";

export const getSales = async (axiosInstance: any): Promise<any> => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/sales`, {
            headers: {
                Authorization: getAuthHeaders()
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to get sales data");
    }
};

export const getSalesActivities = async (axiosInstance: any): Promise<any> => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/sales/activity`, {
            headers: {
                Authorization: getAuthHeaders()
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to get sales data");
    }
};