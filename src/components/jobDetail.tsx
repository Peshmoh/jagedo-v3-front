/* eslint-disable @typescript-eslint/no-explicit-any */
//@ts-nocheck
import { ArrowLeft, Edit, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiTick } from "react-icons/ti";


// The JobDetailProps interface you provided
interface JobDetailProps {
    job: {
        id: number;
        jobId: string;
        jobType: string;
        skill: string;
        description: string;
        location: string;
        createdAt: string;
        startDate: string;
        endDate: string | null;
        status: string;
        stage: string;
        managedBy: string;
        attachments: string[];
        bids: any[];
        assignedServiceProviders: any[];
        assignedServiceProvider: any | null;
    };
    onBack?: () => void;
    onEdit?: () => void;
}

export function JobDetail({ job, onBack, onEdit }: JobDetailProps) {

    // Helper function to extract filename from a URL
    const getFileNameFromUrl = (url: string) => {
        try {
            return url.split('/').pop() || "attachment";
        } catch {
            return "attachment";
        }
    };

    return (
        <section className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            {/* --- DYNAMIC HEADER AND CONTROLS --- */}
            <div className="flex justify-between items-center mb-6">
                <Button variant="ghost" onClick={onBack} className="flex items-center text-gray-700 hover:text-blue-900">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Jobs
                </Button>
                {onEdit && (
                    <Button variant="outline" onClick={onEdit} className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Job
                    </Button>
                )}
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                        {/* DYNAMIC: Job ID */}
                        {job.jobId}
                    </h1>
                    <Badge className="text-xs font-semibold bg-[rgb(0,0,122)] text-white px-4 py-[6px] rounded-full shadow-sm flex items-center justify-center capitalize">
                        {/* DYNAMIC: Job Status */}
                        {job.status.replace("_", " ")}
                    </Badge>
                </div>
                <h2 className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
                    {/* DYNAMIC: Job Start Date */}
                    Created: {new Date(job.createdAt).toLocaleDateString('en-GB')}
                </h2>
            </div>

            {/* Job Details */}
            <div className="p-4 sm:p-8 my-6 rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                    Job Details
                </h2>
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Left Column */}
                    <div className="md:w-1/2 space-y-4">
                        {/* DYNAMIC: Job Details Array */}
                        {[
                            { label: "Skill", value: job.skill },
                            { label: "Level", value: job.assignedServiceProvider.grade || job.assignedServiceProvider.level || "N/A" },
                            { label: "Job Type", value: job.jobType },
                            { label: "Location", value: job.location },
                            { label: "Start Date", value: new Date(job.startDate).toLocaleDateString('en-GB') },
                            { label: "End Date", value: job.endDate ? new Date(job.endDate).toLocaleDateString('en-GB') : 'N/A' },
                        ].map((item, index) => (
                            <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <span className="font-semibold text-gray-800 w-28 text-sm">
                                    {item.label}:
                                </span>
                                <span className="text-gray-700 text-sm">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="md:w-1/2 space-y-4 md:pl-8 md:border-l border-gray-200">
                        {job.payments.length > 0 &&
                            (<a
                                href="#"
                                className={`flex items-center space-x-2 p-4 rounded-lg border transition-colors bg-green-50 border-green-200 text-green-700 hover:bg-green-100`}
                                onClick={() => navigate(`/receipts/${job.payments[job.payments.length - 1].id}`)}
                            >
                                <ArrowDownTrayIcon className="h-6 w-6" />
                                <span className="font-medium">
                                    Download Receipt
                                </span>
                            </a>)}

                        {/* DYNAMIC: Managed By section */}
                        {job.managedBy && (
                            <div className="bg-blue-50 p-4 rounded-2xl shadow-md border border-gray-200">
                                <h3 className="text-xl font-bold text-blue-900">
                                    Managed by {job.managedBy === 'JAGEDO' ? 'JaGedo' : 'Self'}
                                </h3>
                            </div>
                        )}

                        {/* DYNAMIC: Show package details only if managed by Jagedo */}
                        {job.managedBy === 'JAGEDO' && (
                            <div className="bg-blue-50 p-4 rounded-2xl shadow-md mt-4 border border-gray-200">
                                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">
                                    Package details
                                </h3>
                                {(() => {
                                    if (!job) return null;

                                    // Helper to check if managed by Jagedo or self
                                    const isManagedByJagedo =
                                        job.managedBy?.toLowerCase().includes("jagedo");

                                    // FUNDI
                                    if (job.jobType === "FUNDI") {
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
                                    if (job.jobType === "PROFESSIONAL") {
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
                                    if (job.jobType === "CONTRACTOR") {
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
                        )}
                    </div>
                </div>
            </div>

            {/* Description and Files */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 sm:p-8 shadow-lg rounded-xl border border-gray-200 my-6">
                <div className="border-b md:border-b-0 md:border-r border-gray-200 pr-0 md:pr-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                        Description
                    </h2>
                    {/* DYNAMIC: Job Description */}
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {job.description || "No description provided."}
                    </p>
                </div>

                {/* DYNAMIC: Files Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[300px] border-collapse rounded-lg overflow-hidden text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-3 text-left font-semibold text-gray-800">File Name</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-800">Attachment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {job.attachments && job.attachments.length > 0 ? (
                                job.attachments.map((fileUrl, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
                                        <td className="px-4 py-3 border-t border-gray-200 break-words">
                                            {getFileNameFromUrl(fileUrl)}
                                        </td>
                                        <td className="px-4 py-3 border-t border-gray-200">
                                            <a href={fileUrl} download target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-blue-700 flex items-center gap-2">
                                                <Download className="w-5 h-5" />
                                                Download
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="px-4 py-4 text-center text-gray-500 border-t border-gray-200">
                                        No attachments for this job.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}