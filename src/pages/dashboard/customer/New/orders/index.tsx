//@ts-nocheck
import { useState } from 'react';
import ProductList from '@/components/FundiContractorCustomerSharedOrderComponents/ProductList';
import OrderSummary from '@/components/FundiContractorCustomerSharedOrderComponents/OrderSummary'
import Specification from '@/components/FundiContractorCustomerSharedOrderComponents/Specification';
import { DashboardHeader } from '@/components/DashboardHeader';

const tabs = [
  { name: "Specification", component: <Specification /> },
  { name: "Product List", component: <ProductList /> },
  { name: "OrderSummary", component: <OrderSummary /> }
];

interface ActiveFundiNavProps {
  activeTab: string;
  onTabClick: (tabName: string) => void;
}

function ActiveFundiNav({ activeTab, onTabClick }: ActiveFundiNavProps) {
  return (
    <div className="border-b border-gray-400">
      <div className="flex justify-end space-x-6 px-4">
        {tabs.map((tab) => (
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

function NewCustomerOrderPageContainer() {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const activeComponent = tabs.find(tab => tab.name === activeTab)?.component;

  return (
    <>
      <DashboardHeader />
      <section className="container mx-auto mt-12">
        <header>
          <ActiveFundiNav
            activeTab={activeTab}
            onTabClick={setActiveTab}
          />
        </header>

        <main>
          {activeComponent}
        </main>
      </section>
    </>

  );
}

export default NewCustomerOrderPageContainer;