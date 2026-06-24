import React from 'react';

const AnalyticsCards = ({ summaryData }) => {
  const cards = [
    { title: 'Registered Patient Core', value: summaryData?.totalPatients || 0, color: 'border-blue-600 text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Booked Sessions', value: summaryData?.totalAppointments || 0, color: 'border-purple-600 text-purple-600', bg: 'bg-purple-50' },
    { title: 'Gross Revenue Receipts', value: `₹${summaryData?.totalRevenueGenerated || 0}`, color: 'border-emerald-600 text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Outstanding Aging Balances', value: `₹${summaryData?.totalOutstandingDues || 0}`, color: 'border-rose-600 text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div key={i} className={`p-5 bg-white rounded-lg border-l-4 shadow-sm ${c.color} flex flex-col justify-between space-y-1`}>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{c.title}</span>
          <span className="text-2xl font-black text-gray-800">{c.value}</span>
          <div className={`text-2xs font-semibold px-1.5 py-0.5 rounded inline-block self-start ${c.bg}`}>Active Partition Segment</div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;