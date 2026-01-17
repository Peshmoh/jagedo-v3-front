import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderRequestsById } from "@/api/orderRequests.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import Loader from "../Loader";

// The percentage rate for the commission (e.g., 0.30 for 30%)
const COMMISSION_RATE = 0.30;

const PaymentBreakdown = () => {
    const { id } = useParams<{ id: string }>();
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

    const [totalAmount, setTotalAmount] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Order ID is missing.");
            setLoading(false);
            return;
        }

        const fetchPaymentData = async () => {
            try {
                setLoading(true);
                const response = await getOrderRequestsById(axiosInstance, id);
                if (response && response.success) {
                    setTotalAmount(response.totalAmount);
                } else {
                    throw new Error(response.message || "Failed to fetch payment details.");
                }
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred.");
                console.error("Error fetching payment breakdown:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, [id]);

    // Helper function to format numbers as KSH currency
    const formatCurrency = (amount: number | null | undefined) => {
        if (typeof amount !== 'number') {
            return 'KSH 0';
        }

        return `KSH ${amount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error || totalAmount === null) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
                <p>{error || "Could not load payment data."}</p>
            </div>
        );
    }

    // Perform calculations based on the fetched total amount
    const commissionAmount = totalAmount * COMMISSION_RATE;
    const payableAmount = totalAmount - commissionAmount;

    return (
        <>
            <div className="min-h-screen flex items-start justify-center bg-gray-100 pt-2 sm:pt-4 pb-4 sm:pb-6 px-2 sm:px-0">
                <div className="max-w-6xl w-full mx-auto p-3 sm:p-4 md:p-6 bg-white shadow-md rounded-md flex flex-col space-y-4 sm:space-y-6">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-600 mt-1 sm:mt-2 mb-3 sm:mb-4 px-1 sm:px-0">
                        Payment Summary
                    </h1>

                    <div className="bg-white shadow-md rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 mb-4 sm:mb-6">
                        {/* Customer Payment Row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 space-y-1 sm:space-y-0">
                            <span className="text-sm sm:text-base text-gray-700 font-medium">
                                Paid by Customer
                            </span>
                            <span className="font-semibold text-gray-800 text-base sm:text-base self-start sm:self-auto">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>

                        {/* Commission Row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between text-gray-600 space-y-1 sm:space-y-0">
                            <span className="text-sm sm:text-base leading-relaxed pr-2 sm:pr-4">
                                JaGedo Commission @{COMMISSION_RATE * 100}% inclusive VAT
                            </span>
                            <span className="font-semibold text-gray-800 text-base sm:text-base self-start sm:self-auto">
                                {formatCurrency(commissionAmount)}
                            </span>
                        </div>

                        {/* Divider and Final Amount */}
                        <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                                <span className="text-base sm:text-lg font-semibold text-gray-700">
                                    Payable to Fundi
                                </span>
                                <span className="text-lg sm:text-xl font-bold text-[rgb(0,0,122)] self-start sm:self-auto">
                                    {formatCurrency(payableAmount)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentBreakdown;