/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import JobSpecification from '@/components/CustomerActivePastJobComponents/Job_Specification';
import Progress from '@/components/FundiActivePastSharedJobComponents/Progress';
import { DashboardHeader } from '@/components/DashboardHeader';
import Submissions from '@/components/FundiActivePastSharedJobComponents/Submissions';
import Reviews from '@/components/FundiActivePastSharedJobComponents/Reviews';

const tabs = [
    { name: "Job Specification", component: <JobSpecification /> },
    { name: "Progress", component: <Progress /> },
    { name: "Submissions", component: <Submissions /> },
    { name: "Reviews", component: <Reviews /> }
];

interface ActiveAwardedNavProps {
    activeTab: string;
    onTabClick: (tabName: string) => void;
}

function ActiveAwardedNav({ activeTab, onTabClick }: ActiveAwardedNavProps) {
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

function PastJobPageContainer() {
    const { id } = useParams<{ id: string }>();

    const [activeTab, setActiveTab] = useState(tabs[0].name);

    useEffect(() => {
        if (id) {
            console.log(`Fetching all data for active job: ${id}`);
        }
    }, [id]);

    const activeComponent = tabs.find(tab => tab.name === activeTab)?.component;

    return (
        <>
        <DashboardHeader/>
            <section className="container mx-auto mt-8 px-4">
                <header>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Details for #{id}</h2>
                    <ActiveAwardedNav
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

export default PastJobPageContainer;