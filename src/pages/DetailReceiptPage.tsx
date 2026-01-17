/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeftIcon, Download } from "lucide-react";
import { useState, useEffect } from "react";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import { getReceipt } from "@/api/receipts.api"
import { useParams } from "react-router-dom"

export default function DetailReceiptPage() {
    const { id } = useParams()
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
    const [receipt, setReceipt] = useState<any>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleBack = () => {
        window.history.back()
    }

    const formatDate = (isoString: string) => {
        if (!isoString) return { date: 'N/A', time: 'N/A' };
        const dateObj = new Date(isoString);
        return {
            date: dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
            time: dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        };
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    useEffect(() => {
        const fetchReceipt = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiResponse = await getReceipt(axiosInstance, id);

                if (!apiResponse.success) {
                    setError(apiResponse.message || "An API error occurred.");
                    return;
                }

               setReceipt(apiResponse.data)

            } catch (e: any) {
                setError(e.message || "A network error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchReceipt();
    }, []);

    return (
        <>
            <div className="printable-content max-w-4xl mx-auto bg-white">
                <div className="no-print p-4 sm:p-6 lg:p-8 shadow-lg rounded-lg">
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={handleBack}
                            className="font-semibold text-gray-700 hover:text-blue-600 flex items-center gap-2 text-lg"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            Back
                        </button>
                        <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                            Paid
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Receipt Details</h1>
                    <p className="text-lg text-gray-600 mt-1">
                        Transaction: #{receipt?.transactionId}
                    </p>
                    <div className="mt-6 text-center">
                        <p className="text-gray-500">A print-friendly version is available.</p>
                        <button
                            onClick={() => window.print()}
                            className="mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4" />
                            Print or Download PDF
                        </button>
                    </div>
                </div>

                <div className="print-only-container">
                    <header className="print-header">
                        <div className="print-logo">
                            <h1 className="font-bold text-4xl text-blue-900">JaGedo</h1>
                            <p className="text-sm text-gray-600">Your Trusted Builder</p>
                        </div>
                        <div className="print-company-details">
                            <p className="font-bold">JaGedo Innovations Limited</p>
                            <p>Nairobi Nairobi 00606</p>
                            <p>Kenya</p>
                            <p>0710757263</p>
                            <p>james.ayako@jagedo.co.ke</p>
                            <p>www.jagedo.co.ke</p>
                        </div>
                    </header>

                    <hr className="print-hr" />

                    <h2 className="print-title">PAYMENT RECEIPT</h2>

                    <section className="print-main-details">
                        <div className="print-payment-info">
                            <div className="info-item"><span className="label">Payment Date</span> <strong>{receipt?.paymentDate.replace(/,/g, '')}</strong></div>
                            <div className="info-item"><span className="label">Reference Number</span> <strong>{receipt?.transactionId}</strong></div>
                            <div className="info-item"><span className="label">Payment Mode</span> <strong>{receipt?.paymentType.replace('_', ' ')}</strong></div>
                        </div>
                        <div className="print-amount-box">
                            <p>Amount Received</p>
                            <p className="amount">{formatCurrency(receipt?.amount)}</p>
                        </div>
                    </section>

                    <section className="print-received-from">
                        <p>Received From</p>
                        <strong>{receipt?.userName}</strong>
                    </section>

                    <div className="print-spacer"></div>

                    <section className="print-payment-for">
                        <h3>Payment for</h3>
                        <table className="print-table">
                            <thead>
                                <tr>
                                    <th>Invoice Number</th>
                                    <th>Invoice Date</th>
                                    <th>Invoice Amount</th>
                                    <th>Payment Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{receipt?.jobStrId || 'Inv0021'}</td>
                                    <td>{new Date(receipt?.paymentDate).toLocaleDateString('en-GB')}</td>
                                    <td>{formatCurrency(receipt?.amount)}</td>
                                    <td>{formatCurrency(receipt?.amount)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <footer className="print-footer">
                        1
                    </footer>
                </div>
            </div>

        </>
    )
}