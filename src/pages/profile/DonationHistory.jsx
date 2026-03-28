import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHistory, FaCheckCircle } from 'react-icons/fa';

export const DonationHistory = () => {
  const navigate = useNavigate();
  // Dummy history
  const history = [
    { id: 1, date: 'October 15, 2025', location: 'City Hospital', units: 1, status: 'Completed' },
    { id: 2, date: 'April 02, 2025', location: 'Mega Blood Drive', units: 1, status: 'Completed' },
  ];

  return (
    <div className="p-4 flex flex-col min-h-full animate-fade-in-up pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 bg-white">
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-gray-900 border-l-4 border-primary pl-3">Donation History</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((h, i) => (
              <div key={h.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <FaCheckCircle className="text-green-500" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{h.location}</h3>
                  <p className="text-sm font-medium text-gray-500">{h.date}</p>
                  <p className="text-xs font-bold text-primary mt-1">{h.units} Unit Donated</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <FaHistory size={48} className="mb-4 text-gray-200" />
            <p>You haven't made any donations yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
