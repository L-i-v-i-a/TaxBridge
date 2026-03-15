'use client';
import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { FilingStats } from '../../types/filings';

interface Props {
  stats: FilingStats;
}

const FilingStatsCards: React.FC<Props> = ({ stats }) => {
  const cards = [
    { title: 'Total Filings', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Under Review', value: stats.underReview, icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div key={card.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
          </div>
          <div className={`p-3 rounded-lg ${card.bg}`}>
            <card.icon className={`w-6 h-6 ${card.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilingStatsCards;