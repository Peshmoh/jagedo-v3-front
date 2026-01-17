import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { MapPin, Users, Briefcase, ShoppingCart, Globe, DollarSign } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const TimePeriodSelector: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select period" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="24h">24h</SelectItem>
      <SelectItem value="1w">1w</SelectItem>
      <SelectItem value="1m">1m</SelectItem>
      <SelectItem value="1y">1y</SelectItem>
      <SelectItem value="5y">5y</SelectItem>
      <SelectItem value="todate">To Date</SelectItem>
    </SelectContent>
  </Select>
);

// Customers Section
export const CustomersSection: React.FC<{ timePeriod: string }> = ({ timePeriod }) => {
  const customerTypeData = [
    { name: 'Individual', value: 92, count: 800000 },
    { name: 'Organization', value: 8, count: 69565 }
  ];

  const regionData = [
    { name: 'KE', value: 11 },
    { name: 'South Africa', value: 9 },
    { name: 'Nigeria', value: 9 },
    { name: 'Uganda', value: 12 },
    { name: 'Tanzania', value: 12 },
    { name: 'Germany', value: 14 },
    { name: 'Australia', value: 14 },
    { name: 'US', value: 4 },
    { name: 'UK', value: 6 },
    { name: 'Canada', value: 10 }
  ];

  const customerStats = [
    { item: 'No. of Customers with Draft Requests', count: 25 },
    { item: 'No. of Customers with Requests', count: 80 },
    { item: 'No. of Customers with Active Jobs', count: 60 },
    { item: 'No. of Customers with Completed Jobs', count: 40 },
    { item: 'No. of Customers with Reviewed', count: 30 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customers - All Customers</h2>
        <TimePeriodSelector value={timePeriod} onChange={() => {}} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Total Customers
            </CardTitle>
            <div className="text-3xl font-bold">300,000</div>
            <div className="text-green-600 text-sm">↑ 30%</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={customerTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {customerTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={regionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Activity Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerStats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{stat.item}</span>
                <span className="text-2xl font-bold text-blue-600">{stat.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Builders Section
export const BuildersSection: React.FC<{ timePeriod: string }> = ({ timePeriod }) => {
  const builderTypeData = [
    { name: 'Fundis', value: 26, color: '#0088FE' },
    { name: 'Professionals', value: 12, color: '#00C49F' },
    { name: 'Contractors', value: 11, color: '#FFBB28' },
    { name: 'Hardware', value: 52, color: '#FF8042' }
  ];

  const builderStats = [
    { item: 'No. of Builders with Draft Requests', count: 35 },
    { item: 'No. of Builders with Requests', count: 120 },
    { item: 'No. of Builders with Active Jobs', count: 85 },
    { item: 'No. of Builders with Completed Jobs', count: 65 },
    { item: 'No. of Builders with Reviewed', count: 45 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Builders - All Builders</h2>
        <TimePeriodSelector value={timePeriod} onChange={() => {}} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Total Builders
            </CardTitle>
            <div className="text-3xl font-bold">15,000</div>
            <div className="text-green-600 text-sm">↑ 10%</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Builder Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={builderTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {builderTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Builder Activity Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {builderStats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{stat.item}</span>
                <span className="text-2xl font-bold text-green-600">{stat.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Requests Section
export const RequestsSection: React.FC<{ timePeriod: string }> = ({ timePeriod }) => {
  const requestTypeData = [
    { name: 'Managed by Self', value: 16 },
    { name: 'Managed by JaGedo', value: 84 }
  ];

  const jobOrderData = [
    { name: 'Jobs', value: 30 },
    { name: 'Orders', value: 70 }
  ];

  const requestStats = [
    { status: 'Draft All', number: 14 },
    { status: 'New All', number: 14 },
    { status: 'All under Quotation', number: 44 },
    { status: 'Active All', number: 51 },
    { status: 'Completed All', number: 59 },
    { status: 'Reviewed All', number: 52 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics - All Requests</h2>
        <TimePeriodSelector value={timePeriod} onChange={() => {}} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Total Requests
            </CardTitle>
            <div className="text-3xl font-bold">450,000</div>
            <div className="text-green-600 text-sm">↑ 20%</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Management Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={requestTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {requestTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jobs vs Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={jobOrderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobOrderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index + 2]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="number" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Web Section
export const WebSection: React.FC<{ timePeriod: string }> = ({ timePeriod }) => {
  const countryData = [
    { name: 'United States', value: 40 },
    { name: 'Canada', value: 20 },
    { name: 'Germany', value: 15 },
    { name: 'South Africa', value: 5 },
    { name: 'United Kingdom', value: 5 },
    { name: 'Australia', value: 5 }
  ];

  const deviceData = [
    { name: 'Mobile', value: 40 },
    { name: 'Desktop', value: 45 },
    { name: 'Tablet', value: 10 },
    { name: 'Other', value: 5 }
  ];

  const specificDevices = [
    { name: 'iPhones', value: 80 },
    { name: 'Samsung', value: 160 },
    { name: 'Oppo', value: 120 },
    { name: 'Nokia', value: 90 },
    { name: 'Tecno', value: 200 },
    { name: 'Infinix', value: 180 },
    { name: 'Huawei', value: 110 },
    { name: 'Xiaomi', value: 150 },
    { name: 'Realme', value: 130 },
    { name: 'Vivo', value: 140 }
  ];

  const trafficSources = ['Facebook', 'Instagram', 'Tiktok', 'X', 'Google', 'LinkedIn', 'YouTube'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics - Web</h2>
        <TimePeriodSelector value={timePeriod} onChange={() => {}} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Visitors</CardTitle>
            <div className="text-2xl font-bold">3,000</div>
            <div className="text-green-600 text-sm">↑ 10%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <div className="text-2xl font-bold">1,500</div>
            <div className="text-green-600 text-sm">↑ 20%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <div className="text-2xl font-bold">23.20%</div>
            <div className="text-green-600 text-sm">↑ 10%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bounce Rate</CardTitle>
            <div className="text-2xl font-bold">12.89%</div>
            <div className="text-red-600 text-sm">↑ 30%</div>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{source}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.random() * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specific Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={specificDevices}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Sales Section
export const SalesSection: React.FC<{ timePeriod: string }> = ({ timePeriod }) => {
  const salesData = [
    { year: '2021', jaGedo: 25, self: 15 },
    { year: '2022', jaGedo: 50, self: 30 },
    { year: '2023', jaGedo: 75, self: 45 },
    { year: '2024', jaGedo: 100, self: 60 },
    { year: '2025', jaGedo: 85, self: 70 }
  ];

  const builderRevenueData = [
    { name: 'Hardware', value: 52 },
    { name: 'Fundis', value: 26 },
    { name: 'Professionals', value: 12 },
    { name: 'Contractors', value: 11 }
  ];

  const managementData = [
    { name: 'Managed by Self', value: 82 },
    { name: 'Managed by JaGedo', value: 18 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics - Sales</h2>
        <TimePeriodSelector value={timePeriod} onChange={() => {}} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Transaction Value</CardTitle>
            <div className="text-2xl font-bold">Ksh 330,000</div>
            <div className="text-green-600 text-sm">↑ 50%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <div className="text-2xl font-bold">Ksh 1,300,000</div>
            <div className="text-green-600 text-sm">↑ 20%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Commission Rate</CardTitle>
            <div className="text-2xl font-bold">23.20%</div>
            <div className="text-green-600 text-sm">↑ 5.49%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <div className="text-2xl font-bold">12.89%</div>
            <div className="text-green-600 text-sm">↑ 30.22%</div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="jaGedo" stroke="#8884d8" name="Managed by JaGedo" />
              <Line type="monotone" dataKey="self" stroke="#82ca9d" name="Managed by Self" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Builder Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={builderRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {builderRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Management Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={managementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {managementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index + 2]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>ARR</CardTitle>
            <div className="text-2xl font-bold">Ksh 600,000</div>
            <div className="text-green-600 text-sm">↑ 5.21%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ARPU</CardTitle>
            <div className="text-2xl font-bold">Ksh 18,000</div>
            <div className="text-green-600 text-sm">↑ 11.27%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Retention Rate</CardTitle>
            <div className="text-2xl font-bold">63.20%</div>
            <div className="text-green-600 text-sm">↑ 33.48%</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CLV</CardTitle>
            <div className="text-2xl font-bold">Ksh 60,000</div>
            <div className="text-green-600 text-sm">↑ 5.98%</div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
