import React from 'react';

const MetricsTable = ({ breakdown }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border space-y-4">
      <h3 className="text-md font-bold text-gray-700 uppercase tracking-wider border-b pb-2">Appointment Lifecycle Log Distribution Matrix</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50/50 p-4 rounded text-center border">
          <span className="text-xs font-semibold text-gray-400 block uppercase">Scheduled Waitlist</span>
          <span className="text-3xl font-extrabold text-blue-700">{breakdown?.scheduled || 0}</span>
        </div>
        <div className="bg-green-50/50 p-4 rounded text-center border">
          <span className="text-xs font-semibold text-gray-400 block uppercase">Completed Encounters</span>
          <span className="text-3xl font-extrabold text-green-700">{breakdown?.completed || 0}</span>
        </div>
        <div className="bg-red-50/50 p-4 rounded text-center border">
          <span className="text-xs font-semibold text-gray-400 block uppercase">Cancelled Drops</span>
          <span className="text-3xl font-extrabold text-red-700">{breakdown?.cancelled || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricsTable;