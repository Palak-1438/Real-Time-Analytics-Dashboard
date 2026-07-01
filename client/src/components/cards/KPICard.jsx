import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../utils/cn';

const KPICard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          </div>
          <div className={cn("p-3 rounded-full", colorClass)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={cn("font-medium", trend === 'up' ? 'text-green-500' : 'text-red-500')}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
