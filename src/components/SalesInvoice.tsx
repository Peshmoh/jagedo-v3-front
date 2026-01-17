// import { Link } from "react-router-dom";
//@ts-nocheck

import { Calendar, Download, Mail} from "lucide-react";
import { useNavigate } from "react-router-dom"

import PropTypes from "prop-types";

export default function SalesInvoice({ setShowSalesModal }) {
    const navigate = useNavigate()
    // Use the first receipt by default since there's no ID in the route
    const invoiceData = [
        {
            reqNo: "INV-00123",
            customer: {
                name: "John Doe"
            },
            email: "johndoe@example.com",
            created: {
                date: "2025-07-16",
                time: "10:30 AM"
            },
            dueDate: {
                date: "2025-07-20",
                time: "04:00 PM"
            },
            amount: 15000
        }
    ];// You could customize this logic as needed\

    const receipt = invoiceData[0]

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="w-[80%] h-11/12 overflow-y-auto p-6 bg-white shadow-lg rounded-lg">
                {/* Header */}
                <div className="border-b pb-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">RECEIPT</h1>
                            <p className="text-lg text-gray-600 mt-1">#{receipt.reqNo}</p>
                        </div>
                        <div>
                            <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                                Paid
                            </span>
                        </div>
                    </div>
                </div>

                {/* Issuer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-20 mb-8">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Issued By:</h3>
                        <div className="space-y-1 text-gray-600">
                            <p className="font-medium text-gray-900">JaGedo Ltd</p>
                            <p>Ngong Road, Nairobi</p>
                            <p>Nairobi, Kenya</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Mail className="h-4 w-4" />
                                <span>support@jagedo.co.ke</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Receipt Issued To:</h3>
                        <div className="space-y-1 text-gray-600">
                            <p className="font-medium text-gray-900">{receipt.customer?.name || "Client"}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Mail className="h-4 w-4" />
                                <span>{receipt.email || "client@example.com"}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">Receipt Date</span>
                        </div>
                        <p className="font-medium">
                            {receipt.created.date} at {receipt.created.time}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">Service Completed</span>
                        </div>
                        <p className="font-medium">
                            {receipt.dueDate.date} at {receipt.dueDate.time}
                        </p>
                    </div>
                </div>

                <hr className="my-4 border-gray-200" />

                {/* Amount Summary */}
                <div className="flex justify-end sm:mr-14 mb-10">
                    <div className="w-full max-w-sm space-y-2">
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">KSh {receipt.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Tax (9%):</span>
                            <span className="font-medium">
                                KSh {(receipt.amount * 0.09).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                        <hr className="my-2 border-gray-200" />
                        <div className="flex justify-between py-2">
                            <span className="text-lg font-semibold text-gray-900">Total Paid:</span>
                            <span className="text-lg font-bold text-gray-900">
                                KSh {(receipt.amount * 1.09).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                    <p className="text-gray-600 text-sm">
                        Payment received in full. Thank you for choosing JaGedo Ltd. This receipt confirms your payment.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {receipt.id &&
                        (<a
                            href="#"
                            className={`flex items-center space-x-2 p-4 rounded-lg border transition-colors bg-green-50 border-green-200 text-green-700 hover:bg-green-100`}
                            onClick={() => navigate(`/receipts/${receipt.id}`)}
                        >
                            <Download className="h-6 w-6" />
                            <span className="font-medium">
                                Download Receipt
                            </span>
                        </a>)}

                    <button className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg bg-green-600 hover:bg-green-500 text-sm cursor-pointer">
                        <Mail className="h-4 w-4" />
                        Send Receipt
                    </button>
                    <button
                        type="button"
                        onClick={setShowSalesModal}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

SalesInvoice.propTypes = {
    setShowSalesModal: PropTypes.func.isRequired,
};

