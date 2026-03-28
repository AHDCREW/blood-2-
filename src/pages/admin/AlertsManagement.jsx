import React, { useState } from 'react';
import { FaExclamationTriangle, FaSms, FaMobileAlt, FaEnvelopeOpenText, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const AlertsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [alertType, setAlertType] = useState('sms');

  const handleBroadcast = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Emergency alert broadcasted successfully!');
    }, 1500);
  };

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="flex border-b border-gray-200 pb-2 mb-6 items-center flex-wrap gap-4 justify-between">
        <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-red-500 pl-3">Emergency Alert System</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
            <FaExclamationTriangle className="text-red-500" /> Broadcast New Alert
          </h2>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button 
                type="button" 
                onClick={() => setAlertType('sms')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors ${alertType === 'sms' ? 'border-primary bg-red-50 text-primary' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}
              >
                <FaSms size={24} className="mb-1" /> SMS
              </button>
              <button 
                type="button" 
                onClick={() => setAlertType('push')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors ${alertType === 'push' ? 'border-primary bg-red-50 text-primary' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}
              >
                <FaMobileAlt size={24} className="mb-1" /> Push Notif
              </button>
              <button 
                type="button" 
                onClick={() => setAlertType('email')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors ${alertType === 'email' ? 'border-primary bg-red-50 text-primary' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}
              >
                <FaEnvelopeOpenText size={24} className="mb-1" /> Email
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Target Blood Group</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-primary font-medium appearance-none">
                <option value="ALL">All Donors</option>
                <option value="O+">O+ Donors Only</option>
                <option value="O-">O- Donors Only</option>
                <option value="A-">A- Donors Only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Target Location Radius</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:border-primary font-medium" placeholder="City or Zipcode (e.g., Kochi)" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Message Body</label>
              <textarea rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:border-primary font-medium resize-none text-sm text-gray-800" 
              defaultValue="URGENT: O+ blood needed immediately at Apollo Hospital, Kochi. Patient in critical condition. Reply YES to accept." />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-md border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all flex justify-center items-center gap-2 mt-4">
              {loading ? 'Sending...' : <><FaPaperPlane /> Dispatch Alert</>}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Broadcast History</h2>
          <ul className="space-y-3">
            {[
              { type: 'SMS', msg: 'A- blood needed at City General.', time: '2 hours ago', status: 'Delivered', color: 'green' },
              { type: 'Push', msg: 'Mega Blood Camp tomorrow!', time: '1 day ago', status: 'Sent', color: 'blue' },
              { type: 'Email', msg: 'Monthly donation statistics.', time: '1 week ago', status: 'Sent', color: 'blue' },
            ].map((b, i) => (
              <li key={i} className="flex flex-col bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm">
                <div className="flex justify-between items-start font-bold mb-1">
                  <span className="text-gray-900">{b.type} Alert</span>
                  <span className={`text-${b.color}-600 bg-${b.color}-100 px-2 py-0.5 rounded-md text-xs`}>{b.status}</span>
                </div>
                <p className="text-gray-600 mb-2 truncate">{b.msg}</p>
                <span className="text-xs text-gray-400 font-bold">{b.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
