//@ts-nocheck
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import { getJobRequestById } from "@/api/jobRequests.api";
import { InvoiceDetail } from "@/components/invoice-detail";
import toast from "react-hot-toast";

// Interface updated to handle an array of strings for attachments
interface JobRequest {
    jobId: string;
    status: string;
    jobType: string;
    startDate: string;
    endDate?: string;
    skill: string;
    location: string;
    receiptUrl?: string;
    createdAt?: string;
    managedBy: string;
    description: string;
    customerNotes?: string;
    level?: string; // Added level for completeness
    attachments: string[]; // <-- Updated to handle an array of URL strings
}

function CustomerDraftJobRequestDetails() {
    const { id } = useParams<{ id: string }>();
    const [jobRequest, setJobRequest] = useState<JobRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [showInvoice, setShowInvoice] = useState(false);
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

    useEffect(() => {
        let isMounted = true;
        const fetchJobRequest = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await getJobRequestById(axiosInstance, id);
                if (isMounted) {
                    if (response.success) {
                        setJobRequest(response.data);
                    } else {
                        toast.error(response.message || "Failed to fetch job request details.");
                    }
                }
            } catch (error) {
                if (isMounted) {
                    toast.error("An error occurred while fetching the job request.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchJobRequest();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const getFileNameFromUrl = (url: string) => {
        try {
            return decodeURIComponent(new URL(url).pathname.split('/').pop() || "attachment");
        } catch (e) {
            return url.split('/').pop() || "attachment";
        }
    };

    const handleCompleteRequest = () => {
        setShowInvoice(true);
    };

    const handlePaymentSuccess = () => {
        toast.success("Payment successful! Viewing your new jobs.");
        setShowInvoice(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin h-10 w-10 text-[rgb(0,0,122)]" />
            </div>
        );
    }

    if (!jobRequest) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-gray-600">Could not find the requested job.</p>
            </div>
        );
    }

    // --- MAIN CHANGE IS HERE ---
    // Use the `showInvoice` state to decide what to render.
    return (
        showInvoice ? (
            <>
                <DashboardHeader />
                <InvoiceDetail
                    invoice={jobRequest}
                    onPayment={() => {
                        handlePaymentSuccess();
                        navigate('/dashboard/customer');
                    }}
                    onBack={() => setShowInvoice(false)}
                />

            </>
        ) : (
            // Otherwise, render the main job details page
            <>
                <DashboardHeader />
                <section className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-32">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-800">
                            REQ {jobRequest.jobId}
                        </h1>
                        <h2 className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm mt-4 sm:mt-0">
                            Created: {new Date(jobRequest.createdAt || jobRequest.startDate).toLocaleDateString('en-GB')}
                        </h2>
                    </div>

                    {/* Job Detail Section */}
                    <div className="p-8 my-6 rounded-xl shadow-lg bg-white border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Job Details</h2>
                        <div className="flex flex-col md:flex-row justify-between gap-8">
                            {/* Left Column */}
                            <div className="w-full md:w-1/2 space-y-4">
                                {[
                                    { label: "Skill", value: jobRequest.skill },
                                    { label: "Level", value: jobRequest.level || 'N/A' },
                                    { label: "Location", value: jobRequest.location },
                                    { label: "Start Date", value: new Date(jobRequest.startDate).toLocaleDateString('en-GB') },
                                    { label: "End Date", value: jobRequest.endDate ? new Date(jobRequest.endDate).toLocaleDateString('en-GB') : 'N/A' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <span className="font-semibold text-gray-800 w-28 text-sm">{item.label}:</span>
                                        <span className="text-gray-700 text-sm">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Right Column */}
                            <div className="w-full md:w-1/2 md:pl-8 md:border-l border-green-200 space-y-4">
                                {jobRequest?.payments.length > 0 && (<a
                                    href="#"
                                    className={`flex items-center w-full space-x-2 p-4 rounded-lg border transition-colors bg-green-50 border-green-200 text-green-700 hover:bg-gray-100`}
                                    onClick={() => navigate(`/receipts/${jobRequest?.payments[jobRequest?.payments.length - 1].id}`)}
                                >
                                    <ArrowDownTrayIcon className="h-6 w-6" />
                                    <span className="font-medium">Download Receipt</span>
                                </a>)}
                                <div className="bg-blue-50 p-4 rounded-2xl shadow-md border border-gray-200">
                                    <h3 className="text-xl font-bold text-blue-900">Managed by {jobRequest.managedBy}</h3>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-2xl shadow-md mt-4 border border-gray-200">
                                    <h3 className="text-xl font-bold text-blue-900 mb-2">Package details</h3>
                                    <p className="text-lg font-semibold text-gray-800">Jagedo Oversees</p>
                                    <ul className="space-y-3 mt-4 text-gray-700">
                                        {["Arrival time", "Scope budget", "Workmanship for a day"].map((text, idx) => (
                                            <li key={idx} className="flex items-center">
                                                <TiTick className="text-green-500 mr-2 text-xl" /> {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Description and Files */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 shadow-lg rounded-xl border border-gray-200 my-6">
                        <div className="md:border-r border-gray-200 md:pr-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
                            <p className="text-gray-600 leading-relaxed">{jobRequest.description || 'No description provided.'}</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Attachments</h2>
                            {jobRequest.attachments && jobRequest.attachments.length > 0 ? (
                                <table className="w-full border-collapse rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">File Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobRequest.attachments.map((url, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
                                                <td className="px-6 py-4 border-t border-gray-200 break-all">{getFileNameFromUrl(url)}</td>
                                                <td className="px-6 py-4 border-t border-gray-200">
                                                    <a href={url} download target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-blue-700 flex items-center gap-2 transition-colors">
                                                        <ArrowDownTrayIcon className="w-5 h-5" /> Download
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500 mt-2">No attachments provided.</p>
                            )}
                        </div>
                    </div>

                    {jobRequest.jobType === 'FUNDI' && (
                        <div className="flex justify-end mt-4">
                            <button onClick={handleCompleteRequest} className="bg-[rgb(0,0,122)] text-white font-semibold px-6 py-3 rounded-full hover:bg-[rgb(0,0,100)] transition">
                                Complete Request
                            </button>
                        </div>
                    )}
                </section>
            </>
        )
    );
}

export default CustomerDraftJobRequestDetails;