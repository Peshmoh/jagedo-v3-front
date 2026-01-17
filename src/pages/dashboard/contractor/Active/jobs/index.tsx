/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import JobSpecification from '@/components/PastActiveContractorJobsComponent/Job_Specification';
import Progress from '@/components/PastActiveContractorJobsComponent/Progress';
import Quote from '@/components/PastActiveContractorJobsComponent/Quote';
import CustomerPage from '@/components/PastActiveContractorJobsComponent/Customer';
import { DashboardHeader } from '@/components/DashboardHeader';

const tabs = [
    { name: "Job Specification", component: <JobSpecification /> },
    { name: "Final Quote", component: <Quote /> },
    { name: "Job Progress", component: <Progress /> },
    { name: "Customer", component: <CustomerPage /> }
];


interface BidClosedNavProps {
    activeTab: string;
    onTabClick: (tabName: string) => void;
}

function BidClosedNav({ activeTab, onTabClick }: BidClosedNavProps) {
    return (
        <div className="border-b border-gray-400">
            <div className="flex justify-end space-x-6 px-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        type="button"
                        onClick={() => onTabClick(tab.name)}
                        className={`pb-1 font-medium text-sm md:text-base focus:outline-none ${activeTab === tab.name
                            ? "text-blue-800 border-b-2 border-blue-800"
                            : "text-gray-600 hover:text-blue-800"
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
        </div>
    );
}


function ActiveContractorJobsPageContainer() {
    const navigate = useNavigate();
    const { jobId } = useParams<{ jobId: string }>();

    const [activeTab, setActiveTab] = useState(tabs[0].name);

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (jobId) {
            console.log(`Fetching all data for past job: ${jobId}`);
        }
    }, [jobId]);

    const activeComponent = tabs.find(tab => tab.name === activeTab)?.component;

    return (
        <>
            <DashboardHeader />
            <section className="container mx-auto mt-8 px-4">
                <header className="mb-6">
                    <div className="border-b border-gray-400 flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-gray-700 hover:text-blue-800 transition-colors pr-4"
                            aria-label="Go back"
                        >
                            <FaArrowLeft className="h-5 w-5" />
                            <span className="font-semibold hidden sm:inline">Back</span>
                        </button>
                        <BidClosedNav
                            activeTab={activeTab}
                            onTabClick={setActiveTab}
                        />
                    </div>
                </header>

                <main className="mt-6">
                    {/* 4. Render the currently active component directly. */}
                    {activeComponent}
                </main>
            </section>
        </>
    );
}

export default ActiveContractorJobsPageContainer;