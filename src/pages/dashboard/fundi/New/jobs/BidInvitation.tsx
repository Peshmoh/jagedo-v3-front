/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { TiTick } from "react-icons/ti";
import { toast } from "react-hot-toast";
import { useGlobalContext } from "@/context/GlobalProvider";
import { acceptAssignment } from "@/api/jobRequests.api";
import { DashboardHeader } from "@/components/DashboardHeader";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import { getJobRequestById } from "@/api/jobRequests.api";

// Interface defining the expected data structure for a job request
interface JobRequest {
  id: number;
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
  adminAttachments: string[];
}

// --- Reusable Component for displaying a list of attachments ---
const AttachmentList = ({ title, attachments }: { title: string; attachments: string[] }) => {
  const getFileNameFromUrl = (url: string) => {
    try {
      return decodeURIComponent(new URL(url).pathname.split('/').pop() || "attachment");
    } catch (error: any) {
      console.log("error: ", error)
      return url.split('/').pop() || "attachment";
    }
  };

  if (!attachments || attachments.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-500 italic">No attachments provided.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <tbody>
          {attachments.map((url, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
              <td className="px-1 py-3 border-t border-gray-200 truncate max-w-[200px]" title={getFileNameFromUrl(url)}>{getFileNameFromUrl(url)}</td>
              <td className="px-1 py-3 border-t border-gray-200 text-right whitespace-nowrap">
                <a href={url} download target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-blue-700 flex items-center justify-end gap-2 transition-colors">
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


function JobRequestDetails() {
  const { id } = useParams<{ id: string }>();
  const [jobRequest, setJobRequest] = useState<JobRequest | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false); // State for loading during API call
  const navigate = useNavigate();
  const { user } = useGlobalContext();

  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

  useEffect(() => {
    const fetchJobRequest = async () => {
      if (id) {
        try {
          const response = await getJobRequestById(axiosInstance, id);
          if (response.success) {
            setJobRequest(response.data);
          } else {
            console.error("Failed to fetch job request:", response.message);
            toast.error("Could not load job details.");
          }
        } catch (error) {
          console.error("Error fetching job request:", error);
          toast.error("An error occurred while fetching job details.");
        }
      }
    };
    fetchJobRequest();
  }, [id]);


  // Handler for the "Accept Job" button
  const handleAccept = async () => {
    if (!id) {
      toast.error("Job ID is missing.");
      return;
    }

    setIsAccepting(true);

    try {
      const response = await acceptAssignment(axiosInstance, id, user.id);

      if (response.success) {
        toast.success("Job accepted successfully! Redirecting...");
        setTimeout(() => {
          navigate('/dashboard/fundi', { state: { activeTab: 'active' } });
        }, 1500);
      } else {
        toast.error(response.message || "Failed to accept the job.");
      }

    } catch (error: any) {
      console.error("Error accepting job assignment:", error);
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsAccepting(false);
    }
  };


  if (!jobRequest) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-10 w-10 text-[rgb(0,0,122)]" />
      </div>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
      <section className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg border border-gray-200 my-10">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{jobRequest.jobId}</h1>
          <span className="text-xs font-semibold bg-[rgb(0,0,122)] text-white px-3 py-1 rounded-full shadow-sm uppercase">
            {jobRequest.stage}
          </span>
          <h2 className="hidden sm:block text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            Created: {formatDate(jobRequest.createdAt)}
          </h2>
        </div>

        {/* Job Detail Section */}
        <div className="p-6 sm:p-8 my-6 rounded-xl shadow-lg bg-white border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Job Details</h2>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="w-full md:w-1/2 space-y-4">
              {[
                { label: "Skill", value: jobRequest.skill },
                { label: "Location", value: jobRequest.location },
                { label: "Start Date", value: formatDate(jobRequest.startDate) },
                { label: "End Date", value: formatDate(jobRequest.endDate) },
              ].map((item, index) => (
                <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="font-semibold text-gray-800 w-28">{item.label}:</span>
                  <span className="text-gray-700">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="w-full md:w-1/2 md:pl-8 md:border-l border-gray-200 space-y-4">
              {jobRequest.payments.length > 0 && (
                <a href="#" download className="flex items-center space-x-2 bg-green-50 p-4 rounded-lg hover:bg-green-100 transition border border-gray-200" onClick={() => navigate(`/receipts/${jobRequest.payments[jobRequest.payments.length - 1].id}`)}>
                  <ArrowDownTrayIcon className="h-6 w-6 text-green-600" />
                  <span className="text-green-700 font-medium">Download Receipt</span>
                </a>
              )}
              <div className="bg-blue-50 p-4 rounded-2xl shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-blue-900">
                  Managed by {jobRequest.managedBy}
                </h3>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl shadow-md mt-4 border border-gray-200">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Package Details</h3>
                {(() => {
                  if (!jobRequest) return null;

                  // Helper to check if managed by Jagedo or self
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

                  // Default fallback
                  return null;
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Description & Customer Attachments Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 sm:p-8 shadow-lg rounded-xl border border-gray-200 my-6">
          <div className="md:pr-6 md:border-r border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Job Description</h2>
            <p className="text-gray-600 leading-relaxed">{jobRequest.description}</p>
          </div>
          <div>
            <AttachmentList title="" attachments={jobRequest.attachments} />
          </div>
        </div>

        {/* Admin Attachments Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 sm:p-8 shadow-lg rounded-xl border border-gray-200 my-6">
          <div className="md:pr-6 md:border-r border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Notes</h2>
            <p className="text-gray-600 leading-relaxed">{jobRequest.adminNotes}</p>
          </div>
          <div>
            <AttachmentList title="" attachments={jobRequest.adminAttachments} />
          </div>
        </div>

        {/* Agreement and Action Section */}
        <div className="text-center mt-8">
          <div className="flex justify-center items-center mb-4">
            <input type="checkbox" id="agreement" className="h-4 w-4" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
            <label htmlFor="agreement" className="ml-2 underline font-semibold hover:text-[rgb(0,0,122)] cursor-pointer" onClick={() => window.open("https://jagedo.s3.us-east-1.amazonaws.com/legal/JaGedo%20Fundi%20Agreement.pdf", "_blank")}>
              I agree to the Fundi Agreement
            </label>
          </div>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-4">
            Failure to adhere to the Fundi Agreement and stipulated timelines will lead to account suspension.
          </p>
          <button
            type="button"
            onClick={handleAccept}
            className={`px-8 py-3 font-semibold rounded-md transition-transform transform hover:scale-105 ${(isChecked && !isAccepting)
              ? "bg-[rgb(0,0,122)] text-white hover:bg-blue-900"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            disabled={!isChecked || isAccepting}
          >
            {isAccepting ? "Accepting..." : "Accept Job"}
          </button>
        </div>
      </section>
    </>
  );
}

export default JobRequestDetails;