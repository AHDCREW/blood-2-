import React from 'react';
import { FaDownload, FaChartPie, FaChartLine, FaChartBar } from 'react-icons/fa';

export const ReportsManagement = () => {
  return (
    <div className="animate-fade-in-up pb-10">
      <div className="flex border-b border-gray-200 pb-2 mb-6 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-3">System Reports</h1>
        <button className="bg-white border border-gray-200 text-gray-700 font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
          <FaDownload /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
          <FaChartPie size={32} className="text-blue-500 mb-4" />
          <h2 className="text-lg font-bold text-gray-900">Demographics</h2>
          <p className="text-sm text-gray-500 mt-1">Donors by region, age group, and blood types.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
          <FaChartLine size={32} className="text-green-500 mb-4" />
          <h2 className="text-lg font-bold text-gray-900">Request Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Fulfillment rates, emergency response times.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
          <FaChartBar size={32} className="text-purple-500 mb-4" />
          <h2 className="text-lg font-bold text-gray-900">Camp Performance</h2>
          <p className="text-sm text-gray-500 mt-1">Total units collected per organized campaign.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="text-gray-300 mb-4">
          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Detailed Chart View</h3>
        <p className="text-gray-500 max-w-md">
          A charting library like Recharts or Chart.js would be implemented here to show visual curves of the selected report metric over time.
        </p>
      </div>
    </div>
  );
};
