import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

// Define the interface for the row data for type safety
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
}

interface SalesTableProps {
  data: TableRowData[];
  onRowClick: (rowData: TableRowData) => void;
}

const SalesTable = ({ data, onRowClick }: SalesTableProps) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  const fromPath = location.state?.from || "/fundi-portal";

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleFromPath = () => {
    if (fromPath.startsWith("/fundi-portal")) return "Fundi";
    if (fromPath.startsWith("/professional-portal")) return "Professional";
    if (fromPath.startsWith("/contractor-portal")) return "Contractor";
    if (fromPath.startsWith("/hardware-portal")) return "Hardware";
    return "All"
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {handleFromPath()} Requests
      </h2>
      <div className="relative mb-4 flex justify-between items-center">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by any field..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 pl-10 rounded-md px-3 py-2 w-full max-w-md focus:ring-blue-500 focus:outline-none focus:ring-2"
        />
      </div>
      <div className='border border-gray-400 rounded-lg'>
        <table className="w-full bg-white rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr className='border-b border-gray-100'>
              <th className="p-2 text-left font-semibold whitespace-nowrap">No</th>
              <th className="p-2 text-left font-semibold whitespace-nowrap">Date</th>
              <th className="p-2 text-left font-semibold whitespace-nowrap">REQ NO</th>
              <th className="p-2 text-left font-semibold whitespace-nowrap">Request Type</th>
              <th className="p-2 text-left font-semibold whitespace-nowrap">Managed By</th>
              <th className="p-2 text-left font-semibold whitespace-nowrap">Invoice NO</th>
              <th className="p-2 text-left font-semibold whitespace-nowrap">Invoice Amount (KES)</th>
              <th className="p-2 text-left font-semibold whitespace-nowrap">Receipt No</th>
              <th className="p-2 text-left font-semibold whitespace-nowrap">Amt Received (KES)</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={item.reqno || index}
                className={`hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                onClick={() => onRowClick(item)}
              >
                <td className="text-gray-600 p-2">{item.no}</td>
                <td className="text-gray-600 p-2">{item.date}</td>
                <td className="text-gray-600 p-2">{item.reqno}</td>
                <td className="text-gray-600 p-2">{item.request}</td>
                <td className="text-gray-600 p-2">{item.managedBy}</td>
                <td className="text-gray-600 p-2">{item.invoiceNo}</td>
                <td className="text-gray-600 p-2">{item.amount.toLocaleString()}</td>
                <td className="text-gray-600 p-2">{item.receiptNo}</td>
                <td className="text-gray-600 p-2">{item.amtReceived.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex flex-wrap items-center justify-between mt-4 gap-3'>
        <div className="flex items-center space-x-2">
          <label htmlFor="rows" className="text-sm">Rows per page:</label>
          <select id="rows" value={rowsPerPage} onChange={handleRowsChange} className="border px-2 py-1 rounded text-sm">
            {[5, 10, 15, 20].map((n) => (<option key={n} value={n}>{n}</option>))}
          </select>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 cursor-pointer">Prev</button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 cursor-pointer">Next</button>
        </div>
      </div>
    </div>
  );
};

export default SalesTable;