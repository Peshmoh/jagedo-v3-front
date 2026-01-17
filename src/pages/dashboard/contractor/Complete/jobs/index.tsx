/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useEffect, type ReactNode } from 'react';
import { useParams } from "react-router-dom";
import JobSpecification from '@/components/PastActiveContractorJobsComponent/Job_Specification';
import Progress from '@/components/PastActiveContractorJobsComponent/Progress';
import Quote from '@/components/PastActiveContractorJobsComponent/Quote';
import { DashboardHeader } from '@/components/DashboardHeader';
import Reviews from '@/components/FundiActivePastSharedJobComponents/Reviews';


// Use ReactNode for better type flexibility
const tabs: { name: string; component: ReactNode }[] = [
    { name: "Job Specification", component: <JobSpecification /> },
    { name: "Final Quote", component: <Quote /> },
    { name: "Job Progress", component: <Progress /> },
    { name: "Reviews", component: <Reviews /> }
];

interface BidClosedNavProps {
    tabs: { name: string; component: ReactNode }[];
    activeTab: string;
    onTabClick: (tabName: string) => void;
}

function BidClosedNav({ tabs, activeTab, onTabClick }: BidClosedNavProps) {
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
                                    : "text-gray-600 hover:bg-gray-100"
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

function PastContractorJobsPageContainer() {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState(tabs[0].name);

    useEffect(() => {
        if (id) {
            console.log(`Fetching all data for past job: ${id}`);
        }
    }, [id]);

    const activeComponent = tabs.find(tab => tab.name === activeTab)?.component;

    if (!id) {
        return (
            <>
                <DashboardHeader />
                <section className="container mx-auto mt-6 px-4 md:mt-8">
                    <p>Job not found.</p>
                </section>
            </>
        )
    }

    return (
        <>
            <DashboardHeader />
            <section className="container mx-auto mt-6 px-4 md:mt-8">
                <header className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Past Job Details for #{id}</h2>
                    <BidClosedNav
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabClick={setActiveTab}
                    />
                </header>

                <main className="mt-6">
                    {activeComponent || null}
                </main>
            </section>
        </>
    );
}

export default PastContractorJobsPageContainer;