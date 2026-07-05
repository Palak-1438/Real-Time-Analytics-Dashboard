import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

const initialRevenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

export const useDashboardData = () => {
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

        setRevenueData(prev => {
          const newData = prev.map(item => ({...item}));
          const REVENUE_DIVISOR = 100; // avoid magic number
          newData[newData.length - 1].value += data.amount / REVENUE_DIVISOR;
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

  return { systemStats, liveRevenue, revenueData };
};
