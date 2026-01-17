/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthHeaders } from "@/utils/auth";
import axios from "axios";

interface County {
    id: number;
    superOrgId: number;
    iso2: string;
    name: string;
    isActive: boolean;
    callCode: string;
    orgId: number;
}

interface Country {
    id: number;
    name: string;
    iso2: string;
    currency: string;
    isActive: boolean;
    callCode: string;
}

// Country API functions
export const getAllCountries = async (): Promise<Country[]> => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/countries/active`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch all countries");
    }
};



export const getCountriesByCurrency = async (axiosInstance: any, currency: string): Promise<any> => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/countries/by-currency/${currency}`, {
            headers: {
                Authorization: getAuthHeaders()
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch countries by currency");
    }
};


export const getCountiesByISO2 = async (axiosInstance: any, iso2: string): Promise<any> => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/counties/${iso2}`, {
            headers: {
                Authorization: getAuthHeaders()
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch counties by ISO2 code");
    }
};

export const getCountiesByCallCode = async (axiosInstance: any): Promise<any> => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/counties/call-code`, {
            headers: {
                Authorization: getAuthHeaders()
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch counties by call code");
    }
};

export const getAllCounties = async (): Promise<County[]> => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/counties/all`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch all counties");
    }
};



//Get all regions
export const getAllRegions = async (axiosInstance: any): Promise<any> => {
    try {
        const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/regions`, {
            headers: {
                Authorization: getAuthHeaders()
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch all regions");
    }
};