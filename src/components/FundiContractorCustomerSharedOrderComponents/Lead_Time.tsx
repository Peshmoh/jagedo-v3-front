import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProvierOrderRequestsById } from "@/api/orderRequests.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import Loader  from "../Loader";

const LeadTime = () => {
  const { id } = useParams<{ id: string }>();
  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
  
  const [startDate, setStartDate] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    const fetchTimelineData = async () => {
      try {
        setLoading(true);
        const response = await getProvierOrderRequestsById(axiosInstance, id);
        if (response && response.success) {
          const { createdAt, deliveryConfirmedAt } = response.data;
          setStartDate(createdAt || "");
          setDeliveryDate(deliveryConfirmedAt || "");
        } else {
          throw new Error(response.message || "Failed to fetch timeline data.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        console.error("Error fetching lead time:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, [id]);

  // Helper to format ISO date strings into a readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDuration = () => {
    if (startDate && deliveryDate) {
      const start = new Date(startDate);
      const end = new Date(deliveryDate);
      
      // Check for invalid date strings
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return 0;
      }
      
      const timeDiff = end.getTime() - start.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      return dayDiff >= 0 ? dayDiff : 0;
    }
    return 0;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        <p>{error}</p>
      </div>
    );
  }

  const duration = calculateDuration();

  return (
    <>
      <div className="mt-10 min-h-screen flex items-start justify-center bg-gray-100 py-20 px-6">
        <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-10 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Delivery Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date Display */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Start Date
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-800">{formatDate(startDate)}</p>
              </div>
            </div>

            {/* Delivery Date Display */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Delivery Date
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                 <p className="text-gray-800">{formatDate(deliveryDate)}</p>
              </div>
            </div>
          </div>

          {/* Duration Display */}
          <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">Estimated Duration:</p>
            <p className="text-xl font-bold text-blue-900 mt-1">
              {duration} {duration === 1 ? "day" : "days"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadTime;