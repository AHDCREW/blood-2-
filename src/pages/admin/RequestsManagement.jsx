import React from 'react';
import { FaSyringe, FaExclamationTriangle, FaCheckCircle, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

export const RequestsManagement = () => {
  const mockRequests = [
    { id: '101', patient: 'John Doe', hospital: 'City Care Hospital', group: 'O-', urgency: 'Critical', status: 'Pending', requestedAt: '2026-03-28 14:00' },
    { id: '102', patient: 'Emily Clark', hospital: 'St. Mary Clinics', group: 'A+', urgency: 'Urgent', status: 'Assigned', requestedAt: '2026-03-28 10:15' },
    { id: '103', patient: 'Robert Bruce', hospital: 'General Hospital', group: 'B+', urgency: 'Normal', status: 'Completed', requestedAt: '2026-03-27 16:45' },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex border-b border-gray-200 pb-2 mb-6 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          Blood Requests
        </h1>
        <div className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-red-200 shadow-sm cursor-pointer hover:bg-red-100 transition-colors">
          <FaExclamationTriangle /> 1 Critical Need
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-200 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex justify-between">
            Active Request Queue
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">Sort: Urgency</span>
          </h2>
          <div className="space-y-4">
            {mockRequests.map((req) => (
              <div key={req.id} className={`p-4 rounded-xl border relative overflow-hidden transition-colors ${req.urgency === 'Critical' ? 'border-red-200 bg-red-50/50' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                {req.urgency === 'Critical' && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl shadow-sm">Critical</div>
                )}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center font-bold text-xl text-primary shrink-0 border border-red-200 shadow-inner">
                      {req.group}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{req.patient}</h3>
                      <div className="text-sm text-gray-600 font-medium flex flex-col gap-1 mt-1">
                        <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-gray-400"/> {req.hospital}</span>
                        <span className="text-xs text-gray-400">Req ID: #{req.id} | {req.requestedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col justify-between items-end gap-2 shrink-0">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      req.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      req.status === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {req.status}
                    </span>
                    <button className="bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 font-semibold text-sm px-4 py-2 rounded-lg transition-colors text-primary active:scale-[0.98]">
                      Assign Donor
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Assignment / Actions Sidebar */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Fast Actions</h3>
          <ul className="space-y-3">
            <li>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-red-700 rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-100">
                <span className="flex items-center gap-2"><FaExclamationTriangle /> Broadcast SOS</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors border border-gray-200">
                <span className="flex items-center gap-2"><FaPhoneAlt className="text-primary" /> Contact Hospital</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-xl font-bold hover:bg-green-100 transition-colors border border-green-200">
                <span className="flex items-center gap-2"><FaCheckCircle /> Mark Request Complete</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
