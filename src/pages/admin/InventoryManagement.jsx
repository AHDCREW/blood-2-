import React from 'react';
import { FaNotesMedical, FaExclamationCircle } from 'react-icons/fa';

export const InventoryManagement = () => {
  const stock = [
    { group: 'O+', units: 450, status: 'Healthy' },
    { group: 'A+', units: 320, status: 'Healthy' },
    { group: 'B+', units: 210, status: 'Healthy' },
    { group: 'O-', units: 120, status: 'Low' },
    { group: 'AB+', units: 80, status: 'Healthy' },
    { group: 'A-', units: 50, status: 'Critical' },
    { group: 'B-', units: 30, status: 'Critical' },
    { group: 'AB-', units: 10, status: 'Critical' },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-3">Blood Inventory Control</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stock.map((item) => (
          <div key={item.group} className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${
            item.status === 'Critical' ? 'border-red-300' :
            item.status === 'Low' ? 'border-orange-300' : 'border-gray-200'
          }`}>
            {(item.status === 'Critical' || item.status === 'Low') && (
              <div className={`absolute top-0 right-0 px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-bl-xl ${item.status === 'Critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                {item.status}
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-2xl shrink-0 ${
                item.status === 'Critical' ? 'bg-red-100 text-red-600' :
                item.status === 'Low' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-700'
              }`}>
                {item.group}
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-gray-900 leading-none">{item.units}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Available Units</span>
              </div>
            </div>
            {item.status === 'Critical' && (
              <button className="mt-4 w-full bg-red-50 text-red-700 font-bold py-2 rounded-lg border border-red-100 hover:bg-red-100 hover:border-red-200 transition-colors flex justify-center items-center gap-2 text-sm">
                <FaExclamationCircle /> Broadcast Need
              </button>
            )}
             {item.status !== 'Critical' && (
              <button className="mt-4 w-full bg-gray-50 text-gray-700 font-bold py-2 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors text-sm">
                Update Stock
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
