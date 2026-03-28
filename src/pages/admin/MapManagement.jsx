import React from 'react';
import { FaMapMarkedAlt, FaMapPin, FaHospital, FaCampground } from 'react-icons/fa';

export const MapManagement = () => {
  return (
    <div className="animate-fade-in-up h-[calc(100vh-140px)] flex flex-col">
      <div className="flex border-b border-gray-200 pb-2 mb-4 items-center flex-wrap gap-4 justify-between shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-500 pl-3">Map Management</h1>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-700 font-bold py-1.5 px-3 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-50">
            <FaHospital className="text-red-500" /> Add Hospital Pin
          </button>
          <button className="bg-white border border-gray-200 text-gray-700 font-bold py-1.5 px-3 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-50">
            <FaCampground className="text-green-500" /> Add Camp
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col items-center justify-center">
        <FaMapMarkedAlt size={64} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-500 text-center">Interactive Map View Placeholder</h2>
        <p className="text-gray-400 text-sm max-w-sm text-center mt-2">
          Leaflet map configuration would render here. Enabling admins to drag and drop point of interests (Hospitals, Camps, Safe Zones) corresponding to OpenStreetMap data.
        </p>

        {/* Dummy Pins Overlay */}
        <div className="absolute top-1/4 left-1/3 flex flex-col items-center group cursor-pointer">
          <FaMapPin size={32} className="text-red-500 group-hover:-translate-y-2 transition-transform" />
          <div className="bg-white px-2 py-1 rounded shadow-lg text-xs font-bold mt-1">City Hospital</div>
        </div>
        <div className="absolute top-1/2 right-1/4 flex flex-col items-center group cursor-pointer">
          <FaMapPin size={32} className="text-green-500 group-hover:-translate-y-2 transition-transform" />
          <div className="bg-white px-2 py-1 rounded shadow-lg text-xs font-bold mt-1">Lions Club Camp</div>
        </div>
      </div>
    </div>
  );
};
