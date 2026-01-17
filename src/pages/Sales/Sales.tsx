/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import SalesTable from "./SalesTables";
import SalesInvoice from "./SalesInvoice";
import { DashboardHeader } from "@/components/DashboardHeader";
import { getSales } from "@/api/sales.api";
import useAxiosWithAuth from "@/utils/axiosInterceptor";

const Sales = () => {
    const [selected, setSelected] = useState('To Date');
    const [chartData, setChartData] = useState([]);
    const axiosInstance = useAxiosWithAuth(import.meta.env.VITE_SERVER_URL);
    const [metrics, setMetrics] = useState({});
    const [allSalesData, setAllSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showSalesModal, setShowSalesModal] = useState(false);

    const processSalesData = (sales) => {
        const now = new Date();
        const filters = {
            '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
            '1w': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            '1m': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
            '1y': new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
            '5y': new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()),
        };

        const calculateMetrics = (data) => ([
            { title: 'Total Jobs', value: data.filter(item => item.request === 'Jobs').length.toLocaleString() },
            { title: 'Total Orders', value: data.filter(item => item.request === 'Orders').length.toLocaleString() },
            { title: 'Total Sales', value: `Ksh ${data.reduce((acc, item) => acc + item.amount, 0).toLocaleString()}` },
        ]);

        const filteredMetrics = Object.keys(filters).reduce((acc, key) => {
            const filtered = sales.filter(item => new Date(item.rawDate) >= filters[key]);
            acc[key] = calculateMetrics(filtered);
            return acc;
        }, {});

        setMetrics({
            'To Date': calculateMetrics(sales),
            ...filteredMetrics
        });
    };

    const processChartData = (data, filter) => {
        const now = new Date();
        let filteredData = [];
        const endDate = new Date();

        switch (filter) {
            case '24h': {
                const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                filteredData = data.filter(item => new Date(item.rawDate) >= startDate);
                const hourlyData = Array.from({ length: 24 }, (_, i) => {
                    const hour = new Date(startDate.getTime() + i * 60 * 60 * 1000).getHours();
                    return { name: `${hour}:00`, Sales: 0, Jobs: 0, Orders: 0 };
                });
                filteredData.forEach(item => {
                    const hour = new Date(item.rawDate).getHours();
                    hourlyData[hour].Sales += item.amount;
                    if (item.request === 'Jobs') hourlyData[hour].Jobs += 1;
                    if (item.request === 'Orders') hourlyData[hour].Orders += 1;
                });
                return hourlyData;
            }
            case '1w': {
                const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredData = data.filter(item => new Date(item.rawDate) >= startDate);
                const dailyData = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
                    return { name: `Day ${i + 1}`, Sales: 0, Jobs: 0, Orders: 0, date: date.toLocaleDateString('en-CA') };
                });
                filteredData.forEach(item => {
                    const itemDate = new Date(item.rawDate).toLocaleDateString('en-CA');
                    const day = dailyData.find(d => d.date === itemDate);
                    if (day) {
                        day.Sales += item.amount;
                        if (item.request === 'Jobs') day.Jobs += 1;
                        if (item.request === 'Orders') day.Orders += 1;
                    }
                });
                return dailyData.map(({ name, Sales, Jobs, Orders }) => ({ name, Sales, Jobs, Orders }));
            }
            case '1m': {
                const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                filteredData = data.filter(item => new Date(item.rawDate) >= startDate);
                const dailyData = Array.from({ length: 30 }, (_, i) => {
                    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
                    return { name: `Day ${i + 1}`, Sales: 0, Jobs: 0, Orders: 0, date: date.toLocaleDateString('en-CA') };
                });
                filteredData.forEach(item => {
                    const itemDate = new Date(item.rawDate).toLocaleDateString('en-CA');
                    const day = dailyData.find(d => d.date === itemDate);
                    if (day) {
                        day.Sales += item.amount;
                        if (item.request === 'Jobs') day.Jobs += 1;
                        if (item.request === 'Orders') day.Orders += 1;
                    }
                });
                return dailyData.map(({ name, Sales, Jobs, Orders }) => ({ name, Sales, Jobs, Orders }));
            }
            case '1y': {
                const startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                filteredData = data.filter(item => new Date(item.rawDate) >= startDate);
                const monthlyData = Array.from({ length: 12 }, (_, i) => {
                    const monthIndex = (now.getMonth() + i + 1) % 12;
                    const year = now.getFullYear() - (monthIndex > now.getMonth() ? 1 : 0);
                    return { name: new Date(year, monthIndex).toLocaleString('default', { month: 'short' }), Sales: 0, Jobs: 0, Orders: 0, month: monthIndex, year };
                });

                filteredData.forEach(item => {
                    const itemMonth = new Date(item.rawDate).getMonth();
                    const itemYear = new Date(item.rawDate).getFullYear();
                    const month = monthlyData.find(m => m.month === itemMonth && m.year === itemYear);
                    if (month) {
                        month.Sales += item.amount;
                        if (item.request === 'Jobs') month.Jobs += 1;
                        if (item.request === 'Orders') month.Orders += 1;
                    }
                });
                return monthlyData.map(({ name, Sales, Jobs, Orders }) => ({ name, Sales, Jobs, Orders }));
            }
            case '5y':
            case 'To Date': {
                const startYear = now.getFullYear() - 4;
                const yearlyData = Array.from({ length: 5 }, (_, i) => ({
                    name: `${startYear + i}`, Sales: 0, Jobs: 0, Orders: 0
                }));
                const startDate = new Date(startYear, 0, 1);
                filteredData = data.filter(item => new Date(item.rawDate) >= startDate);

                filteredData.forEach(item => {
                    const year = new Date(item.rawDate).getFullYear().toString();
                    const yearData = yearlyData.find(y => y.name === year);
                    if (yearData) {
                        yearData.Sales += item.amount;
                        if (item.request === 'Jobs') yearData.Jobs += 1;
                        if (item.request === 'Orders') yearData.Orders += 1;
                    }
                });
                return yearlyData;
            }
            default: return [];
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            const toastId = toast.loading("Fetching sales data...");
            try {
                const response = await getSales(axiosInstance);

                if (!response.data || !response.data.jobRequests) {
                    throw new Error("Invalid response structure");
                }

                const { jobRequests, orders = [] } = response.data;

                const formattedJobs = jobRequests.map((job, index) => {
                    const cleanedJob = { ...job };
                    if (cleanedJob.assignedBid) {
                        delete cleanedJob.assignedBid.hibernateLazyInitializer;
                    }

                    const amount = job.assignedBid?.totalAmount || job.basePrice || 0;
                    let amtReceived = job.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
                    let receiptNo = job.payments?.[0]?.receiptNo || 'N/A';

                    if (amtReceived === 0 && job.assignedBid?.milestones) {
                        const paidMilestones = job.assignedBid.milestones.filter(m => m.paid);
                        if (paidMilestones.length > 0) {
                            amtReceived = paidMilestones.reduce((sum, m) => sum + m.amount, 0);
                            receiptNo = job.id;
                        }
                    }

                    return {
                        no: index + 1,
                        date: new Date(job.createdAt).toLocaleDateString('en-GB'),
                        rawDate: job.createdAt,
                        reqno: job.id,
                        request: 'Jobs',
                        managedBy: job.managedBy,
                        invoiceNo: job.payments?.[0]?.invoiceNo || job.id,
                        amount: amount,
                        receiptNo: receiptNo,
                        amtReceived: amtReceived,
                        customer: job.customer, // Pass customer data
                    };
                });

                const formattedOrders = orders.map((order, index) => ({
                    no: formattedJobs.length + index + 1,
                    date: new Date(order.createdAt).toLocaleDateString('en-GB'),
                    rawDate: order.createdAt,
                    reqno: order.orderId || order.id,
                    request: 'Orders',
                    managedBy: 'JaGedo',
                    invoiceNo: order.id,
                    amount: order.totalAmount || 0,
                    receiptNo: 'N/A',
                    amtReceived: order.paid ? order.totalAmount : 0,
                    customer: order.customer,
                }));

                const combinedData = [...formattedJobs, ...formattedOrders].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
                setAllSalesData(combinedData);
                processSalesData(combinedData);
                toast.success("Data loaded successfully", { id: toastId });
            } catch (error) {
                console.error("API Error:", error);
                toast.error(error.response?.data?.message || "Failed to fetch sales data", { id: toastId });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading && allSalesData.length > 0) {
            const toastId = toast.loading(`Loading chart data for ${selected}...`);
            setTimeout(() => {
                const newData = processChartData(allSalesData, selected);
                setChartData(newData);
                toast.success(`${selected} data loaded`, { id: toastId });
            }, 500);
            return () => toast.dismiss(toastId);
        }
    }, [selected, loading, allSalesData]);


    const handleRowClick = (rowData) => {
        setSelectedRow(rowData);
        setShowSalesModal(true);
    };

    const metricsData = metrics[selected] || [];

    return (
        <>
            <DashboardHeader />
            <div className="bg-gray-50 min-h-screen">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors mb-6"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Back to Dashboard
                    </button>

                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Analytics - Sales</h1>
                    <p className="text-gray-600 mb-8">Insights into sales data, total sales, sales by category, and trends over time.</p>

                    <div className="my-6">
                        <div className="flex items-center space-x-2 overflow-x-auto flex-nowrap py-2 scrollbar-hide">
                            {['To Date', '24h', '1w', '1m', '1y', '5y'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setSelected(range)}
                                    className={`px-4 py-2 cursor-pointer rounded-lg whitespace-nowrap text-sm font-medium ${selected === range ? 'bg-blue-800 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}>
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {metricsData.map((metric, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">{metric.title}</h3>
                                    <p className="text-2xl font-semibold text-gray-800">{metric.value || ""}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Sales Performance</h3>
                            <div className="w-full h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', borderColor: '#e5e7eb' }} />
                                        <Legend formatter={(value) => <span className="text-gray-700">{value}</span>} />
                                        <Line type="monotone" dataKey="Sales" stroke="#ff7300" strokeWidth={2} dot={{ r: 4, fill: '#ff7300' }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="Jobs" stroke="#8884d8" strokeWidth={2} dot={{ r: 4, fill: '#8884d8' }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="Orders" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4, fill: '#82ca9d' }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center p-4">Loading sales records...</div>
                        ) : (
                            <SalesTable data={allSalesData} onRowClick={handleRowClick} />
                        )}
                    </div>
                </main>
            </div>
            {showSalesModal && (
                <SalesInvoice
                    setShowSalesModal={() => setShowSalesModal(false)}
                    selectedRow={selectedRow}
                />
            )}
        </>
    );
};

export default Sales;