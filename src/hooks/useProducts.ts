import { useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import { getAllProducts } from "@/api/products.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";


interface ApiPriceEntry {
    regionId: number;
    regionName: string;
    price: number;
}

interface RawApiProduct {
    id: number;
    name: string;
    description: string | null;
    type: string;
    category: string;
    images: string[] | null;
    prices: ApiPriceEntry[] | null;
    custom: boolean;
    customPrice: number | null; 
    material: string | null;
    size: string | null;
    color: string | null;
    sku: string | null;
    bId: string | null;
    uom: string | null;
    
}

export interface Product {
    id: string;
    productId: number;
    name: string;
    description?: string;
    type: string;
    category: string;
    price: number;
    custom: boolean;
    regionName?: string;
    images: string[];
    specifications: {
        material?: string;
        size?: string;
        color?: string;
        sku?: string;
        bid?: string;
        uom?: string;
    };
}


const transformAndFlattenProducts = (rawProducts: RawApiProduct[]): Product[] => {
    return rawProducts.flatMap((rawProduct): Product[] => {
        const baseProductData = {
            productId: rawProduct.id,
            name: rawProduct.name,
            description: rawProduct.description ?? undefined,
            type: rawProduct.type,
            category: rawProduct.category,
            images: rawProduct.images || [],
            specifications: {
                material: rawProduct.material ?? undefined,
                size: rawProduct.size ?? undefined,
                color: rawProduct.color ?? undefined,
                sku: rawProduct.sku ?? undefined,
                bid: rawProduct.bId ?? undefined,
                uom: rawProduct.uom ?? undefined,
            },
        };

        if (rawProduct.custom) {
            if (rawProduct.customPrice === null || typeof rawProduct.customPrice !== 'number') {
                return []; 
            }

            
            return [{
                ...baseProductData,
                id: `${rawProduct.id}-custom`,
                price: rawProduct.customPrice,
                custom: true,
            }];
        }
        
        
        return (rawProduct.prices || []).map(priceEntry => ({
            ...baseProductData,
            id: `${rawProduct.id}-${priceEntry.regionId}`,
            price: priceEntry.price,
            custom: false,
            regionName: priceEntry.regionName,
        }));
    });
};


const fetchProducts = async (axiosInstance: AxiosInstance): Promise<Product[]> => {
    try {
        const response = await getAllProducts(axiosInstance);

        if (!response.success || !Array.isArray(response.hashSet)) {
            throw new Error(response.message || "Failed to fetch products: Invalid API response format");
        }
        
        const rawProducts: RawApiProduct[] = response.hashSet;
        return transformAndFlattenProducts(rawProducts);

    } catch (error) {
        console.error("Error fetching or transforming products:", error);
        throw error;
    }
};


export const useProducts = () => {
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

    return useQuery<Product[]>({
        queryKey: ["products"] as const,
        queryFn: () => fetchProducts(axiosInstance),
        enabled: !!axiosInstance,
        staleTime: 5 * 60 * 1000,
    });
};