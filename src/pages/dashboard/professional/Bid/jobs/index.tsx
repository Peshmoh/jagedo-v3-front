/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getJobRequestById } from "@/api/jobRequests.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";

import Submissions from '@/components/ProffContractorBidsJobComponents/Submission';
import ProffGrandSummary from '@/components/ProffContractorBidsJobComponents/ProffGrandSummary';
import ProffContractorFee from '@/components/ProffContractorBidsJobComponents/ProffContractor_fee';
import JobSpecification from '@/components/ProffContractorBidsJobComponents/Job_Specification';
import Milestones from '@/components/ProffContractorBidsJobComponents/Milestones';
import PaymentBreakdown from '@/components/ProffContractorBidsJobComponents/PaymentBreakdown';
import OtherExpenses from '@/components/ProffContractorBidsJobComponents/Other_expenses';
import ProffWorkPlan from '@/components/ProffContractorBidsJobComponents/ProffContWorkPlan';
import { DashboardHeader } from '@/components/DashboardHeader';
import Loader from '@/components/Loader';

function BidProffPageContainer() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
    
    const [activeTab, setActiveTab] = useState("Job Specification");

    // State for fetching and storing job data
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
        { name: "Job Specification" },
        { name: "Work Plan" },
        { name: "Professional Fee" },
        // { name: "Other Expenses" },
        { name: "Milestones" },
        { name: "Grand Summary" },
        { name: "Payment Breakdown" },
        { name: "Submissions" },
    ];

    const getActiveComponent = () => {
        const commonProps = {
            response: response
        };
        
        switch (activeTab) {
            case "Job Specification":
                return <JobSpecification {...commonProps} onNextClick={() => setActiveTab("Work Plan")} />;
            case "Work Plan":
                return <ProffWorkPlan {...commonProps}
                    onPrevClick={() => setActiveTab("Job Specification")}
                    onNextClick={() => setActiveTab("Professional Fee")}
                />;
            case "Professional Fee":
                return <ProffContractorFee {...commonProps}
                    onPrevClick={() => setActiveTab("Work Plan")}
                    onNextClick={() => setActiveTab("Milestones")}
                />;
            // case "Other Expenses":
            //     return <OtherExpenses {...commonProps}
            //         onPrevClick={() => setActiveTab("Professional Fee")}
            //         onNextClick={() => setActiveTab("Milestones")}
            //     />;
            case "Milestones":
                return <Milestones {...commonProps}
                    onPrevClick={() => setActiveTab("Professional Fee")}
                    onNextClick={() => setActiveTab("Grand Summary")}
                />;
            case "Grand Summary":
                return <ProffGrandSummary {...commonProps}
                    onPrevClick={() => setActiveTab("Milestones")}
                    onNextClick={() => setActiveTab("Payment Breakdown")}
                />;
            case "Payment Breakdown":
                return <PaymentBreakdown {...commonProps}
                    onPrevClick={() => setActiveTab("Grand Summary")}
                    onNextClick={() => setActiveTab("Submissions")}
                />;
            case "Submissions":
                return <Submissions {...commonProps} />;
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
            <button
                onClick={() => navigate("/dashboard/professional")}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors m-4"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to Dashboard
            </button>
            <section className="container mx-auto mt-4 md:mt-8 px-4">
                <header>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Job Details for #{response?.jobId || id}</h2>
                    <ActiveAwardedNav
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabClick={setActiveTab}
                    />
                </header>

                <main className="mt-4 md:mt-6">
                    {getActiveComponent()}
                </main>
            </section>
        </>
    );
}

interface ActiveAwardedNavProps {
    tabs: { name: string }[];
    activeTab: string;
    onTabClick: (tabName: string) => void;
}

function ActiveAwardedNav({ tabs, activeTab, onTabClick }: ActiveAwardedNavProps) {
    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:block border-b border-gray-400">
                <div className="flex justify-end space-x-6 px-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            type="button"
                            onClick={() => onTabClick(tab.name)}
                            className={`pb-1 font-medium text-sm lg:text-base focus:outline-none ${activeTab === tab.name
                                ? "text-blue-800 border-b-2 border-blue-800"
                                : "text-gray-600 hover:text-blue-800"
                                }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Navigation - Horizontal Scroll */}
            <div className="md:hidden border-b border-gray-400">
                <div className="flex overflow-x-auto scrollbar-hide px-2 py-2">
                    <div className="flex space-x-3 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                type="button"
                                onClick={() => onTabClick(tab.name)}
                                className={`px-3 py-2 rounded-lg whitespace-nowrap text-xs font-medium focus:outline-none transition-colors ${activeTab === tab.name
                                    ? "bg-blue-800 text-white"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-800"
                                    }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default BidProffPageContainer;