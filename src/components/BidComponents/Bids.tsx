/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { awardBid } from "@/api/bidRequests.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import toast from "react-hot-toast";

interface BidsProps {
  jobData: any;
}

// Dummy hashing function (shortens for display)
const hashBuilderId = (id: string) => {
  return id.toString().slice(0, 4) + "..." + id.toString().slice(-3); // e.g., b12e...e9a
};

const Bids = ({ jobData }: BidsProps) => {
  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
  const navigate = useNavigate();
  const [comments, setComments] = useState(jobData?.evaluationComments || "");
  const [selected, setSelected] = useState<string[]>([]);
  const [isAwarding, setIsAwarding] = useState(false);

  const submittedBids = jobData?.submittedBids || [];
  const isBidAwarded = jobData?.stage === "BID_AWARDED";
  const assignedBid = jobData?.assignedBid;
  const awardedBid = assignedBid ? submittedBids?.find((bid: any) => bid.id === assignedBid.id) : null;
  // console.log("JobData: ", jobData);

  const goToQuoteDetails = (bidId: string) => {
    navigate(`/dashboard/admin/jobs/quote/${jobData?.id}`, { state: { bidId } });
  };

  const toggleSelect = (id: string) => {
    // Don't allow selection if bid is already awarded
    if (isBidAwarded) {
      return;
    }

    setSelected((prev) => {
      // If the bid is already selected, deselect it
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      // Otherwise, select only this bid (single selection)
      return [id];
    });
  };

  const StarRating = ({ rating, maxStars = 5 }: { rating: number; maxStars?: number }) => (
    <div className="flex space-x-1 justify-center">
      {[...Array(maxStars)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118L10 13.347l-3.381 2.455c-.783.57-1.838-.196-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.624 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ))}
    </div>
  );

  StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    maxStars: PropTypes.number,
  };

  const calculateDuration = (bid: any) => {
    // Calculate duration from milestones or return a default
    const milestones = bid.milestones || [];
    return milestones.length > 0 ? milestones.length * 15 : 30; // Default estimation
  };

  const calculateScore = (bid: any) => {
    // Simple scoring based on amount and service provider rating
    const amount = bid.payableToServiceProvider || bid.totalAmount || 0;
    const rating = 4; // Default rating, you can get this from service provider data
    const score = Math.min(100, (rating / 5) * 100 - (amount / 1000000) * 10);
    return `${Math.round(score)}%`;
  };

  const handleAwardBids = async () => {
    if (selected.length === 0) {
      toast.error("Please select a bid to award.");
      return;
    }

    if (!comments.trim()) {
      toast.error("Please enter evaluation comments before awarding the bid.");
      return;
    }

    setIsAwarding(true);

    try {
      // Award the selected bid (only one)
      const bidId = selected[0];
      await awardBid(axiosInstance, parseInt(bidId), jobData.id, comments.trim());

      toast.success("Successfully awarded the bid");

      // Clear selections and refresh data if needed
      setSelected([]);

      // Navigate back to jobs list
      navigate(`/dashboard/admin/jobs`)

    } catch (error: any) {
      console.error("Error awarding bid:", error);
      toast.error(error.message || "Failed to award bid. Please try again.");
    } finally {
      setIsAwarding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-6">
      <div className="max-w-7xl w-full mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Evaluation Table
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr className="text-sm text-gray-700">
                {!isBidAwarded && (
                  <th className="p-3 border-b border-gray-200 text-center">
                    Select One
                  </th>
                )}
                <th className="p-3 border-b border-gray-200 text-center">Bid ID</th>
                <th className="p-3 border-b border-gray-200 text-center">Service Provider</th>
                <th className="p-3 border-b border-gray-200 text-center">Rating</th>
                <th className="p-3 border-b border-gray-200 text-center">Amount</th>
                <th className="p-3 border-b border-gray-200 text-center">Duration (Days)</th>
                <th className="p-3 border-b border-gray-200 text-center">Score</th>
                <th className="p-3 border-b border-gray-200 text-center">Status</th>
                <th className="p-3 border-b border-gray-200 text-center">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submittedBids.length > 0 ? (
                submittedBids.map((bid: any) => {
                  const isAwardedBid = assignedBid && bid.id === assignedBid.id;
                  return (
                    <tr
                      key={bid.id}
                      className={`hover:bg-gray-50 transition cursor-pointer text-sm ${isAwardedBid ? 'bg-green-50 border-l-4 border-green-500' : ''
                        }`}
                      onClick={() => goToQuoteDetails(bid.id)}
                    >
                      {!isBidAwarded && (
                        <td className="p-3 text-center">
                          <input
                            type="radio"
                            name="selectedBid"
                            checked={selected.includes(bid.id.toString())}
                            onChange={() => toggleSelect(bid.id.toString())}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}
                      <td className="p-3 text-center">{bid.id}</td>
                      <td className="p-3 text-center font-mono text-xs text-gray-500">
                        {bid.serviceProvider?.organizationName ||
                          `${bid.serviceProvider?.firstName || ''} ${bid.serviceProvider?.lastName || ''}`.trim() ||
                          hashBuilderId(bid.serviceProvider?.id || '')}
                      </td>
                      <td className="p-3 text-center">
                        <StarRating rating={4} /> {/* Default rating, can be made dynamic */}
                      </td>
                      <td className="p-3 text-center">
                        {(bid.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-center">{bid?.totalDuration}</td>
                      <td className="p-3 text-center">{bid?.score}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-1 ${isAwardedBid
                          ? 'bg-green-100 text-green-800'
                          : bid.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {isAwardedBid && (
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118L10 13.347l-3.381 2.455c-.783.57-1.838-.196-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.624 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                            </svg>
                          )}
                          {isAwardedBid ? 'Awarded' : (bid.status || 'Submitted')}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {bid.createdAt ? new Date(bid.createdAt).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isBidAwarded ? 8 : 9} className="p-8 text-center text-gray-500">
                    No bids submitted for this job
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Show awarded bid info if bid is already awarded */}
        {isBidAwarded && awardedBid && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118L10 13.347l-3.381 2.455c-.783.57-1.838-.196-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.624 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
              <h3 className="text-lg font-semibold text-green-800">Bid Already Awarded</h3>
            </div>
            <p className="text-green-700">
              <strong>Awarded to:</strong> {awardedBid.serviceProvider?.organizationName ||
                `${awardedBid.serviceProvider?.firstName || ''} ${awardedBid.serviceProvider?.lastName || ''}`.trim() ||
                hashBuilderId(awardedBid.serviceProvider?.id || '')}
            </p>
            <p className="text-green-700">
              <strong>Amount:</strong> {(awardedBid.payableToServiceProvider || awardedBid.totalAmount || 0).toLocaleString()}
            </p>
            {jobData?.evaluationComments && (
              <p className="text-green-700 mt-2">
                <strong>Evaluation Comments:</strong> {jobData.evaluationComments}
              </p>
            )}
          </div>
        )}

        {/* Evaluation comment section - only show if bid not awarded */}
        {!isBidAwarded && (
          <div className="mt-6">
            <label className="block text-gray-800 font-medium mb-2">
              Evaluation Comment:
            </label>
            <input
              type="text"
              placeholder="Enter your comment here..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        )}

        {/* Award button - only show if bid not awarded */}
        {!isBidAwarded && (
          <div className="flex justify-end">
            <button
              onClick={handleAwardBids}
              disabled={selected.length === 0 || isAwarding || isBidAwarded}
              className="bg-[rgb(0,0,122)] text-white hover:bg-blue-700 mt-3 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold px-6 py-2 rounded-md shadow-md transition flex items-center gap-2"
            >
              {isAwarding && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isAwarding ? 'Awarding...' : 'Award Selected Bid'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bids;