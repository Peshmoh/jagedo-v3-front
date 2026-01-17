//@ts-nocheck
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

// --- Component Imports ---
import JobSpecification from '@/components/PastActiveContractorJobsComponent/Job_Specification';
import Progress from '@/components/PastActiveContractorJobsComponent/Progress';
import Quote from '@/components/PastActiveContractorJobsComponent/Quote';
import { DashboardHeader } from '@/components/DashboardHeader';
import Reviews from '@/components/FundiActivePastSharedJobComponents/Reviews';


// --- Tab Configuration ---
// 'path' is no longer needed for routing but can be kept as a key if desired.
const tabs = [
    { name: "Job Specification", component: <JobSpecification /> },
    { name: "Final Quote", component: <Quote /> },
    { name: "Job Progress", component: <Progress /> },
    { name: "Reviews", component: <Reviews /> }
];

// --- Navigation Component (Controlled) ---
// Renders clickable tabs based on props from its parent.
interface BidClosedNavProps {
    activeTab: string;
    onTabClick: (tabName: string) => void;
}

function BidClosedNav({ activeTab, onTabClick }: BidClosedNavProps) {
    return (
        <div className="border-b border-gray-400">
            <div className="flex justify-end space-x-6 px-4">
                {tabs.map((tab) => (
                    // Use <button> for state-driven actions
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

// --- Main Container (Stateful) ---
// Renaming to match your previous route structure, but keeping the core logic.
function PastProffJobsPageContainer() {
    const { id } = useParams<{ id: string }>();

    const [activeTab, setActiveTab] = useState(tabs[0].name);

    useEffect(() => {
        if (id) {
            console.log(`Fetching all data for past job: ${id}`);
        }
    }, [id]);

    const activeComponent = tabs.find(tab => tab.name === activeTab)?.component;

    return (
        <>
            <DashboardHeader />
            <section className="container mx-auto mt-8 px-4">
                <header className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Job Details for #{id}</h2>
                    <BidClosedNav
                        activeTab={activeTab}
                        onTabClick={setActiveTab}
                    />
                </header>

                <main className="mt-6">
                    {activeComponent}
                </main>
            </section>
        </>
    );
}

export default PastProffJobsPageContainer;