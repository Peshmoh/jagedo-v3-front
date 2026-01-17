/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
//@ts-nocheck
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileText,
  ArrowLeft
} from "lucide-react";
import { ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { DashboardHeader } from "@/components/DashboardHeader";
import useAxiosWithAuth from "@/utils/axiosInterceptor";
import { getReceipts } from "@/api/receipts.api";
import Loader from "@/components/Loader";
import { useNavigate } from "react-router-dom";

type ApiReceipt = {
  id: number;
  paymentType: string;
  userId: number;
  amount: number;
  paymentStatus: string | null;
  transactionId: string;
  paymentDate: string;
  createdAt: string;
  orderId: number | null;
  orderRecordId: number | null;
  jobRequestId: number;
  jobRecordId: number;
  jobStrId: string;
};

const rowsPerPageOptions = [5, 10, 20, 50];

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

const NoReceiptsFound = () => {
  return (
    <div className="text-center py-16 sm:py-24 px-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
        <FileText className="h-6 w-6 text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-gray-900">
        No Receipts Found
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        It looks like you don't have any receipts yet.
      </p>
    </div>
  );
};

const ReceiptDetailsView = ({
  receipt,
  onBack,
}: {
  receipt: ApiReceipt;
  onBack: () => void;
}) => {
  const { date: paymentDate } = formatDate(receipt.paymentDate);
  const customerName = "Acackoro Football Academy";
  const invoiceDate = "28/08/2025";

  return (
    <div className="printable-content max-w-4xl mx-auto bg-white">
      <div className="no-print p-4 sm:p-6 lg:p-8 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="font-semibold text-gray-700 hover:text-blue-600 flex items-center gap-2 text-lg"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Receipts
          </button>
          <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
            Paid
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Receipt Details</h1>
        <p className="text-lg text-gray-600 mt-1">
          Transaction: #{receipt.transactionId}
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
            <div className="info-item"><span className="label">Payment Date</span> <strong>{paymentDate.replace(/,/g, '')}</strong></div>
            <div className="info-item"><span className="label">Reference Number</span> <strong>{receipt.transactionId}</strong></div>
            <div className="info-item"><span className="label">Payment Mode</span> <strong>{receipt.paymentType.replace('_', ' ')}</strong></div>
          </div>
          <div className="print-amount-box">
            <p>Amount Received</p>
            <p className="amount">{formatCurrency(receipt.amount)}</p>
          </div>
        </section>

        <section className="print-received-from">
          <p>Received From</p>
          <strong>{customerName}</strong>
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
                <td>{receipt.jobStrId || 'Inv0021'}</td>
                <td>{invoiceDate}</td>
                <td>{formatCurrency(receipt.amount)}</td>
                <td>{formatCurrency(receipt.amount)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer className="print-footer">
          1
        </footer>
      </div>
    </div>
  );
};

const MobileReceiptCard = ({ receipt, onClick }: { receipt: ApiReceipt; onClick: () => void }) => {
  const { date: paymentDate } = formatDate(receipt.paymentDate);
  const status = receipt.paymentStatus === 'PAID' ? 'Paid' : 'Pending';
  const getStatusBadge = (statusText: string) => (
    <span className={`px-2 py-1 text-xs font-medium rounded ${statusText === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
      {statusText}
    </span>
  );

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">#{receipt.transactionId}</h3>
          <p className="text-sm text-gray-500">{paymentDate}</p>
        </div>
        {getStatusBadge(status)}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">User ID: {receipt.userId}</p>
        <div className="text-right">
          <p className="font-bold text-gray-900">KSh {receipt.amount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default function Receipts() {
  const navigate = useNavigate()
  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
  const [receipts, setReceipts] = useState<ApiReceipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<ApiReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState("paymentDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiResponse = await getReceipts(axiosInstance);

        if (!apiResponse.success) {
          setError(apiResponse.message || "An API error occurred.");
          return;
        }

        if (Array.isArray(apiResponse.hashSet)) {
          setReceipts(apiResponse.hashSet);
        } else if (apiResponse.hashSet === null || apiResponse.hashSet === undefined) {
          setReceipts([]);
        } else {
          setError("Invalid data structure received from API.");
        }

      } catch (e: any) {
        setError(e.message || "A network error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const handleSort = (field: keyof ApiReceipt) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleReceiptClick = (receipt) => {
    navigate(`/receipts/${receipt.id}`)
  }

  const sortedReceipts = [...receipts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortField === 'paymentDate' || sortField === 'createdAt') {
      return sortDirection === 'asc'
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const totalPages = Math.ceil(receipts.length / rowsPerPage);
  const paginatedReceipts = sortedReceipts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getStatusBadge = (status: string | null) => {
    const statusText = status === 'PAID' ? 'Paid' : 'Pending';
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${statusText === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {statusText}
      </span>
    );
  };

  if (loading) return <div className="pt-20 sm:pt-32 text-center"> <Loader /> </div>;
  if (error) return <div className="pt-20 sm:pt-32 text-center text-red-500 px-4">Error: {error}</div>;

  return (
    <>
      <DashboardHeader />
      <div className="w-full mb-5 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto pt-5 sm:pt-32 px-4 sm:px-6 lg:px-8">
          {selectedReceipt ? (
            <ReceiptDetailsView
              receipt={selectedReceipt}
              onBack={() => setSelectedReceipt(null)}
            />
          ) : (
            <>
              <div className="font-semibold hover:text-[rgb(0,0,122)] flex items-center pb-6 sm:pb-8 text-sm sm:text-base cursor-pointer" onClick={() => navigate("/dashboard/customer")}>
                <ArrowLeft className="mr-2" />
                Back To Dashboard
              </div>

              {receipts.length === 0 ? (
                <NoReceiptsFound />
              ) : (
                <div className="printable-content">
                  <div className="no-print flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 pb-4">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg border border-gray-200 text-green-700 font-medium text-sm"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      Download All
                    </button>
                  </div>

                  <div className="block sm:hidden space-y-3">
                    {paginatedReceipts.map((receipt) => (
                      <MobileReceiptCard
                        key={receipt.id}
                        receipt={receipt}
                        onClick={() => handleReceiptClick(receipt)}
                      />
                    ))}
                  </div>

                  <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-50">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100 text-gray-600">
                          <tr>
                            <th className="px-4 lg:px-6 py-4 text-left text-sm font-medium uppercase">Req No.</th>
                            <th className="px-4 lg:px-6 py-4 text-left">
                              <button onClick={() => handleSort("paymentDate")} className="flex items-center gap-1 text-sm font-medium uppercase">
                                Payment Date
                              </button>
                            </th>
                            <th className="px-4 lg:px-6 py-4 text-left">
                              <button onClick={() => handleSort("amount")} className="flex items-center gap-1 text-sm font-medium uppercase">
                                Amount
                              </button>
                            </th>
                            <th className="px-4 lg:px-6 py-4 text-left text-sm font-medium uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {paginatedReceipts.map((receipt) => {
                            const { date, time } = formatDate(receipt.paymentDate);
                            return (
                              <tr
                                key={receipt.id}
                                onClick={() => handleReceiptClick(receipt)}
                                className="cursor-pointer hover:bg-blue-50"
                              >
                                <td className="px-4 lg:px-6 py-4 font-medium text-gray-600">{receipt.jobStrId}</td>
                                <td className="px-4 lg:px-6 py-4">
                                  <div>{date}</div>
                                  <div className="text-sm text-gray-500">{time}</div>
                                </td>
                                <td className="px-4 lg:px-6 py-4 font-medium text-gray-900">Ksh {receipt.amount.toFixed(2)}</td>
                                <td className="px-4 lg:px-6 py-4">{getStatusBadge(receipt.paymentStatus)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-200 bg-white rounded-b-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Rows per page:</span>
                      <select
                        value={rowsPerPage}
                        onChange={(e) => {
                          setRowsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="border border-gray-300 px-2 py-1 rounded text-sm"
                      >
                        {rowsPerPageOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 text-sm text-gray-600">
                      <span className="whitespace-nowrap">Page {currentPage} of {totalPages}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1 disabled:opacity-50 hover:bg-gray-100 rounded">
                          <ChevronsLeft className="h-4 w-4" />
                        </button>
                        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1 disabled:opacity-50 hover:bg-gray-100 rounded">
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1 disabled:opacity-50 hover:bg-gray-100 rounded">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-1 disabled:opacity-50 hover:bg-gray-100 rounded">
                          <ChevronsRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}