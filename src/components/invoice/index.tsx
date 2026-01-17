import { useState } from "react"
import { ArrowLeft, CheckCircle, Clock, Download, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function InvoiceDetail() {
  const [isPaying, setIsPaying] = useState(false)
  const [isPaid, setIsPaid] = useState(false)

  const handlePayment = () => {
    setIsPaying(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsPaying(false)
      setIsPaid(true)
    }, 2000)
  }

  const invoiceData = {
    id: "INV-2025-0001",
    date: "June 12, 2025",
    dueDate: "June 19, 2025",
    status: isPaid ? "Paid" : "Pending",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+254 712 345 678",
    },
    service: {
      type: "Fundi Service",
      description: "Plumbing repair service",
      location: "Nairobi, Kenya",
      date: "June 15, 2025",
    },
    items: [
      {
        description: "Fundi Service Fee",
        amount: 2500,
      },
      {
        description: "Platform Fee (15%)",
        amount: 375,
      },
    ],
    total: 2875,
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b py-4">
        <div className="container flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="JAGEDO Logo"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-2xl font-bold text-[#00007a]">JAGEDO</span>
          </a>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <a
              href="/dashboard/customer"
              className="flex items-center text-gray-600 hover:text-[#00007a] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-[#00007a] to-[#000055] text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Invoice</h1>
                  <p className="text-white/80">#{invoiceData.id}</p>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isPaid ? "bg-green-500/20 text-green-100" : "bg-yellow-500/20 text-yellow-100"
                      }`}
                  >
                    {isPaid ? <CheckCircle className="h-4 w-4 mr-1" /> : <Clock className="h-4 w-4 mr-1" />}
                    {invoiceData.status}
                  </div>
                  <p className="text-white/80 mt-2">Issue Date: {invoiceData.date}</p>
                  <p className="text-white/80">Due Date: {invoiceData.dueDate}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Customer & Service Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-2">CUSTOMER</h2>
                  <p className="font-medium">{invoiceData.customer.name}</p>
                  <p className="text-gray-600">{invoiceData.customer.email}</p>
                  <p className="text-gray-600">{invoiceData.customer.phone}</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-2">SERVICE DETAILS</h2>
                  <p className="font-medium">{invoiceData.service.type}</p>
                  <p className="text-gray-600">{invoiceData.service.description}</p>
                  <p className="text-gray-600">Location: {invoiceData.service.location}</p>
                  <p className="text-gray-600">Service Date: {invoiceData.service.date}</p>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="border-t border-b py-4 mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm">
                      <th className="pb-3">DESCRIPTION</th>
                      <th className="text-right pb-3">AMOUNT (KES)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, index) => (
                      <tr key={index} className="border-t first:border-0">
                        <td className="py-3">{item.description}</td>
                        <td className="text-right py-3">{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t font-medium">
                      <td className="py-3">TOTAL</td>
                      <td className="text-right py-3">KES {invoiceData.total.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment Instructions */}
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-500 mb-2">PAYMENT INSTRUCTIONS</h2>
                <p className="text-gray-600 text-sm">
                  Payment is processed securely through JAGEDO's escrow system. The funds will be released to the
                  service provider once you confirm the job is completed to your satisfaction.
                </p>
              </div>

              {/* Payment Status */}
              {isPaid ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-fade-in">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-800 font-medium">Payment Successful! Thank you for your payment.</p>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Your service provider has been notified and will contact you shortly.
                  </p>
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                {!isPaid && (
                  <Button
                    className="bg-[#00a63e] hover:bg-[#00a63e]/90 flex-1 md:flex-none"
                    onClick={handlePayment}
                    disabled={isPaying}
                  >
                    {isPaying ? (
                      <div className="flex items-center">
                        <span className="animate-spin mr-2">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </span>
                        Processing...
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </Button>
                )}
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                {!isPaid && (
                  <Button variant="ghost" className="text-gray-500">
                    Save for Later
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-5 bg-white/80 backdrop-blur-md shadow-xl border-b border-white/20">
        <div className="container text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} JAGEDO. All rights
          reserved.
        </div>
      </footer>
    </div>
  )
}