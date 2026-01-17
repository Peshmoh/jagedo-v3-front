//@ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { TiTick } from "react-icons/ti";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { getJobRequestById } from "@/api/jobRequests.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import { AlertTriangle } from "lucide-react";

// The JobRequest interface, representing the data structure from the API
interface JobRequest {
    jobId: string;
    status: string;
    startDate: string;
    endDate?: string;
    skill: string;
    location: string;
    receiptUrl?: string;
    managedBy: string;
    description: string;
    customerNotes?: string;
    adminNotes?: string;
    attachments: string[];
    adminAttachments?: string[]; // Assuming admin attachments might exist
    createdAt: string;
}

// Helper function to format date strings into a readable format
const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

// Helper function to extract a readable file name from a URL
const getFileNameFromUrl = (url: string) => {
    try {
        const decodedUrl = decodeURIComponent(url);
        return decodedUrl.split("/").pop() || "download";
    } catch (error) {
        return toast.error(error);
    }
};

// A reusable component to display file lists, handling both desktop and mobile views
const FileList = ({ files, title }: { files: string[]; title: string }) => {
    if (!files || files.length === 0) {
        return (
            <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">{title}</h3>
                <p className="text-gray-500 text-sm">No files attached.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">{title}</h3>
            {/* Desktop Table View */}
            <div className="hidden md:block">
                <table className="w-full border-collapse rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">File Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((fileUrl, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 border-t border-gray-200 text-sm">{getFileNameFromUrl(fileUrl)}</td>
                                <td className="px-4 py-3 border-t border-gray-200">
                                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-blue-700 flex items-center gap-2 text-sm">
                                        <ArrowDownTrayIcon className="w-4 h-4" />
                                        Download
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {files.map((fileUrl, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-800 truncate pr-2">{getFileNameFromUrl(fileUrl)}</span>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-blue-700 flex items-center gap-1 text-sm flex-shrink-0">
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function JobProffRequestDetails() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

    const [jobRequest, setJobRequest] = useState<JobRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobRequest = async () => {
            if (!id) {
                setError("Job ID is missing.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const response = await getJobRequestById(axiosInstance, id);
                if (response.success && response.data) {
                    setJobRequest(response.data);
                } else {
                    setError(response.message || "Failed to fetch job request.");
                    toast.error(response.message || "Could not load job details.");
                }
            } catch (err) {
                console.error("Error fetching job request:", err);
                setError("An unexpected error occurred while fetching job details.");
                toast.error("An unexpected error occurred.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobRequest();
    }, [id]);

    const handleClick = () => {
        navigate(`/contractor/bid/job/${id}`);
    };

    if (isLoading) {
        return (
            <>
                <DashboardHeader />
                <div className="flex justify-center items-center h-96">
                    <div className="flex justify-center items-center"><Loader /></div>;
                </div>
            </>
        );
    }

    if (error || !jobRequest) {
        return (
            <>
                <DashboardHeader />
                <div className="max-w-4xl mx-auto p-6 mt-10 text-center">
                    <div className="bg-red-50 border border-red-200 p-8 rounded-lg">
                        <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
                        <h2 className="mt-4 text-xl font-semibold text-red-800">Could not load job details</h2>
                        <p className="mt-2 text-red-600">{error || "The requested job could not be found."}</p>
                    </div>
                </div>
            </>
        );
    }

    const jobDetails = [
        { label: "Skill/Trade", value: jobRequest.skill },
        { label: "Location", value: jobRequest.location },
        { label: "Start Date", value: formatDate(jobRequest.startDate) },
        { label: "End Date", value: formatDate(jobRequest.endDate) },
    ];

    return (
        <>
            <DashboardHeader />
            <section className="max-w-4xl mx-auto p-3 md:p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-5 mb-5 md:mt-20">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-gray-50 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">{jobRequest.jobId}</h1>
                    <span className="text-xs font-semibold capitalize bg-[rgb(0,0,122)] text-white px-3 py-1 rounded-full w-fit">
                        {jobRequest.status.replace(/_/g, ' ')}
                    </span>
                    <h2 className="text-xs md:text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm w-fit">
                        Created: {formatDate(jobRequest.createdAt)}
                    </h2>
                </div>

                <div className="p-4 md:p-8 my-6 rounded-xl shadow-lg bg-white border border-gray-200">
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Job Details</h2>
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                        <div className="w-full lg:w-1/2 space-y-4">
                            {jobDetails.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <span className="font-semibold text-gray-800 sm:w-28 flex-shrink-0 text-sm">{item.label}:</span>
                                    <span className="text-gray-700 text-sm break-words">{item.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="w-full lg:w-1/2 lg:pl-8 lg:border-l border-gray-200 space-y-4 mt-6 lg:mt-0">
                            {jobRequest.payments.length > 0 ? (
                                <a href="#" className="flex items-center space-x-2 bg-green-50 p-4 rounded-lg border border-green-200 hover:bg-green-100 transition-colors" onClick={() => navigate(`/receipts/${jobRequest?.payments[jobRequest?.payments.length - 1].id}`)}>
                                    <ArrowDownTrayIcon className="h-6 w-6 text-green-700 flex-shrink-0" />
                                    <span className="text-green-800 font-medium">Download Receipt</span>
                                </a>
                            ) : (
                                <div className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg border border-gray-200 opacity-60 cursor-not-allowed">
                                    <ArrowDownTrayIcon className="h-6 w-6 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-600 font-medium">Receipt Not Available</span>
                                </div>
                            )}

                            {jobRequest.managedBy.toLowerCase() === 'jagedo' && (
                                <div className="bg-blue-50 p-4 rounded-2xl shadow-md border border-gray-200">
                                    <h3 className="text-xl font-bold text-blue-900 mb-2">Managed by Jagedo</h3>
                                    <p className="text-lg font-semibold text-gray-800 mb-4">Jagedo Oversees</p>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-start"><TiTick className="text-green-500 mr-2 text-xl flex-shrink-0" /><span>Arrival time</span></li>
                                        <li className="flex items-start"><TiTick className="text-green-500 mr-2 text-xl flex-shrink-0" /><span>Scope budget</span></li>
                                        <li className="flex items-start"><TiTick className="text-green-500 mr-2 text-xl flex-shrink-0" /><span>Quality through peer review & professionalism</span></li>
                                    </ul>
                                </div>
                            )}
                            {jobRequest.managedBy.toLowerCase() === 'self' && (
                                <div className="bg-yellow-50 p-4 rounded-2xl shadow-md border border-gray-200">
                                    <h3 className="text-xl font-bold text-yellow-900 mb-2">Self Managed</h3>
                                    <p className="text-lg font-semibold text-gray-800 mb-4">You Manage</p>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-start"><TiTick className="text-green-500 mr-2 text-xl flex-shrink-0" /><span>Arrival time</span></li>
                                        <li className="flex items-start"><TiTick className="text-green-500 mr-2 text-xl flex-shrink-0" /><span>Scope budget</span></li>
                                        <li className="flex items-start"><TiTick className="text-green-500 mr-2 text-xl flex-shrink-0" /><span>Quality through your own standards</span></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-4 md:p-8 shadow-lg rounded-xl border border-gray-200">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Job Description</h2>
                        <p className="text-gray-600 leading-relaxed text-sm">{jobRequest.description || "No description provided."}</p>
                    </div>
                    <div className="lg:pl-6 lg:border-l border-gray-200">
                        <FileList files={jobRequest.attachments} title="Job Attachments" />
                    </div>
                </div>

                {(jobRequest.adminNotes || (jobRequest.adminAttachments && jobRequest.adminAttachments.length > 0)) && (
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-4 md:p-8 shadow-lg rounded-xl border border-gray-200">
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Admin Notes</h2>
                            <p className="text-gray-600 leading-relaxed text-sm">{jobRequest.adminNotes || "No admin notes provided."}</p>
                        </div>
                        <div className="lg:pl-6 lg:border-l border-gray-200">
                            <FileList files={jobRequest.adminAttachments || []} title="Admin Files" />
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-center bg-white py-4">
                    <button type="button" onClick={handleClick} className="w-full sm:w-auto bg-blue-900 text-white py-3 px-8 rounded-md font-medium transition-all hover:bg-blue-800 hover:shadow-lg">
                        Create Quote
                    </button>
                </div>
            </section>
        </>
    );
}

export default JobProffRequestDetails;