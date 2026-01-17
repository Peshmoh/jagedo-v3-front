import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, ShoppingCart, Briefcase, Globe, DollarSign, Activity } from 'lucide-react';
import { CustomersSection, BuildersSection, RequestsSection, WebSection, SalesSection } from './components/AnalyticsSections';

// Initialize Google Analytics
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        {change}
      </p>
    </CardContent>
  </Card>
);

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

// Summary Section 
const SummarySection: React.FC<{ timePeriod: string }> = ({ timePeriod }) => {
  const trafficData = [
    { date: '7/26', sessions: 1200 },
    { date: '7/29', sessions: 1400 },
    { date: '8/1', sessions: 1600 },
    { date: '8/4', sessions: 1800 },
    { date: '8/7', sessions: 2000 },
    { date: '8/10', sessions: 1900 },
    { date: '8/13', sessions: 2200 },
    { date: '8/16', sessions: 2400 },
    { date: '8/19', sessions: 2100 },
    { date: '8/22', sessions: 2300 },
    { date: '8/25', sessions: 2500 },
    { date: '8/28', sessions: 2700 },
    { date: '8/31', sessions: 2600 },
    { date: '9/3', sessions: 2800 },
    { date: '9/6', sessions: 3000 },
    { date: '9/9', sessions: 2900 },
    { date: '9/12', sessions: 3100 },
    { date: '9/15', sessions: 3300 },
    { date: '9/18', sessions: 3200 },
    { date: '9/21', sessions: 3400 },
    { date: '9/24', sessions: 3600 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value="2,750"
          change="10%"
          trend="up"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Customers"
          value="1,200"
          change="20%"
          trend="up"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Builders"
          value="15,000"
          change="10%"
          trend="up"
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Requests"
          value="16,000"
          change="30%"
          trend="up"
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Jobs"
          value="5,000"
          change="5%"
          trend="up"
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Orders"
          value="1,575"
          change="10%"
          trend="up"
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Web Traffic"
          value="20,000"
          change="—"
          trend="up"
          icon={<Globe className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Sessions"
          value="0"
          change="—"
          trend="up"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <div className="flex justify-between items-center">
            <CardDescription>Website traffic over time</CardDescription>
            <TimePeriodSelector value={timePeriod} onChange={() => {}} />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="sessions" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Analytics() {
  const [timePeriod, setTimePeriod] = useState('1m');
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    // Track page view
    if (GA_MEASUREMENT_ID) {
      ReactGA.send({ hitType: 'pageview', page: '/admin/analytics' });
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <TimePeriodSelector value={timePeriod} onChange={setTimePeriod} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="builders">Builders</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="web">Web</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <SummarySection timePeriod={timePeriod} />
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <CustomersSection timePeriod={timePeriod} />
        </TabsContent>

        <TabsContent value="builders" className="space-y-6">
          <BuildersSection timePeriod={timePeriod} />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <RequestsSection timePeriod={timePeriod} />
        </TabsContent>

        <TabsContent value="web" className="space-y-6">
          <WebSection timePeriod={timePeriod} />
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <SalesSection timePeriod={timePeriod} />
        </TabsContent>
      </Tabs>
    </div>
  );
}