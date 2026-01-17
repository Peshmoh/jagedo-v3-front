//@ts-nocheck
import { useState, type ReactNode } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import GrandSummary from '@/components/FundiContractorCustomerSharedOrderComponents/Grand_Summary';
import ProductList from '@/components/FundiContractorCustomerSharedOrderComponents/ProductList';
import LeadTime from '@/components/FundiContractorCustomerSharedOrderComponents/Lead_Time';
import PaymentBreakdown from '@/components/FundiContractorCustomerSharedOrderComponents/Payment_Breakdown';
import Submissions from '@/components/FundiContractorCustomerSharedOrderComponents/Submissions';
import Specification from '@/components/FundiContractorCustomerSharedOrderComponents/Specification';

const tabs = [
  { name: "Specification", component: <Specification /> },
  { name: "Grand Summary", component: <GrandSummary /> },
  { name: "Product List", component: <ProductList /> },
  { name: "Payment Breakdown", component: <PaymentBreakdown /> },
  { name: "Lead Time", component: <LeadTime /> },
  { name: "Submissions", component: <Submissions /> },
];

interface ActiveFundiNavProps {
  tabs: { name: string; component: ReactNode }[];
  activeTab: string;
  onTabClick: (tabName: string) => void;
}

function ActiveFundiNav({ tabs, activeTab, onTabClick }: ActiveFundiNavProps) {
  return (
    <>
      {/* Desktop Navigation (Underline Style) */}
      <div className="hidden md:block border-b border-gray-400">
        <div className="flex justify-end space-x-8 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              type="button"
              onClick={() => onTabClick(tab.name)}
              className={`whitespace-nowrap pb-3 font-medium focus:outline-none ${
                activeTab === tab.name
                  ? "border-b-2 border-[rgb(0,0,122)] text-[rgb(0,0,122)]"
                  : "text-gray-600 hover:text-[rgb(0,0,122)]"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Navigation (Pill Style with Horizontal Scroll) */}
      <div className="md:hidden border-b border-gray-400">
        <div className="flex overflow-x-auto scrollbar-hide px-2 py-2">
          <div className="flex space-x-3 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => onTabClick(tab.name)}
                className={`px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium focus:outline-none transition-colors ${
                  activeTab === tab.name
                    ? "bg-[rgb(0,0,122)] text-white"
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

function ContractorBidsOrdersPageContainer() {
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const activeComponent = tabs.find(tab => tab.name === activeTab)?.component;

  return (
    <>
      <DashboardHeader />
      <section className="container mx-auto mt-6 px-4 md:mt-12 md:px-0">
        <header>
          <ActiveFundiNav
            tabs={tabs}
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

export default ContractorBidsOrdersPageContainer;