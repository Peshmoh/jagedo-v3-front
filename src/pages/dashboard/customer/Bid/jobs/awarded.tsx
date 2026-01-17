/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useState } from 'react';
import EvaluationTable from "@/components/Awarded_Bid_Components/Evaluation_Table";
import JobSpecification from "@/components/FundiActivePastSharedJobComponents/Job_Specification";
import PaymentReceipt from "@/components/Awarded_Bid_Components/PaymentReceipt";
import { DashboardHeader } from "@/components/DashboardHeader";

const AwardPageContent = ({ showHeader = true, showSpecificationandAward = true }) => {
    const [activeTab, setActiveTab] = useState('award');
    const [isPaying, setIsPaying] = useState(false);
    const [paymentData, setPaymentData] = useState(null);

    const handleInitiatePayment = (dataForPayment) => {
        setPaymentData(dataForPayment);
        setIsPaying(true);
    };

    const handleReturnToAward = () => {
        setIsPaying(false);
        setPaymentData(null);
    };

    if (isPaying) {
        return <PaymentReceipt data={paymentData} onBack={handleReturnToAward} />;
    }

    return (
        <>
            {showHeader && <DashboardHeader />}
            <div className="w-full p-4 sm:p-8 bg-gray-50/50">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 justify-end" aria-label="Tabs">
                        {showSpecificationandAward && <button
                            onClick={() => setActiveTab('award')}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 text-sm
                                ${activeTab === 'award'
                                    ? 'border-blue-600 text-blue-600 font-semibold'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
                                }
                            `}
                            aria-current={activeTab === 'award' ? 'page' : undefined}
                        >
                            Award
                        </button>}

                        {showSpecificationandAward && <button
                            onClick={() => setActiveTab('jobSpecification')}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 text-sm
                                ${activeTab === 'jobSpecification'
                                    ? 'border-blue-600 text-blue-600 font-semibold'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
                                }
                            `}
                            aria-current={activeTab === 'jobSpecification' ? 'page' : undefined}
                        >
                            Job specification
                        </button>}
                    </nav>
                </div>

                <div className="mt-8">
                    {activeTab === 'award' && (
                        <EvaluationTable onMakePayment={handleInitiatePayment} />
                    )}
                    {activeTab === 'jobSpecification' && <JobSpecification />}
                </div>
            </div>
        </>
    );
};

export default AwardPageContent;