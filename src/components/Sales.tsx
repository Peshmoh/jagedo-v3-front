import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, LabelList, XAxis, YAxis, Tooltip, Legend } from "recharts";
import SalesTable from "./SalesTables";

const metrics = {
    'To Date': [
        { title: 'Total Jobs', value: "10,000" },
        { title: 'Total Orders', value: "12,000" },
        { title: 'Total Sales', value: "Ksh 600,000" },
    ],
    '24h': [
        { title: 'Total Jobs', value: "2" },
        { title: 'Total Orders', value: "4" },
        { title: 'Total Sales', value: "Ksh 11,213" },
    ],
    '1w': [
        { title: 'Total Jobs', value: "17" },
        { title: 'Total Orders', value: "21" },
        { title: 'Total Sales', value: "Ksh 53,000" },
    ],
    '1m': [
        { title: 'Total Jobs', value: "89" },
        { title: 'Total Orders', value: "90" },
        { title: 'Total Sales', value: "Ksh 101,000" },
    ],
    '1y': [
        { title: 'Total Jobs', value: "762" },
        { title: 'Total Orders', value: "899" },
        { title: 'Total Sales', value: "Ksh 300,000" },
    ],
    '5y': [
        { title: 'Total Jobs', value: "3,500" },
        { title: 'Total Orders', value: "4,200" },
        { title: 'Total Sales', value: "Ksh 1,600,000" },
    ]
};

const Sales = () => {
    const [selected, setSelected] = React.useState('To Date');
    const [chartData, setChartData] = React.useState([]);
    const metricsData = metrics[selected] || [];

    const generateTimeLabels = (filter) => {
    const now = new Date();

        switch (filter) {
            case "24h":
                return Array.from({ length: 24 }, (_, i) => `${i}:00`);
            case "1w":
                return Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);
            case "1m":
                return Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
            case "1y":
                return Array.from({ length: 12 }, (_, i) => new Date(now.getFullYear(), i).toLocaleString('default', { month: 'short' }));
            case "5y":
                return Array.from({ length: 5 }, (_, i) => `${now.getFullYear() - 4 + i}`);
            case "To Date":
                return Array.from({ length: 5 }, (_, i) => `${now.getFullYear() - 4 + i}`);
            default:
                return Array.from({ length: 10 }, (_, i) => `Point ${i + 1}`);
        }
    };


    const generateLineData = (labels) => {
        let jobsBase = 5;
        let ordersBase = 3;
        let salesBase = 10;

        return labels.map((label) => {
            const jobsGrowth = Math.floor(Math.random() * 20) + 10;
            const ordersGrowth = Math.floor(Math.random() * 15) + 5;
            const salesGrowth = Math.floor(Math.random() * 50) + 20; // random sales growth 20-70

            jobsBase += jobsGrowth;
            ordersBase += ordersGrowth;
            salesBase += salesGrowth;

            return {
                name: label,
                Jobs: jobsBase,
                Orders: ordersBase,
                Sales: salesBase,
            };
        });
    };


    useEffect(() => {
        const toastId = toast.loading(`Loading data for ${selected}...`);

        const labels = generateTimeLabels(selected);

        setTimeout(() => {
            const newData = generateLineData(labels);
            setChartData(newData);
            toast.success(`${selected} data loaded`, { id: toastId });
        }, 800);

        // const data = generateLineData(labels);
        // setChartData(data);
    }, [selected]);

    return (
        <div className="flex flex-col w-full bg-white">
            <button
                    onClick={() => window.history.back()}
                    className="self-start mb-2 px-4 py-2 text-black rounded hover:text-blue-700 transition"
                >
                    ← Back to Dashboard
                </button>
            <main className="flex-1 p-6 bg-white min-h-screen mx-auto">
                <h1 className="text-2xl font-semibold mb-6">Analytics - Sales</h1>
                <p className="text-gray-600 mb-4">
                    This page provides insights into sales data, including total sales, sales by category, and sales trends over time.
                </p>

                {/* Date Filters */}
                <div className="flex items-center my-6">
                    <div className="space-x-2">
                        {['To Date', '24h', '1w', '1m', '1y', '5y'].map(range => (
                            <button
                                key={range}
                                onClick={() => setSelected(range)}
                                className={`px-4 py-2 cursor-pointer rounded-lg ${selected === range ? 'bg-[rgb(0,0,112)] text-white' : 'bg-gray-300 text-gray-800 hover:bg-blue-300'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {metricsData.map((metric, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200 cursor-pointer"
                            >
                                <h3 className="text-sm font-medium text-gray-500 mb-1">{metric.title}</h3>
                                <p className="text-2xl font-semibold">{metric.value || ""}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart Section */}
                <h3 className="text-lg font-semibold my-6">Sales Performance</h3>
                <div className="w-full my-6">
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData} margin={{ top: 20, right: 50, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend
                            formatter={(value) => {
                                if (value === "Sales") return "# Sales";
                                if (value === "Jobs") return "□ Jobs";
                                if (value === "Orders") return "✕ Orders";
                                return value;
                            }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Sales"
                                stroke="#ff7300"
                                strokeDasharray="5 5"
                                dot={{ stroke: '#000', strokeWidth: 2, r: 2 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Jobs"
                                stroke="#8884d8"
                                strokeDasharray="6 6"
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="Orders"
                                stroke="#82ca9d"
                                strokeDasharray="4 4"
                                dot={{ stroke: '#000', strokeWidth: 2, r: 2 }} // keeps dots light
                            >
                            {/* X Label for each point */}
                            <LabelList
                                dataKey="MS"
                                content={({ x, y }) => (
                                <text x={x} y={y} dy={-6} textAnchor="middle" fill="#000">
                                    ✕
                                </text>
                                )}
                            />
                            </Line>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <SalesTable />
            </main>
        </div>
    );
};

export default Sales;