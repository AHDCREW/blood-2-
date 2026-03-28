import React from 'react';
import { FaCampground, FaPlus, FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

export const CampsManagement = () => {
  const camps = [
    { id: 1, name: 'Mega Blood Drive 2026', date: 'April 15, 2026 - 10:00 AM', location: 'City Hall', participants: 450, status: 'Upcoming' },
    { id: 2, name: 'University Donation Camp', date: 'March 20, 2026 - 09:00 AM', location: 'Tech University Campus', participants: 850, status: 'Completed' },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-green-500 pl-3">Donation Camps</h1>
        <button className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl shadow transition-all flex items-center gap-2">
          <FaPlus /> Create Camp
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {camps.map(camp => (
          <div key={camp.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            {camp.status === 'Upcoming' && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                Upcoming
              </div>
            )}
            {camp.status === 'Completed' && (
              <div className="absolute top-0 right-0 bg-gray-300 text-gray-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                Completed
              </div>
            )}
            <div className="flex gap-4 items-start mb-4">
              <div className={`p-4 rounded-full flex items-center justify-center shrink-0 ${camp.status === 'Upcoming' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                <FaCampground size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{camp.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 font-medium"><FaCalendarAlt/> {camp.date}</div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-primary"/> <span>{camp.location}</span></div>
              <div className="flex items-center gap-2"><FaUsers className="text-blue-500"/> <span className="font-bold">{camp.participants} Expected/Registered</span></div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2 rounded-lg transition-colors text-sm">Edit Details</button>
              <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2 rounded-lg transition-colors text-sm">View Donors</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
