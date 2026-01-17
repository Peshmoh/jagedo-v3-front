/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Star, Download } from "lucide-react";
import { getJobRequestById } from "@/api/jobRequests.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";

const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat('en-US').format(amount);
};

const getMilestoneStatus = (milestone) => {
    if (milestone.paid) return "Paid";
    if (milestone.approved) return "Approved, Pending Payment";
    if (milestone.rejected) return "Rejected";
    if (milestone.complete) return "Pending Confirmation";
    return "Unpaid";
};

const EvaluationTable = ({ onMakePayment }) => {
    const { id } = useParams();
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMilestones, setSelectedMilestones] = useState([]);
    const [milestones, setMilestones] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError("Job ID is missing.");
                setLoading(false);
                return;
            }
            try {
                const response = await getJobRequestById(axiosInstance, id);
                if (response.success) {
                    setJobData(response.data);
                    const milestones = response.data?.assignedBid?.milestones.sort((a, b) => a.id - b.id);
                    setMilestones(milestones);

                    // if (milestones && milestones.length > 0) {
                    // setSelectedMilestones([]);
                    // }
                } else {
                    setError(response.message || "Failed to fetch job details.");
                }
            } catch (err) {
                setError("An error occurred while fetching the data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const isMilestoneSelectable = (milestoneId) => {
        const currentIndex = milestones.findIndex(milestone => milestone.id === milestoneId);

        if (currentIndex === 0) return true;
        if (currentIndex === -1) return false;

        const previousMilestones = milestones.slice(0, currentIndex);
        return previousMilestones.every(milestone =>
            selectedMilestones.includes(milestone.id) || milestone.paid
        );
    };


    const toggleMilestone = (milestoneId) => {
        if (!isMilestoneSelectable(milestoneId)) return;

        setSelectedMilestones((prev) => {
            const currentIndex = milestones.findIndex(milestone => milestone.id === milestoneId);

            if (prev.includes(milestoneId)) {
                return prev.filter(id => {
                    const idIndex = milestones.findIndex(milestone => milestone.id === id);
                    return idIndex < currentIndex;
                });
            } else {
                return [...prev, milestoneId];
            }
        });
    };

    const handleMakePayment = () => {
        if (selectedMilestones.length === 0 || !jobData) {
            alert("Please select at least one milestone to pay.");
            return;
        }
        const fullSelectedMilestones = jobData.assignedBid.milestones.filter(milestone =>
            selectedMilestones.includes(milestone.id)
        );
        const dataForPayment = {
            milestones: fullSelectedMilestones,
            jobInfo: {
                jobId: jobData.jobId,
                skill: jobData.skill,
                description: jobData.description,
                managedBy: jobData.managedBy,
            },
            customerInfo: {
                name: `${jobData.customer.firstName} ${jobData.customer.lastName}`,
            },
        };
        onMakePayment(dataForPayment);
    };

    const StarRating = ({ rating, maxStars = 5 }) => (
        <div className="flex items-center">
            {[...Array(maxStars)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < (rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
            ))}
        </div>
    );
    StarRating.propTypes = { rating: PropTypes.number, maxStars: PropTypes.number };

    if (loading) {
        return <div className="text-center p-10">Loading job details...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-600">Error: {error}</div>;
    }

    if (!jobData || !jobData.assignedBid) {
        return <div className="text-center p-10">No awarded bid information found for this job.</div>;
    }

    const { assignedBid, evaluationComments } = jobData;
    const totalBidAmount = (assignedBid.professionalFees || []).reduce((sum, fee) => sum + fee.amount, 0) + (assignedBid.expenses || []).reduce((sum, exp) => sum + exp.amount, 0);
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-4 text-gray-900">Evaluation Table</h2>
                <div className="overflow-x-auto mb-6">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">QTN No</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Execution Duration (Days)</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remarks</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Creation Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="py-4 px-4 whitespace-nowrap text-gray-700">{assignedBid.id}</td>
                                <td className="py-4 px-4 whitespace-nowrap"><StarRating rating={assignedBid.rating} /></td>
                                <td className="py-4 px-4 whitespace-nowrap text-gray-700">{formatCurrency(totalBidAmount)}</td>
                                <td className="py-4 px-4 whitespace-nowrap text-gray-700">{assignedBid.totalDuration}</td>
                                <td className="py-4 px-4 whitespace-nowrap text-gray-700">{assignedBid.score || 'N/A'}</td>
                                <td className="py-4 px-4 whitespace-nowrap text-gray-700">{assignedBid.remarks || 'N/A'}</td>
                                <td className="py-4 px-4 whitespace-nowrap text-gray-700">{new Date(assignedBid.createdAt).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">Evaluation Comments:</label>
                    <textarea id="comments" rows={3} className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-800 focus:ring-blue-500 focus:border-blue-500" readOnly defaultValue={evaluationComments || ''} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-4 text-gray-900">Payment Milestones</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Select to Pay</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Milestones</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Percentage</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {(milestones || [])
                                .map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="py-4 px-4">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                checked={item.paid || selectedMilestones.includes(item.id)}
                                                onChange={() => toggleMilestone(item.id)}
                                                disabled={item.paid || !isMilestoneSelectable(item.id)}
                                            />
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap text-gray-700">{item.name}</td>
                                        <td className="py-4 px-4 whitespace-nowrap text-gray-700">{item.percentageDisbursement}%</td>
                                        <td className="py-4 px-4 whitespace-nowrap text-gray-700">{formatCurrency(item.amount)}</td>
                                        <td className="py-4 px-4 whitespace-nowrap text-gray-700">{getMilestoneStatus(item)}</td>
                                        <td className="py-4 px-4 text-center">
                                            {item.paymentReceipt ? (
                                                <a
                                                    href={item.paymentReceipt}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download
                                                    className="text-gray-500 hover:text-blue-600 flex flex-col items-center mx-auto"
                                                >
                                                    <Download className="h-5 w-5" />
                                                    <span className="text-xs mt-1 underline">Download Receipt</span>
                                                </a>
                                            ) : (
                                                <div className="text-gray-300 cursor-not-allowed flex flex-col items-center mx-auto">
                                                    <Download className="h-5 w-5" />
                                                    <span className="text-xs mt-1">No Receipt</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <button onClick={handleMakePayment} disabled={selectedMilestones.length === 0} className="bg-slate-900 text-white font-semibold py-2 px-6 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Make Payment
                </button>
            </div>
        </div>
    );
};
EvaluationTable.propTypes = {
    onMakePayment: PropTypes.func.isRequired,
};
export default EvaluationTable;