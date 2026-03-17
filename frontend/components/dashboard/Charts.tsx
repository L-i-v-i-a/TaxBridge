'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartData, MonthlyData } from '../../types/dashboard';

interface StatusChartProps { data: ChartData[]; }
interface ActivityChartProps { data: MonthlyData[]; }

const COLORS = ['#0D23AD', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const FilingStatusChart: React.FC<StatusChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Filing Status Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const MonthlyActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Report Activity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="filings" fill="#0D23AD" radius={[4, 4, 0, 0]} name="Filings" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};