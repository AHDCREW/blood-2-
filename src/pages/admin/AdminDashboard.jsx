import React, { useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import {
  FaUsers, FaSyringe, FaHospital, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';

export const AdminDashboard = () => {
  const { stats, setStats, isLoading, setLoading } = useAdminStore();

  useEffect(() => {
    // Simulate fetching dashboard stats
    setLoading(true);
    setTimeout(() => {
      setStats({
        totalDonors: 1450,
        activeDonors: 1205,
        bloodRequests: 320,
        approvedRequests: 280,
        emergencyRequests: 15,
        hospitalsRegistered: 45,
        bloodGroupsCount: { 'A+': 320, 'O+': 450, 'B+': 210, 'AB+': 80, 'A-': 50, 'O-': 120, 'B-': 30, 'AB-': 10 }
      });
      setLoading(false);
    }, 800);
  }, [setLoading, setStats]);

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mt-1">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">System Overview</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Donors" value={stats.totalDonors} icon={<FaUsers size={24} />} color="blue" trend="+12% this month" />
            <StatCard title="Active Requests" value={stats.bloodRequests} icon={<FaSyringe size={24} />} color="purple" />
            <StatCard title="Emergencies" value={stats.emergencyRequests} icon={<FaExclamationTriangle size={24} />} color="red" trend="Requires Action" />
            <StatCard title="Hospitals" value={stats.hospitalsRegistered} icon={<FaHospital size={24} />} color="green" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Blood Groups Chart / Stats */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaSyringe className="text-primary" /> Blood Group Distribution
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(stats.bloodGroupsCount).map(([group, count]) => (
                  <div key={group} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-display text-primary mb-1">{group}</span>
                    <span className="text-sm font-semibold text-gray-600">{count} units</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" /> Recent Activity
              </h2>
              <ul className="space-y-4">
                {[
                  { text: 'A+ Blood dispatched to City Hospital', time: '10 mins ago' },
                  { text: 'New Emergency request from John Doe', time: '25 mins ago' },
                  { text: 'New Donor registered (O-)', time: '1 hr ago' },
                  { text: 'Request #8242 marked completed', time: '2 hrs ago' },
                ].map((item, idx) => (
                  <li key={idx} className="flex flex-col border-l-2 border-primary/30 pl-4 py-1">
                    <span className="text-sm font-medium text-gray-800">{item.text}</span>
                    <span className="text-xs text-gray-400 font-semibold">{item.time}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full mt-6 text-primary text-sm font-bold bg-red-50 py-2.5 rounded-xl hover:bg-red-100 transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
