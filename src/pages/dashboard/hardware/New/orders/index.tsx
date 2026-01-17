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
    <div className="border-b border-gray-400">
      <div className="flex justify-end space-x-6 px-4">
        {tabs.map((tab) => (
          // We now use <button> instead of <Link>
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
// This component now holds the state and controls the active tab.
function NewHardwareOrderPageContainer() {
  // 1. State to keep track of the active tab's name.
  // We initialize it with the name of the first tab.
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  // 2. Find the component that corresponds to the active tab name.
  const activeComponent = tabs.find(tab => tab.name === activeTab)?.component;

  return (
    <>
      <DashboardHeader />
      <section className="container mx-auto mt-12">
        <header>
          {/* 3. Pass the state and the setter function down to the navigation. */}
          <ActiveFundiNav
            activeTab={activeTab}
            onTabClick={setActiveTab}
          />
        </header>

        <main>
          {/* 4. Directly render the active component. No <Routes> needed. */}
          {activeComponent}
        </main>
      </section>
    </>

  );
}

export default NewHardwareOrderPageContainer;