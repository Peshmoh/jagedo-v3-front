import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProvierOrderRequestsById } from "@/api/orderRequests.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import Loader from "../Loader";

// Interface for the fetched summary data
interface SummaryData {
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
}

const GrandSummary = () => {
  const { id } = useParams<{ id: string }>();
  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    const fetchGrandSummary = async () => {
      try {
        setLoading(true);
        const response = await getProvierOrderRequestsById(axiosInstance, id);
        if (response && response.success) {
          const { subTotal, deliveryFee, totalAmount } = response.data;
          setSummaryData({
            subtotal: subTotal,
            deliveryFee: deliveryFee,
            grandTotal: totalAmount,
          });
        } else {
          throw new Error(response.message || "Failed to fetch order summary.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        console.error("Error fetching grand summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrandSummary();
  }, [id]);

  // Helper for currency formatting
  const formatCurrency = (amount: number | null | undefined) => {
    if (typeof amount !== 'number') {
      return "KES 0.00";
    }
    return `KES ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !summaryData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        <p>{error || "Could not load order summary."}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 min-h-screen flex items-center justify-center bg-gray-100 py-4 md:py-10 px-4">
        <div className="max-w-4xl w-full mx-auto p-3 md:p-6 bg-white shadow-md rounded-md flex flex-col space-y-4 md:space-y-6">
          <h2 className="text-lg md:text-2xl font-semibold text-gray-700 mt-3 md:mt-6 mb-2 md:mb-4">
            Order Summary
          </h2>

          <div className="bg-white shadow-md rounded-xl p-3 md:p-6 border border-gray-200 space-y-4 md:space-y-6">
            {/* Simplified Summary Section */}
            <div className="space-y-4 text-gray-700">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium">Subtotal</span>
                <span className="text-base font-semibold">
                  {formatCurrency(summaryData.subtotal)}
                </span>
              </div>

              {/* Delivery Fee */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium">Delivery Fee</span>
                <span className="text-base font-semibold">
                  {summaryData.deliveryFee > 0 ? formatCurrency(summaryData.deliveryFee) : "TBD"}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between font-bold text-green-700 text-base md:text-lg border-t pt-4 mt-4">
              <span>Grand Total</span>
              <span>{formatCurrency(summaryData.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GrandSummary;