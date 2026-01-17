import { Calendar, Download, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

interface TableRowData {
  no: number;
  date: string;
  reqno: string;
  request: string;
  managedBy: string;
  invoiceNo: string;
  amount: number;
  receiptNo: string;
  amtReceived: number;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
  }
}

interface Customer {
  name: string;
  invoiceNumber: string;
}

interface DateTimeInfo {
  date: string;
  time: string;
}

interface Invoice {
  id: string;
  customer: Customer;
  email: string;
  created: DateTimeInfo;
  dueDate: DateTimeInfo;
  amount: number;
  status: string;
}

interface SalesInvoiceProps {
  setShowSalesModal: () => void;
  selectedRow: TableRowData | null;
}

export default function SalesInvoice({ setShowSalesModal, selectedRow }: SalesInvoiceProps) {
  const [receipt, setReceipt] = useState<Invoice | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedRow) return;

    const customerName = selectedRow.customer ? `${selectedRow.customer.firstName} ${selectedRow.customer.lastName}` : `Client for Req# ${selectedRow.reqno}`;
    const customerEmail = selectedRow.customer?.email || 'client@example.com';

    const customReceipt: Invoice = {
      id: selectedRow.receiptNo !== 'N/A' ? selectedRow.receiptNo : selectedRow.invoiceNo,
      customer: {
        name: customerName,
        invoiceNumber: selectedRow.invoiceNo,
      },
      email: customerEmail,
      created: {
        date: selectedRow.date,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      dueDate: {
        date: selectedRow.date,
        time: "5:00 PM",
      },
      amount: selectedRow.amtReceived,
      status: selectedRow.amtReceived >= selectedRow.amount ? "Paid" : "Pending",
    };

    setReceipt(customReceipt);
  }, [selectedRow]);

  if (!receipt) {
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
          <p className="text-center">Generating receipt...</p>
        </div>
      </div>
    );
  }

  const totalAmount = receipt.amount;
  const tax = 0;
  const totalPaid = totalAmount + tax;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="w-full max-w-4xl h-auto max-h-[90vh] overflow-y-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="border-b pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RECEIPT</h1>
              <p className="text-lg text-gray-600 mt-1">#{receipt.id}</p>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 text-sm rounded-full ${receipt.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {receipt.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Issued By:</h3>
            <div className="space-y-1 text-gray-600">
              <p className="font-medium text-gray-900">JaGedo Ltd</p>
              <p>Ngong Road, Nairobi</p>
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
                <span>{receipt.email}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Receipt Date</span>
            </div>
            <p className="font-medium">{receipt.created.date} at {receipt.created.time}</p>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        <div className="flex justify-end mb-10">
          <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">KSh {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax (0%):</span>
              <span className="font-medium">KSh {tax.toLocaleString()}</span>
            </div>
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between py-2">
              <span className="text-lg font-semibold text-gray-900">Total Paid:</span>
              <span className="text-lg font-bold text-gray-900">KSh {totalPaid.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
          <p className="text-gray-600 text-sm">
            Payment received in full. Thank you for choosing JaGedo Ltd. This receipt confirms your payment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate(`/receipts/${receipt.id}`)} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 text-sm">
            <Download className="h-4 w-4" />
            Download Receipt
          </button>
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
  selectedRow: PropTypes.object,
};