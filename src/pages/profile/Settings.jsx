import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCog, FaBell, FaLock, FaUser } from 'react-icons/fa';

export const Settings = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(true);

  return (
    <div className="p-4 flex flex-col min-h-full animate-fade-in-up pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 bg-white">
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-gray-900 border-l-4 border-primary pl-3">App Settings</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><FaUser /></div>
            <div>
              <h3 className="font-bold text-gray-900">Profile Visibility</h3>
              <p className="text-xs text-gray-500">Allow donors to find my info</p>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </div>
        </div>

        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><FaBell /></div>
            <div>
              <h3 className="font-bold text-gray-900">Push Notifications</h3>
              <p className="text-xs text-gray-500">Alerts for blood emergencies</p>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer" onClick={() => setNotifs(!notifs)}>
            <div className={`w-11 h-6 bg-gray-200 rounded-full transition-all ${notifs ? 'bg-primary' : 'bg-gray-200'}`}>
              <div className={`bg-white border rounded-full h-5 w-5 mt-[2px] ml-[2px] transition-all ${notifs ? 'translate-x-[20px] border-primary' : 'border-gray-300'}`}></div>
            </div>
          </div>
        </div>

        <button className="flex justify-between items-center text-left hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><FaLock /></div>
            <div>
              <h3 className="font-bold text-gray-900">Security & Password</h3>
              <p className="text-xs text-gray-500">Update your account safety</p>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </button>
      </div>
    </div>
  );
};
