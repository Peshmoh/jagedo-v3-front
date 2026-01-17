/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { Stepper, Step } from "react-form-stepper";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import { getJobRequestById } from "@/api/jobRequests.api";
import { updateBidMilestoneProgress } from "@/api/bidRequests.api";

interface Milestone {
    id: number;
    name: string;
    progress: number;
    complete: boolean;
    sequence: number;
}

interface AssignedBid {
    id: number;
    milestones: Milestone[];
}

interface JobRequest {
    id: number;
    skill: string;
    assignedBid: AssignedBid;
}

const progressToStep = (milestone: Milestone | null) => {
    if (!milestone) return 0;
    if (milestone.progress >= 100) return 2;
    if (milestone.progress > 0) return 1;
    return 0;
};

const ProgressComponent = () => {
    const { id, milestoneId } = useParams<{ id: string; milestoneId: string }>();
    const [jobRequestData, setJobRequestData] = useState<JobRequest | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
    const stepsContent = [
        {
            title: "Not Started",
            heading: "Milestone Not Started",
            description: "This milestone is ready to begin.",
            buttonText: "Start Milestone",
            tag: null,
        },
        {
            title: "In Progress",
            heading: "Milestone In Progress",
            description: "The work for this milestone is currently ongoing.",
            buttonText: "Complete Milestone",
            tag: (
                <div className="mt-3 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Ongoing
                </div>
            ),
        },
        {
            title: "Completed",
            heading: "Milestone Completed",
            description: "This milestone has been successfully completed.",
            buttonText: null,
            tag: (
                <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✅ Completed
                </div>
            ),
        },
    ];

    const fetchJobStatus = useCallback(async () => {
        if (!id || !milestoneId) {
            toast.error("Job ID or Milestone ID not found in URL.");
            setIsLoading(false);
            return;
        }
        try {
            const response = await getJobRequestById(axiosInstance, id);
            const jobData: JobRequest = response.data;
            setJobRequestData(jobData);

            const milestones = jobData.assignedBid?.milestones;
            if (!milestones || milestones.length === 0) {
                toast.error("No milestones found for this job.");
                setIsLoading(false);
                return;
            }

            const milestoneFromUrl = milestones.find(m => m.id === Number(milestoneId));

            if (milestoneFromUrl) {
                setActiveMilestone(milestoneFromUrl);
                setCurrentStep(progressToStep(milestoneFromUrl));
            } else {
                toast.error(`Milestone with ID ${milestoneId} not found.`);
            }

        } catch (error) {
            toast.error("Could not fetch job status.");
            console.error("Error fetching job status:", error);
        } finally {
            setIsLoading(false);
        }
    }, [id, milestoneId]);


    useEffect(() => {
        fetchJobStatus();
    }, [fetchJobStatus]);

    const handleButtonClick = async () => {
        if (!activeMilestone?.id || !jobRequestData?.assignedBid?.id) {
            return toast.error("Active milestone or bid information not found.");
        }

        setIsSubmitting(true);
        try {
            let progressValue = 0;
            let successMessage = "";

            if (currentStep === 0) {
                progressValue = 50;
                successMessage = "Milestone started!";
            } else if (currentStep === 1) {
                progressValue = 100;
                successMessage = "Milestone marked as complete!";
            }

            if (progressValue > 0) {
                await updateBidMilestoneProgress(
                    axiosInstance,
                    activeMilestone.id,
                    progressValue
                );
                toast.success(successMessage);
                await fetchJobStatus();
            }
        } catch (error: unknown) {
            console.error("Error updating milestone progress:", error);
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "An unexpected error occurred.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    if (!activeMilestone) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-red-500">Milestone could not be loaded.</p>
            </div>
        );
    }

    const displayHeading = activeMilestone.name || stepsContent[currentStep].heading;
    const displayDescription = stepsContent[currentStep].description;

    return (
        <>
            <DashboardHeader />
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                    <div className="mb-12 text-center">
                        {jobRequestData && (
                            <p className="text-lg font-medium text-gray-500 mb-2">
                                Job: {jobRequestData.skill} ({jobRequestData.id})
                            </p>
                        )}
                        <h2 className="text-3xl font-bold text-gray-800">
                            Milestone Progress Tracker
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Update and monitor the progress of each job milestone.
                        </p>
                    </div>

                    <div className="mb-12">
                        <Stepper activeStep={currentStep}>
                            {stepsContent.map((step) => (
                                <Step key={step.title} label={step.title} />
                            ))}
                        </Stepper>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-center">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                            {displayHeading}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {displayDescription}
                        </p>
                        {stepsContent[currentStep].tag}
                    </div>

                    <div className="text-center mt-10">
                        {currentStep < stepsContent.length - 1 && (
                            <button
                                onClick={handleButtonClick}
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center mx-auto gap-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {isSubmitting
                                    ? "Submitting..."
                                    : stepsContent[currentStep].buttonText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProgressComponent;