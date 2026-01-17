/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { TiTick } from "react-icons/ti";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { Loader2, AlertTriangle } from "lucide-react";
import { getJobRequestById } from "@/api/jobRequests.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";

interface JobSpecificationProps {
  onNextClick: () => void;
}

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
  adminAttachments?: string[];
  createdAt: string;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getFileNameFromUrl = (url: string): string => {
  try {
    const decodedUrl = decodeURIComponent(url);
    return decodedUrl.split("/").pop() || "download";
  } catch (error) {
    console.error("Error decoding URL:", error);
    return "download";
  }
};

const FileList = ({ files, title }: { files: string[]; title: string }) => {
  if (!files || files.length === 0) {
    return (
      <div>
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 lg:hidden">{title}</h3>
        <p className="text-gray-500 text-sm">No files attached.</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 lg:hidden">{title}</h3>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-sm font-semibold text-gray-800">File Name</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-sm font-semibold text-gray-800">Attachment</th>
            </tr>
          </thead>
          <tbody>
            {files.map((fileUrl, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
                <td className="px-4 lg:px-6 py-3 lg:py-4 border-t border-gray-200 text-sm">
                  <span className="block truncate max-w-xs lg:max-w-md" title={getFileNameFromUrl(fileUrl)}>
                    {getFileNameFromUrl(fileUrl)}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-3 lg:py-4 border-t border-gray-200">
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-blue-700 flex items-center gap-2 transition-colors text-sm">
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
              <span className="text-sm font-medium text-gray-800 truncate pr-2" title={getFileNameFromUrl(fileUrl)}>
                {getFileNameFromUrl(fileUrl)}
              </span>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-blue-700 flex items-center gap-1 transition-colors text-sm flex-shrink-0">
                <ArrowDownTrayIcon className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};


function JobSpecification({ onNextClick }: JobSpecificationProps) {
  const { id } = useParams<{ id: string }>();
  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

  const [jobRequest, setJobRequest] = useState<JobRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobRequest = async () => {
      if (!id) {
        setError("Job ID not found in URL.");
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
          const errorMessage = response.message || "Failed to fetch job specification.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        console.error("Error fetching job specification:", err);
        const errorMessage = "An unexpected error occurred.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobRequest();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading Specification...</span>
      </div>
    );
  }

  if (error || !jobRequest) {
    return (
      <div className="container mx-auto p-6 mt-10">
        <div className="bg-red-50 border border-red-200 p-8 rounded-lg text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-red-800">Could not load specification</h2>
          <p className="mt-2 text-red-600">{error || "The requested job could not be found."}</p>
        </div>
      </div>
    );
  }

  const jobDetails = [
    { label: "Profession", value: jobRequest.skill },
    ...(jobRequest.level ? [{ label: "Level", value: jobRequest.level }] : []),
    { label: "Location", value: jobRequest.location },
    { label: "Start Date", value: formatDate(jobRequest.startDate) },
    { label: "End Date", value: formatDate(jobRequest.endDate) },
  ];

  return (
    <div className="container mx-auto p-3 md:p-6 bg-white shadow-lg rounded-lg border border-gray-200 lg:px-8 py-4 md:py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 bg-gray-50 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{jobRequest.jobId}</h1>
        <h2 className="text-xs md:text-sm font-medium text-gray-600 bg-white px-3 md:px-4 py-1 md:py-2 rounded-full shadow-sm w-fit">
          Created: {formatDate(jobRequest.createdAt)}
        </h2>
      </div>

      {/* Job Detail Section */}
      <div className="p-4 md:p-8 my-4 md:my-6 rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-gray-200">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Job Details</h2>
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-8">
          <div className="w-full lg:w-1/2 space-y-3 md:space-y-4">
            {jobDetails.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1 sm:space-y-0">
                <span className="font-semibold text-gray-800 sm:w-24 text-sm md:text-base">{item.label}:</span>
                <span className="text-gray-700 text-sm md:text-base break-words">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-1/2 lg:pl-8 lg:border-l border-gray-200 space-y-4 mt-6 lg:mt-0">
            {jobRequest?.payments.length > 0 && (<div className="flex items-center space-x-2 bg-gray-100 p-3 md:p-4 rounded-lg cursor-not-allowed border border-gray-200 opacity-60" onClick={() => navigate(`/receipts/${jobRequest.payments[jobRequest.payments.length - 1].id}`)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3m0-6V4m-6 4l3 3 3-3" />
              </svg>
              <span className="text-gray-600 font-medium text-sm md:text-base">Download Receipt</span>
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

                // FUNDI
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
                return null;
              })()}
            </div>

          </div>
        </div>

        <br className="my-4 md:my-6 border-gray-200" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 bg-white p-4 md:p-8 shadow-lg rounded-xl border border-gray-200">
          <div className="lg:col-span-2 lg:pr-6 lg:border-r border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Customer notes</h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">{jobRequest.customerNotes || "No customer notes provided."}</p>
          </div>
          <div className="lg:col-span-2 mt-6 lg:mt-0">
            <FileList files={jobRequest.attachments} title="Customer Files" />
          </div>
        </div>

        <br className="my-4 md:my-6 border-gray-200" />

        {(jobRequest.adminNotes || (jobRequest.adminAttachments && jobRequest.adminAttachments.length > 0)) && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 bg-white p-4 md:p-8 shadow-lg rounded-xl border border-gray-200">
            <div className="lg:col-span-2 lg:pr-6 lg:border-r border-gray-200">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Admin Notes</h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">{jobRequest.adminNotes || "No admin notes provided."}</p>

            </div>
            <div className="lg:col-span-2 mt-6 lg:mt-0">
              <FileList files={jobRequest.adminAttachments || []} title="Admin Files" />
            </div>
          </div>
        )}

        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:justify-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={onNextClick}
            style={{ backgroundColor: "rgb(0, 0, 122)" }}
            className="w-full sm:w-auto hover:bg-blue-900 text-white font-semibold py-3 sm:py-2 px-6 rounded-lg text-sm md:text-base transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobSpecification;