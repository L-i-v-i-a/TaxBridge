import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, trendColor }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-[#0D23AD]">
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <p className={`text-xs font-medium mt-3 ${trendColor || 'text-gray-500'}`}>
          {trend}
        </p>
      )}
    </div>
  );
};

export default StatsCard;