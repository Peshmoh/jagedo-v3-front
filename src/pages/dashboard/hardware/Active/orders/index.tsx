//@ts-nocheck
import { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
// --- Component Imports ---
import GrandSummary from '@/components/FundiContractorCustomerSharedOrderComponents/Grand_Summary';
import ProductList from '@/components/FundiContractorCustomerSharedOrderComponents/ProductList';
import LeadTime from '@/components/FundiContractorCustomerSharedOrderComponents/Lead_Time';
import PaymentBreakdown from '@/components/FundiContractorCustomerSharedOrderComponents/Payment_Breakdown';
import Submissions from '@/components/FundiContractorCustomerSharedOrderComponents/Submissions';
import Specification from '@/components/FundiContractorCustomerSharedOrderComponents/Specification';

// --- Tab Configuration ---
const tabs = [
  { name: "Specification", component: <Specification /> },
  { name: "Grand Summary", component: <GrandSummary /> },
  { name: "Product List", component: <ProductList /> },
  { name: "Payment Breakdown", component: <PaymentBreakdown /> },
  { name: "Lead Time", component: <LeadTime /> },
  { name: "Submissions", component: <Submissions /> },
];

// --- Navigation Component (Controlled) ---
interface ActiveFundiNavProps {
  activeTab: string;
  onTabClick: (tabName: string) => void;
}

function ActiveFundiNav({ activeTab, onTabClick }: ActiveFundiNavProps) {
  return (
    <div className="border-b border-gray-400">
      <div className="flex justify-end space-x-6 px-4">
        {tabs.map((tab) => (
          // Use <button> for state-driven actions
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

function HardwareActiveOrdersPageContainer() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const activeComponent = tabs.find(tab => tab.name === activeTab)?.component;
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <DashboardHeader />
      <section className="container mx-auto mt-12">
        <header>
          <div className="border-b border-gray-400 flex justify-between items-center">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-800 transition-colors pr-4"
              aria-label="Go back"
            >
              <FaArrowLeft className="h-5 w-5" />
              <span className="font-semibold hidden sm:inline">Back</span>
            </button>
            <ActiveFundiNav
              activeTab={activeTab}
              onTabClick={setActiveTab}
            />
          </div>
        </header>

        <main>
          {activeComponent}
        </main>
      </section>
    </>
  );
}

export default HardwareActiveOrdersPageContainer;