/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlinePaperClip } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { FaTrash, FaFileAlt } from "react-icons/fa";
import { createBid } from "@/api/bidRequests.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import { uploadFile } from "@/utils/fileUpload";

interface ContractorSubmissionProps {
  response: any;
}

const ContractorSubmission = ({ response }: ContractorSubmissionProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileName, setFileName] = useState("");
  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
  const [isChecked, setIsChecked] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("workPlans");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [previewData, setPreviewData] = useState({
    workPlans: [],
    professionalFees: [],
    milestones: [],
    paymentSummary: {},
    notes: "",
  });

  const navigate = useNavigate();
  const { id: jobRequestId } = useParams<{ id: string }>();

  useEffect(() => {
    if (response) {
      if (response.stage !== "BID_INVITED") {
        setIsReadOnly(true);
        const bidData = response.userBid;

        if (bidData) {
          setNotes(bidData.notes || "");
          const attachments =
            bidData.attachments?.map((url: string) => ({
              name: url.split("/").pop() || "attachment",
            })) || [];
          setFiles(attachments);

          setPreviewData({
            workPlans: bidData.workPlans || [],
            professionalFees: bidData.professionalFees || [],
            milestones: bidData.milestones || [],
            paymentSummary: {
              professionalFeeSubtotal: bidData.professionalFeeSubtotal || 0,
              expensesSubtotal: bidData.expensesSubtotal || 0,
              jagedoCommission: bidData.jagedoCommission || 0,
              payableToServiceProvider: bidData.payableToServiceProvider || 0,
              totalAmount: bidData.totalAmount || 0,
            },
            notes: bidData.notes || "",
          });
        }
      } else {
        setIsReadOnly(false);
        const savedNotes = localStorage.getItem("bidNotes") || "";
        setNotes(savedNotes);
      }
    }
  }, [response]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isReadOnly) return;
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem("bidNotes", newNotes);
  };

  useEffect(() => {
    if (showPreview && !isReadOnly) {
      const professionalFeesWithWorkPlans = JSON.parse(localStorage.getItem("professionalFeesWithWorkPlans") || "[]");
      const milestones = JSON.parse(localStorage.getItem("milestones") || "[]");
      const paymentSummary = JSON.parse(localStorage.getItem("paymentSummary") || "{}");
      const notes = localStorage.getItem("bidNotes") || "";

      setPreviewData({
        workPlans: professionalFeesWithWorkPlans,
        professionalFees: professionalFeesWithWorkPlans,
        milestones,
        paymentSummary,
        notes,
      });
    }
  }, [showPreview, isReadOnly]);

  const handleClick = async () => {
    if (!isChecked || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const uploadedFileObjects = await Promise.all(files.map((file) => uploadFile(file)));
      const attachmentUrls = uploadedFileObjects.map((uploadedFile) => uploadedFile.url);
      const professionalFeesData = JSON.parse(localStorage.getItem("professionalFeesWithWorkPlans") || "[]");
      const milestonesData = JSON.parse(localStorage.getItem("milestones") || "[]");
      const paymentSummary = JSON.parse(localStorage.getItem("paymentSummary") || "{}");
      const bidNotes = localStorage.getItem("bidNotes") || "";

      const payload = {
        jobRequestId: parseInt(jobRequestId || "0", 10),
        status: "Submitted",
        notes: bidNotes,
        workPlans: professionalFeesData,
        milestones: milestonesData,
        attachments: attachmentUrls,
        jagedoCommission: paymentSummary.jagedoCommission,
        payableToServiceProvider: paymentSummary.payableToServiceProvider,
        totalAmount: paymentSummary.totalAmount,
        expensesSubtotal: paymentSummary.expensesSubtotal,
        professionalFeeSubtotal: paymentSummary.professionalFeeSubtotal,
      };

      await createBid(axiosInstance, payload);
      toast.success("Quote submitted successfully!");

      localStorage.removeItem("workPlans");
      localStorage.removeItem("milestones");
      localStorage.removeItem("paymentSummary");
      localStorage.removeItem("professionalFeesWithWorkPlans");
      localStorage.removeItem("bidNotes");

      navigate("/dashboard/contractor?tab=bid");
    } catch (error: any) {
      toast.error(`Failed to submit quote: ${error.message || "Please check your data and try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const tabs = [
    { key: "workPlans", name: "Work Plans" },
    { key: "fees", name: "Contractor Fees" },
    { key: "milestones", name: "Milestones" },
    { key: "summary", name: "Payment Summary" },
    { key: "notes", name: "Notes" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0);
  };

  return (
    <>
      <div className="container mx-auto p-6 bg-white shadow-lg mb-6 rounded-lg border border-gray-200 lg:px-8 py-8 relative">
        {isReadOnly && (
          <div className="p-3 mb-4 rounded text-center text-yellow-800 bg-yellow-100 border border-yellow-300">
            This section is view-only because a bid has already been submitted or awarded.
          </div>
        )}
        <div className="bg-white rounded-lg p-4 border border-gray-200 my-5">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Attachments</h2>
            <div className="flex items-center border border-gray-300 rounded-lg px-2 py-2 bg-gray-100 gap-2">
              <input
                type="text"
                placeholder="Enter a descriptive file name (optional)"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-blue-300 bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                disabled={isReadOnly}
              />
              <label className={`cursor-pointer flex items-center ${isReadOnly ? "cursor-not-allowed" : ""}`}>
                <AiOutlinePaperClip className="text-gray-700 text-2xl" />
                <input type="file" className="hidden" onChange={handleFileUpload} multiple disabled={isReadOnly} />
              </label>
            </div>
            <div className="min-h-60 bg-gray-100 px-4 py-6 rounded-md flex items-center justify-center">
              {files.length === 0 ? (
                <div className="text-center text-gray-500">
                  <FaFileAlt className="text-4xl mb-2 mx-auto" />
                  <p>No files uploaded</p>
                </div>
              ) : (
                <div className="w-full">
                  <h3 className="text-gray-800 font-semibold mb-1">Uploaded Files:</h3>
                  <ul className="bg-gray-100 p-2 rounded-md space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                        <span className="text-gray-700 truncate pr-2">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                          disabled={isReadOnly}
                        >
                          <FaTrash />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Additional Notes</h2>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Provide any additional details or comments about your bid here..."
              disabled={isReadOnly}
            />
          </div>

          {!isReadOnly && (
            <div className="mt-8 flex flex-col items-center bg-white p-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} className="w-5 h-5 rounded border-gray-300 text-blue-900 focus:ring-blue-900" />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  I agree to the{" "}
                  <a href="https://jagedo.s3.us-east-1.amazonaws.com/legal/Jagedo%20Terms%20of%20Service.pdf" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-800 hover:text-blue-900 hover:no-underline transition-colors duration-200">
                    Contractor Agreement
                  </a>
                </span>
              </label>
              <p className="text-sm text-gray-600 mt-4 mb-6 text-center max-w-md">
                Failure to adhere to the Contractor agreement and stipulated timelines will lead to
                <span className="font-semibold text-red-600"> account suspension</span>.
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="w-40 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 py-3 rounded-lg font-medium transition-all duration-300 border border-gray-300"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={handleClick}
                  className={`w-48 bg-blue-900 text-white py-3 rounded-lg font-medium transition-all duration-300 ${!isChecked || isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800 hover:shadow-lg active:scale-95"}`}
                  disabled={!isChecked || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Quote"}
                </button>
              </div>
            </div>
          )}
        </div>

        {showPreview && (
          <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">{isReadOnly ? "Submission Details" : "Preview Submission"}</h2>
                <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-red-600 text-2xl font-bold">×</button>
              </div>
              <div className="border-b border-gray-200 px-4">
                <nav className="flex space-x-4 overflow-x-auto -mb-px">
                  {tabs.map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-3 py-3 whitespace-nowrap text-sm font-medium border-b-2 ${activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-blue-600 hover:border-gray-300"}`}>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-6 overflow-y-auto bg-gray-50/50 flex-1">
                {activeTab === 'workPlans' && (
                  <div className="space-y-4">
                    {previewData.workPlans?.length > 0 ? previewData.workPlans.map((plan, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border">
                        <h3 className="font-bold text-gray-800 mb-2">{plan.billName}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Duration:</strong> {plan.duration} days</p>
                          <p><strong>Start Date:</strong> {new Date(plan.startDate).toLocaleDateString('en-GB')}</p>
                          <p><strong>End Date:</strong> {new Date(plan.endDate).toLocaleDateString('en-GB')}</p>
                        </div>
                        <h4 className="font-semibold text-gray-700 mt-3 mb-1">Items:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          {plan.items?.map((item, itemIndex) => (
                            <li key={itemIndex}>{item.description}</li>
                          ))}
                        </ul>
                      </div>
                    )) : <p className="text-gray-500">No work plans available.</p>}
                  </div>
                )}
                {activeTab === 'fees' && (
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {previewData.professionalFees?.length > 0 ? (
                        previewData.professionalFees.map((plan, planIndex) => (
                          <React.Fragment key={planIndex}>
                            <tr>
                              <td colSpan="4" className="px-6 py-3 bg-gray-100 font-bold text-gray-700">
                                {plan.billName}
                              </td>
                            </tr>
                            {plan.items?.map((item, itemIndex) => (
                              <tr key={`${planIndex}-${itemIndex}`}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(item.unitRate)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(item.amount)}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-gray-500">
                            No contractor fees available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
                {activeTab === 'milestones' && (
                  <div className="space-y-4">
                    {previewData.milestones?.length > 0 ? previewData.milestones.map((milestone, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border">
                        <h3 className="font-bold text-gray-800">{milestone.name}</h3>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                        <p className="text-sm text-black pt-2">Kes {milestone.amount}</p>
                      </div>
                    )) : <p className="text-gray-500">No milestones available.</p>}
                  </div>
                )}
                {activeTab === 'summary' && (
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Contractor Fees Subtotal:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(previewData.paymentSummary.professionalFeeSubtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Expenses Subtotal:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(previewData.paymentSummary.expensesSubtotal)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-gray-800">Total Quote Amount:</span>
                        <span className="font-bold text-blue-900">{formatCurrency(previewData.paymentSummary.totalAmount)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Jagedo Commission:</span>
                        <span className="font-medium text-gray-700">{formatCurrency(previewData.paymentSummary.jagedoCommission)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Payable to you:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(previewData.paymentSummary.payableToServiceProvider)}</span>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'notes' && (
                  <div className="p-4 bg-white rounded-lg border">
                    <p className="text-gray-700 whitespace-pre-wrap">{previewData.notes || "No additional notes provided."}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContractorSubmission;