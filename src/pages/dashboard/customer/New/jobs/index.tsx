/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { TiTick } from "react-icons/ti";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import { getJobRequestById } from "@/api/jobRequests.api";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";

// The JobRequest interface, with attachments as an array of strings
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
    attachments: string[]; // This is correct for an array of URLs
}

function CustomerNewJobRequestDetails() {
    const { id } = useParams<{ id: string }>();
    const [jobRequest, setJobRequest] = useState<JobRequest | null>(null);

    const navigate = useNavigate();
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

    useEffect(() => {
        const fetchJobRequest = async () => {
            if (id) {
                try {
                    const response = await getJobRequestById(axiosInstance, id);
                    if (response.success) {
                        setJobRequest(response.data);
                    } else {
                        console.error(
                            "Failed to fetch job request:",
                            response.message
                        );
                    }
                } catch (error) {
                    console.error("Error fetching job request:", error);
                }
            }
        };
        fetchJobRequest();
    }, [id]); // FIX: Added dependencies to re-fetch when ID changes

    // Helper function to extract a readable filename from a URL
    const getFileNameFromUrl = (url: string) => {
        try {
            return decodeURIComponent(
                new URL(url).pathname.split("/").pop() || "attachment"
            );
        } catch (error: any) {
            console.log(error);
            // Fallback for any malformed URLs
            return url.split("/").pop() || "attachment";
        }
    };

    if (!jobRequest) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin h-10 w-10 text-[rgb(0,0,122)]" />
            </div>
        );
    }

    return (
        <>
            <DashboardHeader />
            <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors m-4"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to Dashboard
            </button>
            <section className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg border border-gray-200 my-24">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-4 justify-between w-full">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                            REQ {jobRequest.jobId}
                        </h1>
                        <span className="text-xs font-semibold bg-[rgb(0,0,122)] text-white px-4 py-[6px] rounded-full shadow-sm">
                            {jobRequest.stage}
                        </span>
                        <h2 className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm mt-4 sm:mt-0">
                            Created:{" "}
                            {new Date(
                                jobRequest.createdAt || jobRequest.updatedAt
                            ).toLocaleDateString('en-GB')}
                        </h2>
                    </div>
                </div>

                {/* Job Details */}
                <div className="p-4 sm:p-8 my-6 rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                        Job Details
                    </h2>
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        {/* Left Column */}
                        <div className="md:w-1/2 space-y-4">
                            {[
                                { label: "Skill", value: jobRequest.skill },
                                {
                                    label: "Location",
                                    value: jobRequest.location
                                },
                                {
                                    label: "Start Date",
                                    value: new Date(
                                        jobRequest.startDate
                                    ).toLocaleDateString('en-GB')
                                },
                                {
                                    label: "End Date",
                                    value: jobRequest.endDate
                                        ? new Date(
                                            jobRequest.endDate
                                        ).toLocaleDateString('en-GB')
                                        : "N/A"
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
                                >
                                    <span className="font-semibold text-gray-800 w-28 text-sm">
                                        {item.label}:
                                    </span>
                                    <span className="text-gray-700 text-sm">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Right Column */}
                        <div className="md:w-1/2 space-y-4 md:pl-8 md:border-l border-gray-200">
                            {jobRequest?.payments.length > 0 && (
                                <div className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer transition-all duration-200 ease-in-out p-3 md:p-4 rounded-lg border border-green-200 shadow-sm hover:shadow-md active:scale-95" onClick={() => navigate(`/receipts/${jobRequest.payments[jobRequest.payments.length - 1].id}`)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-green-600 flex-shrink-0 transition-colors duration-200 hover:text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3m0-6V4m-6 4l3 3 3-3" />
                                    </svg>
                                    <span className="text-green-800 font-semibold text-sm md:text-base transition-colors duration-200 hover:text-green-900">Download Receipt</span>
                                </div>)}
                            <div className="bg-blue-50 p-4 rounded-2xl shadow-md border border-gray-200">
                                <h3 className="text-xl font-bold text-blue-900">
                                    Managed by {jobRequest.managedBy}
                                </h3>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-2xl shadow-md mt-4 border border-gray-200">
                                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">
                                    Package details
                                </h3>
                                {(() => {
                                    if (!jobRequest) return null;

                                    const isManagedByJagedo =
                                        jobRequest.managedBy?.toLowerCase().includes("jagedo");

                                    if (jobRequest.jobType === "FUNDI") {
                                        if (isManagedByJagedo) {
                                            return (
                                                <>
                                                    <p className="text-lg font-semibold text-gray-800">
                                                        Jagedo Oversees
                                                    </p>
                                                    <ul className="space-y-3 mt-4 text-gray-700">
                                                        {[
                                                            "Arrival time",
                                                            "Scope budget",
                                                            "Workmanship for a day"
                                                        ].map((text, idx) => (
                                                            <li key={idx} className="flex items-center">
                                                                <TiTick className="text-green-300 mr-2 text-xl" />
                                                                {text}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            );
                                        } else {
                                            return (
                                                <ul className="space-y-3 mt-4 text-gray-700">
                                                    <li className="flex items-center">
                                                        <TiTick className="text-green-500 mr-2 text-xl" />
                                                        Arrival time
                                                    </li>
                                                    <li className="flex items-center">
                                                        <TiTick className="text-green-500 mr-2 text-xl" />
                                                        1 day payment
                                                    </li>
                                                    <p className="text-lg text-left font-bold">Client manages</p>
                                                    <li className="flex items-center">
                                                        <TiTick className="text-green-500 mr-2 text-xl" />
                                                        Workmanship for a day
                                                    </li>
                                                </ul>
                                            );
                                        }
                                    }

                                    // PROFESSIONAL
                                    if (jobRequest.jobType === "PROFESSIONAL") {
                                        if (isManagedByJagedo) {
                                            return (
                                                <>
                                                    <ul className="space-y-3 mt-4 text-gray-700">
                                                        <li className="flex items-center">
                                                            <TiTick className="text-green-300 mr-2 text-xl" />
                                                            Time: Duration of Execution
                                                        </li>
                                                        <li className="flex items-center">
                                                            <TiTick className="text-green-300 mr-2 text-xl" />
                                                            Scope of budget: Determined through Competitive bidding
                                                        </li>
                                                        <li className="flex items-center">
                                                            <TiTick className="text-green-300 mr-2 text-xl" />
                                                            Quality: Professionalism and peer reviewing
                                                        </li>
                                                    </ul>
                                                </>
                                            );
                                        } else {
                                            return (
                                                <ul className="space-y-3 mt-4 text-gray-700">
                                                    <li className="flex items-center">
                                                        <TiTick className="text-green-500 mr-2 text-xl" />
                                                        Scope budget: Determined through Competitive bidding.
                                                    </li>
                                                    <p className="text-lg text-left font-bold">Client manages</p>
                                                    <li className="flex items-center">
                                                        <TiTick className="text-green-500 mr-2 text-xl" />
                                                        Time: Duration of Execution.
                                                    </li>
                                                    <li className="flex items-center">
                                                        <TiTick className="text-green-500 mr-2 text-xl" />
                                                        Quality: Professionalism and peer review.
                                                    </li>
                                                </ul>
                                            );
                                        }
                                    }

                                    // CONTRACTOR
                                    if (jobRequest.jobType === "CONTRACTOR") {
                                        if (isManagedByJagedo) {
                                            return (
                                                <ul className="space-y-3 mt-4 text-gray-700">
                                                    <li className="flex items-center">
                                                        <TiTick className="text-green-300 mr-2 text-xl" />
                                                        Time: Duration of Execution
                                                    </li>
                                                    <li className="flex items-center">
                                                        <TiTick className="text-green-300 mr-2 text-xl" />
                                                        Scope of Budget: Determined through competitive bidding.
                                                    </li>
                                                    <li className="flex items-center">
                                                        <TiTick className="text-green-300 mr-2 text-xl" />
                                                        Quality :Workmanship and site supervisions.
                                                    </li>
                                                </ul>
                                            );
                                        } else {
                                            return (
                                                <ul className="space-y-3 mt-4 text-gray-700">
                                                    <li className="flex items-center">
                                                        <TiTick className="text-green-500 mr-2 text-xl" />
                                                        Scope of Budget: Determined through Competitve Bidding
                                                    </li>
                                                    <p className="text-lg text-left font-bold">Client manages</p>
                                                    <li className="flex items-center">
                                                        <TiTick className="text-green-500 mr-2 text-xl" />
                                                        Time: Duration of Execution
                                                    </li>
                                                    <li className="flex items-center">
                                                        <TiTick className="text-green-500 mr-2 text-xl" />
                                                        Quality :Workmanship and site supervisions.
                                                    </li>
                                                </ul>
                                            );
                                        }
                                    }

                                    // Default fallback
                                    return null;
                                })()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description and Files */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 sm:p-8 shadow-lg rounded-xl border border-gray-200 my-6">
                    <div className="border-b md:border-b-0 md:border-r border-gray-200 pr-0 md:pr-6 pb-6 md:pb-0">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                            Description
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            {jobRequest.description}
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                            Customer Attachments
                        </h2>
                        {jobRequest.attachments &&
                            jobRequest.attachments.length > 0 ? (
                            <table className="w-full min-w-[300px] border-collapse rounded-lg overflow-hidden text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-800">
                                            File Name
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-800">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* FIX: Correctly map over the array of URL strings */}
                                    {jobRequest.attachments.map(
                                        (url, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 transition-all duration-200"
                                            >
                                                <td className="px-4 py-3 border-t border-gray-200 break-words">
                                                    {/* FIX: Use the helper to get a filename from the URL */}
                                                    {getFileNameFromUrl(url)}
                                                </td>
                                                <td className="px-4 py-3 border-t border-gray-200">
                                                    {/* FIX: Set the href directly to the URL string */}
                                                    <a
                                                        href={url}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-900 hover:text-blue-700 flex items-center gap-2"
                                                    >
                                                        <ArrowDownTrayIcon className="w-5 h-5" />{" "}
                                                        Download
                                                    </a>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500 mt-2">
                                No attachments provided.
                            </p>
                        )}
                    </div>
                </div>

                {/* Conditionally render the entire Admin Notes section */}
                {jobRequest.stage !== 'UNREVIEWED' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 shadow-lg rounded-xl border border-gray-200 p-6">
                        <div className="p-6 border-r border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Admin Notes
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {jobRequest.adminNotes || "No admin notes provided."}
                            </p>
                        </div>
                        <div className="bg-white p-6">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                                Admin Attachments
                            </h2>
                            {jobRequest.adminAttachments && jobRequest.adminAttachments.length > 0 ? (
                                <table className="w-full min-w-[300px] border-collapse rounded-lg overflow-hidden text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-800">
                                                File Name
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-800">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobRequest.adminAttachments.map((url, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
                                                <td className="px-4 py-3 border-t border-gray-200 break-words">
                                                    {getFileNameFromUrl(url)}
                                                </td>
                                                <td className="px-4 py-3 border-t border-gray-200">
                                                    <a
                                                        href={url}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-900 hover:text-blue-700 flex items-center gap-2"
                                                    >
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
                )}

                {/* Back Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-[rgb(0,0,122)] text-white px-6 py-2 rounded-md shadow hover:bg-[rgb(0,0,100)] transition-all"
                    >
                        Back
                    </button>
                </div>
            </section>
        </>
    );
}

export default CustomerNewJobRequestDetails;
