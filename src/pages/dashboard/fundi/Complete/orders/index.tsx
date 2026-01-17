//@ts-nocheck
import React, { useState } from 'react';

// --- Component Imports ---
import GrandSummary from '@/components/FundiContractorCustomerSharedOrderComponents/Grand_Summary';
import ProductList from '@/components/FundiContractorCustomerSharedOrderComponents/ProductList';
import LeadTime from '@/components/FundiContractorCustomerSharedOrderComponents/Lead_Time';
import PaymentBreakdown from '@/components/FundiContractorCustomerSharedOrderComponents/Payment_Breakdown';
import Submissions from '@/components/FundiContractorCustomerSharedOrderComponents/Submissions';
import Specification from '@/components/FundiContractorCustomerSharedOrderComponents/Specification';
import { DashboardHeader } from '@/components/DashboardHeader';

// --- Tab Configuration ---
// The 'path' property is no longer used for routing.
const tabs = [
    { name: "Specification", component: <Specification /> },
    { name: "Grand Summary", component: <GrandSummary /> },
    { name: "Product List", component: <ProductList /> },
    { name: "Payment Breakdown", component: <PaymentBreakdown /> },
    { name: "Lead Time", component: <LeadTime /> },
    { name: "Submissions", component: <Submissions /> },
];

// --- Navigation Component ---
// This component is controlled by props from its parent.
interface ActiveFundiNavProps {
    activeTab: string;
    onTabClick: (tabName: string) => void;
}

function ActiveFundiNav({ activeTab, onTabClick }: ActiveFundiNavProps) {
    return (
        <div className="border-b border-gray-400">
            <div className="flex justify-end space-x-6 px-4">
                {tabs.map((tab) => (
                    // Using <button> instead of <Link> for state-based navigation
                    <button
                        key={tab.name}
                        type="button"
                        onClick={() => onTabClick(tab.name)}
                        className={`pb-1 font-medium focus:outline-none ${activeTab === tab.name
                            ? "text-[rgb(0,0,122)] border-b-2 border-[rgb(0,0,122)]"
                            : "text-gray-600 hover:text-[rgb(0,0,122)]"
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

// --- Main Container ---
// This component holds the state and controls the active tab.
function PastOrderPageContainer() {
    // 1. State to track the active tab's name, initialized to the first tab.
    const [activeTab, setActiveTab] = useState(tabs[0].name);

    // 2. Find the component that matches the active tab's name.
    const activeComponent = tabs.find(tab => tab.name === activeTab)?.component;

    return (
        <>
            <DashboardHeader />
            <section className="container mx-auto mt-8">
                <header>
                    {/* 3. Pass the current state and the update function to the navigation component. */}
                    <ActiveFundiNav
                        activeTab={activeTab}
                        onTabClick={setActiveTab}
                    />
                </header>

                <main>
                    {/* 4. Render the active component directly. */}
                    {activeComponent}
                </main>
            </section>
        </>
    );
}

export default PastOrderPageContainer;