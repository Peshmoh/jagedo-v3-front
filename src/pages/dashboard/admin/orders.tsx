//@ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import useAxiosWithAuth from '@/utils/axiosInterceptor';
import { useNavigate } from 'react-router-dom';
import { getAdminOrderRequests } from '@/api/orderRequests.api';

// Interface for a single order, matching the API response
interface Order {
  id: number;
  customer: {
    id: number;
    username: string;
  };
  items: any[];
  status: string;
  orderId: string | null;
  type: string;
  notes: string | null;
  totalAmount: number | null;
  subTotal: number | null;
  createdAt: string;
}

function Orders() {
  const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<any>('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [orderRequests, setOrderRequests] = useState<Order[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    orderId: '',
    orderType: '',
    skill: '',
    location: '',
    status: '',
    stage: '',
    managedBy: '',
    startDate: '',
    endDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Configuration for status colors and counts
  const statusConfig = {
    New: { color: 'bg-blue-100 text-blue-800', count: orderRequests.filter((item) => item.status?.toLowerCase() === 'new').length },
    Draft: { color: 'bg-gray-100 text-gray-800', count: orderRequests.filter((item) => item.status?.toLowerCase() === 'draft').length },
    Bid: { color: 'bg-yellow-100 text-yellow-800', count: orderRequests.filter((item) => item.status?.toLowerCase() === 'bid').length },
    Active: { color: 'bg-green-100 text-green-800', count: orderRequests.filter((item) => item.status?.toLowerCase() === 'active').length },
    Past: { color: 'bg-purple-100 text-purple-800', count: orderRequests.filter((item) => item.status?.toLowerCase() === 'past').length }
  };

  const fetchAllOrderRequests = async () => {
    try {
      const response = await getAdminOrderRequests(axiosInstance);
      if (response.success) {
        setOrderRequests(response.hashSet || [])
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      alert(error.message || "Failed to fetch order requests")
    }
  };

  useEffect(() => {
    fetchAllOrderRequests();
  }, []);

  const filteredData = useMemo(() => {
    let filtered = orderRequests;

    if (activeTab === 'New') {
      filtered = filtered.filter(item => item.status?.toLowerCase() === 'new');
    } else {
      filtered = filtered.filter(item => item.status?.toLowerCase() === activeTab.toLowerCase());
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        (item.orderId || `Order #${item.id}`).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.type || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply advanced filters (simplified for example)
    if (filterValues.orderId) {
      filtered = filtered.filter(item => (item.orderId || `Order #${item.id}`).toLowerCase().includes(filterValues.orderId.toLowerCase()));
    }
    if (filterValues.status) {
      filtered = filtered.filter(item => (item.status || '').toLowerCase().includes(filterValues.status.toLowerCase()));
    }

    return filtered;
  }, [activeTab, searchQuery, orderRequests, filterValues]);

  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIdx, startIdx + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const tabs = [
    { key: 'New', label: 'New', count: statusConfig.New.count },
    { key: 'Draft', label: 'Drafts', count: statusConfig.Draft.count },
    { key: 'Bid', label: 'Bids', count: statusConfig.Bid.count },
    { key: 'Active', label: 'Active', count: statusConfig.Active.count },
    { key: 'Past', label: 'Past', count: statusConfig.Past.count }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-6">
          {/* Mobile Dropdown Menu - visible on small screens */}
          <div className="md:hidden relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex justify-between items-center px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 text-lg font-semibold"
            >
              <span>{activeTab} Orders ({tabs.find(t => t.key === activeTab)?.count || 0})</span>
              {isMobileMenuOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {isMobileMenuOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setIsMobileMenuOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-3 flex justify-between ${activeTab === tab.key ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50'}`}
                  >
                    <span>{tab.label}</span>
                    <span className="font-semibold">({tab.count})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Tab Bar - hidden on small screens */}
          <div className="hidden md:grid grid-cols-5 gap-2 md:gap-4 bg-white rounded-lg p-2 md:p-4 shadow-sm border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`flex justify-center px-2 py-2 rounded-md font-medium transition-all duration-200 items-center space-x-2 text-sm ${activeTab === tab.key
                  ? 'bg-[#00007a] text-white shadow-md'
                  : 'bg-blue-50 text-gray-800 hover:bg-blue-100'
                  }`}
              >
                <span>{tab.label}</span>
                <span className="font-semibold">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Order ID or Type"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="w-full md:w-auto flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Date Created</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Order Type</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/dashboard/admin/orders/${item.id}`)}>
                    <td className="px-4 md:px-6 py-3 text-sm text-gray-900">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="px-4 md:px-6 py-3 text-sm text-blue-600 font-medium whitespace-nowrap">{item.orderId || `Order #${item.id}`}</td>
                    <td className="px-4 md:px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'N/A'}</td>
                    <td className="px-4 md:px-6 py-3 text-sm text-gray-700">{item.type || 'N/A'}</td>
                    <td className="px-4 md:px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{item.subTotal ? `KES ${item.subTotal.toLocaleString()}` : 'N/A'}</td>
                    <td className="px-4 md:px-6 py-3 text-sm text-gray-700">{item.customer?.username || 'N/A'}</td>
                    <td className="px-4 md:px-6 py-3 text-sm text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusConfig[item.status] ? statusConfig[item.status].color : 'bg-gray-100 text-gray-800'}`}>
                        {item.status || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <label htmlFor="rowsPerPage" className="text-sm text-gray-700">Rows:</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
            >
              {[10, 20, 50].map(num => (<option key={num} value={num}>{num}</option>))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;