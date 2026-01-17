/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useNavigate } from "react-router-dom";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { TiTick } from "react-icons/ti";
import { DashboardHeader } from "@/components/DashboardHeader";

function DraftJobProffRequestDetails() {
    const navigate = useNavigate();

    const files = [
        { name: "Document 1.pdf", url: "#" },
        { name: "Image 2.jpg", url: "#" },
    ];

    const handleCompleteRequest = () => {
        navigate(-1);
    };

    return (
        <>
            <DashboardHeader />
            <section className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg relative border border-gray-200">
                {/* Header Section */}
                <div className="mt-10 sm:mt-24 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 gap-4 sm:gap-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">REQ 264</h1>
                    <h2 className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm self-start sm:self-auto">
                        Created: 12/05/2025
                    </h2>
                </div>

                {/* Job Detail Section */}
                <div className="p-4 sm:p-8 my-6 rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Job Details</h2>

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Left Column */}
                        <div className="w-full lg:w-1/2 space-y-4">
                            {[
                                { label: "Contractor", value: "Contractor" },
                                { label: "Class", value: "6" },
                                { label: "Location", value: "Kenya, Nairobi, Kasarani" },
                                { label: "Start Date", value: "20/11/2023" },
                                { label: "End Date", value: "12/12/2024" },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row sm:items-center bg-gray-50 p-3 rounded-lg border border-gray-200 gap-1 sm:gap-0"
                                >
                                    <span className="font-semibold text-gray-800 sm:w-24 text-sm sm:text-base">
                                        {item.label}:
                                    </span>
                                    <span className="text-gray-700 text-sm sm:text-base break-words">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Right Column */}
                        <div className="w-full lg:w-1/2 lg:pl-8 lg:border-l border-gray-200 space-y-4">
                            {/* Download Receipt Section (greyed out) */}
                            {job.payments.length > 0 && (<div className="flex items-center space-x-2 bg-green-100 p-4 rounded-lg cursor-not-allowed hover:bg-green-200 transition border border-green-300" onClick={() => navigate(`/receipts/${job.payments[job?.payments?.length - 1].id}`)}>
                                {/* Download Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3m0-6V4m-6 4l3 3 3-3"
                                    />
                                </svg>
                                <span className="text-gray-600 font-medium text-sm sm:text-base">
                                    Download Receipt
                                </span>
                            </div>)}

                            {/* Managed by Jagedo Section */}
                            <div className="bg-blue-50 p-4 rounded-2xl shadow-md border border-gray-200">
                                <h3 className="text-lg sm:text-2xl font-bold text-blue-900">
                                    Managed by Jagedo
                                </h3>
                            </div>

                            {/* Package Details Section */}
                            <div className="bg-blue-50 p-4 rounded-2xl shadow-md mt-4 border border-gray-200">
                                <h3 className="text-lg sm:text-2xl font-bold text-blue-900 mb-2">
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
                        </div>
                    </div>
                </div>

                {/* Job description */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white p-4 sm:p-8 shadow-lg rounded-xl border border-gray-200">
                    {/* Job Description */}
                    <div className="lg:col-span-2 lg:pr-6 lg:border-r border-gray-200 mb-6 lg:mb-0">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                            Job Description
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                            Reprehenderit minus molestiae libero et aut accusamus consequuntur.
                        </p>
                    </div>

                    {/* Files Table */}
                    <div className="lg:col-span-2">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse rounded-lg overflow-hidden min-w-[300px]">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800">
                                            File Name
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800">
                                            Attachment
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((file, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 text-xs sm:text-sm break-words">
                                                {file.name}
                                            </td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                                                <a
                                                    href={file.url}
                                                    download
                                                    className="text-blue-900 hover:text-blue-700 flex items-center gap-1 sm:gap-2 transition-colors text-xs sm:text-sm"
                                                >
                                                    <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">Download</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white p-4 sm:p-8 shadow-lg rounded-xl border border-gray-200">
                    <div className="lg:col-span-2 lg:pr-6 lg:border-r border-gray-200 mb-6 lg:mb-0">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Admin Notes</h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                            Reprehenderit minus molestiae libero et aut accusamus consequuntur.
                        </p>
                    </div>

                    {/* Files Table */}
                    <div className="lg:col-span-2">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse rounded-lg overflow-hidden min-w-[300px]">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800">
                                            File Name
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-800">
                                            Attachment
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((file, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 text-xs sm:text-sm break-words">
                                                {file.name}
                                            </td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                                                <a
                                                    href={file.url}
                                                    download
                                                    className="text-blue-900 hover:text-blue-700 flex items-center gap-1 sm:gap-2 transition-colors text-xs sm:text-sm"
                                                >
                                                    <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">Download</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Complete Request Button */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleCompleteRequest}
                        className="bg-[rgb(0,0,122)] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-blue-700 transition text-sm sm:text-base"
                    >
                        Back
                    </button>
                </div>
            </section>
        </>
    );
}

export default DraftJobProffRequestDetails;