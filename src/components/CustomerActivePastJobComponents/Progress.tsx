/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
//@ts-nocheck
import { useState, useEffect } from "react";
import { Stepper, Step } from "react-form-stepper";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import { getJobRequestById, approveJobCompletion } from "@/api/jobRequests.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"

const TrackProgress = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>();
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirming, setConfirming] = useState(false);
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

    const stepsContent = [
        {
            title: "Mobilization",
            heading: "Job Mobilization",
            description: "Fundi has been assigned and is preparing to start.",
            tag: null
        },
        {
            title: "In Progress",
            heading: "Job In Progress",
            description: "The work is currently ongoing.",
            tag: (
                <div className="mt-3 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Ongoing
                </div>
            )
        },
        {
            title: "Completed",
            heading: "Job Completed",
            description: "The job has been successfully completed and is pending review.",
            tag: (
                <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✅ Completed
                </div>
            )
        }
    ];

    useEffect(() => {
        const fetchInitialStatus = async () => {
            if (!id) {
                setError("Job ID not found in URL.");
                setIsLoading(false);
                return;
            }
            try {
                const job = await getJobRequestById(axiosInstance, id);
                //@ts-ignore
                if (job && job.data) {
                    //@ts-ignore
                    setCurrentStep(
                        job.data.stage === "MOBILIZATION"
                            ? 0
                            : job.data.stage === "INPROGRESS" && !job.data.completed
                                ? 1
                                : 2
                    );
                } else {
                    throw new Error("Invalid job data received.");
                }
            } catch (err) {
                setError("Could not fetch job status.");
                console.error("Error fetching job status:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialStatus();
    }, [id]);

    const handleConfirmCompletion = async () => {
        if (!id) return;
        try {
            setConfirming(true);
            await approveJobCompletion(axiosInstance, id);
            toast.success("Job Confirmed Complete")
            navigate("/dashboard/customer")
        } catch (err) {
            console.error("Error confirming job completion:", err);
            toast.error("Error Marking Job As Complete")
        } finally {
            setConfirming(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Job Progress Tracker
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Monitor your job's milestones in real-time.
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
                        {stepsContent[currentStep].heading}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {stepsContent[currentStep].description}
                    </p>
                    {stepsContent[currentStep].tag}

                    {/* Confirm button only for Completed step */}
                    {currentStep === 2 && (
                        <button
                            onClick={handleConfirmCompletion}
                            disabled={confirming}
                            className="mt-6 mx-2 px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:opacity-50"
                        >
                            {confirming ? "Confirming..." : "Confirm Job Completed"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackProgress;
