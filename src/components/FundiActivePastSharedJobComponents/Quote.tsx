/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Loader } from "lucide-react";
import { getJobRequestById } from "@/api/jobRequests.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";

interface JobData {
    id: number;
    jobId: string;
    totalAmount: number;
    serviceProviderPaid: number;
    jagedoFee: number;
}

const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return "KES 0.00";
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
    }).format(amount);
};


const QuoteSection = ({ billSummary, grandTotal, expandedBill, setExpandedBill }) => {
    const toggleBill = (id) => {
        setExpandedBill(expandedBill === id ? null : id);
    };

    return (
        <div className="max-w-6xl w-full min-h-[85vh] mx-auto p-6 bg-white shadow-md rounded-md flex flex-col">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Bid Details</h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Bill Summary
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        {/* Table Head */}
                        <thead>
                            <tr className="bg-blue-100 text-gray-800">
                                <th className="border p-3">No</th>
                                <th className="border p-3">Bill</th>
                                <th className="border p-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {billSummary.map((bill) => (
                                <Fragment key={bill.id}>
                                    <tr className="cursor-pointer hover:bg-gray-100 transition" onClick={() => toggleBill(bill.id)}>
                                        <td className="border p-3 text-center">{bill.id}</td>
                                        <td className="border p-3">{bill.title}</td>
                                        <td className="border p-3 text-right">{formatCurrency(bill.amount)}</td>
                                    </tr>
                                    {expandedBill === bill.id && (
                                        <tr>
                                            <td colSpan={3} className="border p-4 bg-gray-50">
                                                <h4 className="text-lg font-medium mb-2">Bill No {bill.id}: {bill.title}</h4>
                                                <table className="w-full text-sm border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-200 text-gray-800">
                                                            <th className="border p-2">No</th>
                                                            <th className="border p-2">Description</th>
                                                            <th className="border p-2 text-right">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bill.details.map((detail, index) => (
                                                            <tr key={index} className="bg-white">
                                                                <td className="border p-2 text-center">{detail.no}</td>
                                                                <td className="border p-2">{detail.description}</td>
                                                                <td className="border p-2 text-right">{formatCurrency(detail.amount)}</td>
                                                            </tr>
                                                        ))}
                                                        <tr className="bg-gray-100 font-semibold">
                                                            <td colSpan={2} className="border p-2 text-right">Subtotal:</td>
                                                            <td className="border p-2 text-right">{formatCurrency(bill.amount)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-right text-lg font-semibold">
                    Grand Total:{" "}
                    <span className="text-green-600">{formatCurrency(grandTotal)}</span>
                </div>
            </div>
        </div>
    );
};

QuoteSection.propTypes = {
    billSummary: PropTypes.array.isRequired,
    grandTotal: PropTypes.number.isRequired,
    expandedBill: PropTypes.any,
    setExpandedBill: PropTypes.func.isRequired,
};

const ProjectQuoteForm = () => {
    const [jobData, setJobData] = useState<JobData | null>(null);
    const [billSummary, setBillSummary] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedBill, setExpandedBill] = useState(null);

    const { id } = useParams<{ id: string }>(); // Get ID from URL
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

    // Corrected useEffect for fetching data
    useEffect(() => {
        if (!id) {
            setError("Job ID is missing from the URL.");
            setLoading(false);
            return;
        }

        const fetchJobData = async () => {
            try {
                setLoading(true);
                const response = await getJobRequestById(axiosInstance, id);
                if (response.success && response.data) {
                    setJobData(response.data);
                } else {
                    throw new Error(response.message || "Failed to fetch job data.");
                }
                setError(null);
            } catch (err) {
                console.error("Error fetching job data:", err);
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobData();
    }, [id]);

    useEffect(() => {
        if (jobData) {
            const summary = [
                {
                    id: 1,
                    title: "Labor Cost (Payment to Service Provider)",
                    amount: jobData.serviceProviderPaid,
                    details: [{ no: 1, description: "Total payable amount for labor and related expenses.", amount: jobData.serviceProviderPaid }],
                },
                {
                    id: 2,
                    title: "Jagedo Service Fee",
                    amount: jobData.jagedoFee,
                    details: [{ no: 1, description: "Platform and management fee.", amount: jobData.jagedoFee }],
                },
            ];
            setBillSummary(summary);

            setGrandTotal(jobData.discountedPrice);
        }
    }, [jobData]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Loader className="animate-spin h-10 w-10 text-blue-600" />
        </div>
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-xl text-red-500">{error}</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <main className="flex-1 overflow-y-auto">
                <QuoteSection
                    billSummary={billSummary}
                    grandTotal={grandTotal}
                    expandedBill={expandedBill}
                    setExpandedBill={setExpandedBill}
                />
            </main>
        </div>
    );
};

export default ProjectQuoteForm;