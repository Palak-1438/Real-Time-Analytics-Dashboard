import React, { useEffect, useState } from 'react';
import { DollarSign, Users, ShoppingBag, Activity } from 'lucide-react';
import KPICard from '../components/cards/KPICard';
import AreaChartComponent from '../components/charts/AreaChartComponent';
import BarChartComponent from '../components/charts/BarChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import DataTable from '../components/tables/DataTable';
import { useSocket } from '../hooks/useSocket';

// Mock Data for initial state
const initialRevenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

const trafficData = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 1398 },
  { name: 'Wed', value: 9800 },
  { name: 'Thu', value: 3908 },
  { name: 'Fri', value: 4800 },
  { name: 'Sat', value: 3800 },
  { name: 'Sun', value: 4300 },
];

const userDemographicsData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 300 },
];

const activeUsersData = [
  { name: '10am', value: 120 },
  { name: '11am', value: 230 },
  { name: '12pm', value: 340 },
  { name: '1pm', value: 250 },
  { name: '2pm', value: 400 },
  { name: '3pm', value: 450 },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: 120.50, status: 'Completed', date: '2023-10-01' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: 85.00, status: 'Processing', date: '2023-10-02' },
  { id: 'ORD-003', customer: 'Bob Johnson', amount: 210.75, status: 'Completed', date: '2023-10-03' },
  { id: 'ORD-004', customer: 'Alice Brown', amount: 45.20, status: 'Pending', date: '2023-10-04' },
  { id: 'ORD-005', customer: 'Charlie Davis', amount: 350.00, status: 'Completed', date: '2023-10-05' },
  { id: 'ORD-006', customer: 'Eva Green', amount: 15.99, status: 'Completed', date: '2023-10-06' },
];

const Dashboard = () => {
  const socket = useSocket();
  const [systemStats, setSystemStats] = useState({ cpuUsage: 0, memoryUsage: 0 });
  const [liveRevenue, setLiveRevenue] = useState(54230);
  const [revenueData, setRevenueData] = useState(initialRevenueData);

  useEffect(() => {
    if (socket) {
      socket.on('system:stats', (data) => {
        setSystemStats(data);
      });

      socket.on('revenue:update', (data) => {
        setLiveRevenue(prev => prev + data.amount);

        // Optionally update chart data in real-time
        setRevenueData(prev => {
          const newData = prev.map(item => ({...item}));
          newData[newData.length - 1].value += data.amount / 100; // Just for visual effect
          return newData;
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('system:stats');
        socket.off('revenue:update');
      }
    };
  }, [socket]);

  const tableColumns = [
    { key: 'id', header: 'Order ID' },
    { key: 'customer', header: 'Customer' },
    { key: 'amount', header: 'Amount', render: (val) => `$${val.toFixed(2)}` },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          val === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
          val === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          {val}
        </span>
      )
    },
    { key: 'date', header: 'Date' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <Activity className="w-4 h-4 text-green-500 animate-pulse" />
          <span className="text-gray-600 dark:text-gray-300">
            CPU: <span className="font-semibold text-gray-900 dark:text-white">{systemStats.cpuUsage}%</span> |
            Mem: <span className="font-semibold text-gray-900 dark:text-white">{systemStats.memoryUsage}%</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={`$${liveRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="12.5%"
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
        />
        <KPICard
          title="Active Users"
          value="2,420"
          icon={Users}
          trend="up"
          trendValue="5.2%"
          colorClass="bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
        />
        <KPICard
          title="Total Orders"
          value="1,210"
          icon={ShoppingBag}
          trend="down"
          trendValue="1.1%"
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
        />
        <KPICard
          title="Conversion Rate"
          value="3.8%"
          icon={Activity}
          trend="up"
          trendValue="0.8%"
          colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AreaChartComponent
          title="Revenue Over Time"
          data={revenueData}
          dataKey="value"
          color="#3b82f6"
        />
        <div className="col-span-full lg:col-span-1 space-y-6">
          <PieChartComponent
            title="User Devices"
            data={userDemographicsData}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartComponent
          title="Weekly Traffic"
          data={trafficData}
          dataKey="value"
          color="#8b5cf6"
        />
        <LineChartComponent
          title="Active Users (Today)"
          data={activeUsersData}
          dataKey="value"
          color="#10b981"
        />
      </div>

      {/* Data Table */}
      <div className="mt-6">
        <DataTable
          title="Recent Orders"
          columns={tableColumns}
          data={recentOrders}
        />
      </div>
    </div>
  );
};

export default Dashboard;
