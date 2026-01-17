//@ts-nocheck
import { useState } from 'react';
import GrandSummary from '@/components/FundiContractorCustomerSharedOrderComponents/Grand_Summary';
import ProductList from '@/components/FundiContractorCustomerSharedOrderComponents/ProductList';
import LeadTime from '@/components/FundiContractorCustomerSharedOrderComponents/Lead_Time';
import PaymentBreakdown from '@/components/FundiContractorCustomerSharedOrderComponents/Payment_Breakdown';
import Submissions from '@/components/FundiContractorCustomerSharedOrderComponents/Submissions';
import Specification from '@/components/FundiContractorCustomerSharedOrderComponents/Specification';
import { DashboardHeader } from '@/components/DashboardHeader';

// --- Tab Configuration ---
// The 'path' property is no longer needed for routing here, but can be kept as a unique key.
const tabs = [
  { name: "Specification", component: <Specification /> },
  { name: "Grand Summary", component: <GrandSummary /> },
  { name: "Product List", component: <ProductList /> },
  { name: "Payment Breakdown", component: <PaymentBreakdown /> },
  { name: "Lead Time", component: <LeadTime /> },
  { name: "Submissions", component: <Submissions /> },
];

// --- Navigation Component ---
// This component is now controlled by props from its parent.
interface ActiveFundiNavProps {
  activeTab: string;
  onTabClick: (tabName: string) => void;
}

function ActiveFundiNav({ activeTab, onTabClick }: ActiveFundiNavProps) {
  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:block border-b border-gray-400">
        <div className="flex justify-end space-x-6 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              type="button"
              onClick={() => onTabClick(tab.name)}
              className={`pb-1 font-medium focus:outline-none ${
                activeTab === tab.name
                  ? "text-[rgb(0,0,122)] border-b-2 border-[rgb(0,0,122)]"
                  : "text-gray-600 hover:text-[rgb(0,0,122)]"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Navigation - Horizontal scrollable tabs */}
      <div className="md:hidden border-b border-gray-400">
        <div className="flex overflow-x-auto scrollbar-hide px-2 py-2">
          <div className="flex space-x-4 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => onTabClick(tab.name)}
                className={`px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium focus:outline-none transition-colors ${
                  activeTab === tab.name
                    ? "bg-[rgb(0,0,122)] text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[rgb(0,0,122)]"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Alternative (Commented out - use if you prefer dropdown) */}
      {/*
      <div className="md:hidden border-b border-gray-400 px-4 py-3">
        <select
          value={activeTab}
          onChange={(e) => onTabClick(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(0,0,122)] focus:border-transparent"
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      */}
    </>
  );
}

// --- Main Container ---
// This component now holds the state and controls the active tab.
function NewOrderPageContainer() {
  // 1. State to keep track of the active tab's name.
  // We initialize it with the name of the first tab.
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  // 2. Find the component that corresponds to the active tab name.
  const activeComponent = tabs.find(tab => tab.name === activeTab)?.component;

  return (
    <>
      <DashboardHeader />
      <section className="container mx-auto mt-4 md:mt-12 px-4 md:px-0">
        <header>
          {/* 3. Pass the state and the setter function down to the navigation. */}
          <ActiveFundiNav
            activeTab={activeTab}
            onTabClick={setActiveTab}
          />
        </header>

        <main className="mt-4 md:mt-6">
          {/* 4. Directly render the active component. No <Routes> needed. */}
          {activeComponent}
        </main>
      </section>
    </>
  );
}

export default NewOrderPageContainer;