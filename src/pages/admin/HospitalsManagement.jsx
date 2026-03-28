import React from 'react';
import { FaHospital, FaPlus, FaSearch, FaMapMarkerAlt, FaPhoneAlt, FaTrash, FaEdit } from 'react-icons/fa';

export const HospitalsManagement = () => {
  const mockHospitals = [
    { id: 1, name: 'City General Hospital', location: 'Downtown', phone: '555-0101', emergencyContact: '555-0911', bloodUnits: 145 },
    { id: 2, name: 'St. Mary Clinics', location: 'Westside', phone: '555-0102', emergencyContact: '555-0912', bloodUnits: 82 },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Hospital Configuration</h1>
        <button className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl shadow border border-red-600 active:scale-[0.98] transition-all flex items-center gap-2">
          <FaPlus /> Add Hospital
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
         <div className="relative mb-6">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search hospitals..." 
              className="w-full sm:w-1/2 pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockHospitals.map(hospital => (
              <div key={hospital.id} className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-gray-50/50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-red-50 text-primary rounded-xl flex items-center justify-center border border-red-100"><FaHospital size={20} /></div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{hospital.name}</h3>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5"><FaMapMarkerAlt /> {hospital.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                      {hospital.bloodUnits} Units
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-4 text-sm text-gray-600 mb-4 bg-white p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2"><FaPhoneAlt className="text-primary/70"/> <span className="font-medium">{hospital.phone}</span></div>
                  <div className="flex items-center gap-2 text-red-600 font-bold border-l border-gray-200 pl-4"><span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest hidden sm:inline">SOS:</span> {hospital.emergencyContact}</div>
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-200 pt-3 mt-auto">
                  <button className="text-blue-600 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"><FaEdit /> Edit</button>
                  <button className="text-red-600 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"><FaTrash /> Delete</button>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};
