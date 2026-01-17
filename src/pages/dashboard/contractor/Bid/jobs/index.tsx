//@ts-nocheck
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { getJobRequestById } from "@/api/jobRequests.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";

import ContractorSubmission from '@/components/ProffContractorBidsJobComponents/ContractorSubmission';
import BillSummary from '@/components/ProffContractorBidsJobComponents/ProffGrandSummary';
import ContractorFee from '@/components/ProffContractorBidsJobComponents/ProffContractor_fee';
import JobSpecification from '@/components/ProffContractorBidsJobComponents/Job_Specification';
import Milestones from '@/components/ProffContractorBidsJobComponents/Milestones';
import PaymentBreakdown from '@/components/ProffContractorBidsJobComponents/PaymentBreakdown';
import WorkPlan from '@/components/ProffContractorBidsJobComponents/ProffContWorkPlan';
import { DashboardHeader } from '@/components/DashboardHeader';
import Loader from '@/components/Loader';

// --- Main Container (Stateful) ---
function BidJobPageContainer() {
    const { id } = useParams<{ id: string }>();
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);

    const [activeTab, setActiveTab] = useState("Job Specification");

    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Job ID is missing from the URL.");
            setLoading(false);
            return;
        }

        const fetchJobData = async () => {
            try {
                setLoading(true);
                setError(null);
                const apiResponse = await getJobRequestById(axiosInstance, id);

                if (apiResponse.success && apiResponse.data) {
                    setResponse(apiResponse.data);
                } else {
                    throw new Error(apiResponse.message || "Failed to fetch job details.");
                }
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred.");
                console.error("Error fetching job data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobData();
    }, [id]);

    const tabs = [
        { name: "Job Specification", shortName: "Job Spec" },
        { name: "Work Plan", shortName: "Work Plan" },
        { name: "Contractor Fee", shortName: "Fee" },
        { name: "Milestones", shortName: "Milestones" },
        { name: "Bill Summary", shortName: "Summary" },
        { name: "Payment Breakdown", shortName: "Payment" },
        { name: "Submissions", shortName: "Submit" },
    ];

    const getActiveComponent = () => {
        const commonProps = {
            response: response
        };

        switch (activeTab) {
            case "Job Specification":
                return <JobSpecification {...commonProps} onNextClick={() => setActiveTab("Work Plan")} />;

            case "Work Plan":
                return <WorkPlan {...commonProps}
                    onPrevClick={() => setActiveTab("Job Specification")}
                    onNextClick={() => setActiveTab("Contractor Fee")}
                />;

            case "Contractor Fee":
                return <ContractorFee {...commonProps}
                    onPrevClick={() => setActiveTab("Work Plan")}
                    onNextClick={() => setActiveTab("Milestones")}
                />;

            case "Milestones":
                return <Milestones {...commonProps}
                    onPrevClick={() => setActiveTab("Contractor Fee")}
                    onNextClick={() => setActiveTab("Bill Summary")}
                />;

            case "Bill Summary":
                return <BillSummary {...commonProps}
                    onPrevClick={() => setActiveTab("Milestones")}
                    onNextClick={() => setActiveTab("Payment Breakdown")}
                />;

            case "Payment Breakdown":
                return <PaymentBreakdown {...commonProps}
                    onPrevClick={() => setActiveTab("Bill Summary")}
                    onNextClick={() => setActiveTab("Submissions")}
                />;

            case "Submissions":
                return <ContractorSubmission {...commonProps} />;

            default:
                return <JobSpecification {...commonProps} onNextClick={() => setActiveTab("Work Plan")} />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-center">
                <div>
                    <h2 className="text-xl font-semibold text-red-600">Failed to load job data</h2>
                    <p className="text-gray-700 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <DashboardHeader />
            <section className="container mx-auto mt-4 sm:mt-8 px-2 sm:px-4">
                <header>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 px-2 sm:px-0">
                        Job Details for #{response?.jobId || id}
                    </h2>
                    <ActiveAwardedNav
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabClick={setActiveTab}
                    />
                </header>

                <main className="mt-4 sm:mt-6">
                    {getActiveComponent()}
                </main>
            </section>
        </>
    );
}


interface ActiveAwardedNavProps {
    tabs: { name: string; shortName: string }[];
    activeTab: string;
    onTabClick: (tabName: string) => void;
}

function ActiveAwardedNav({ tabs, activeTab, onTabClick }: ActiveAwardedNavProps) {
    return (
        <div className="border-b border-gray-400">
            {/* Desktop Navigation */}
            <div className="hidden md:flex justify-end space-x-6 px-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        type="button"
                        onClick={() => onTabClick(tab.name)}
                        className={`pb-2 font-medium text-base focus:outline-none transition-colors duration-200 ${activeTab === tab.name
                            ? "text-blue-800 border-b-2 border-blue-800"
                            : "text-gray-600 hover:text-blue-800"
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Mobile Navigation - Horizontal Scroll */}
            <div className="md:hidden overflow-x-auto scrollbar-hide">
                <div className="flex space-x-1 px-2 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            type="button"
                            onClick={() => onTabClick(tab.name)}
                            className={`pb-2 px-3 py-1 font-medium text-xs whitespace-nowrap focus:outline-none transition-colors duration-200 ${activeTab === tab.name
                                ? "text-blue-800 border-b-2 border-blue-800 bg-blue-50"
                                : "text-gray-600 hover:text-blue-800 hover:bg-gray-50"
                                }`}
                        >
                            {tab.shortName}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BidJobPageContainer;