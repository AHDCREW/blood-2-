import React, { useState } from 'react';
import { FaSearch, FaFilter, FaCheck, FaBan, FaTrash, FaEdit } from 'react-icons/fa';

export const DonorsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy donor data
  const mockDonors = [
    { id: '1', name: 'Alex Johnson', email: 'alex@example.com', bloodGroup: 'O+', location: 'Downtown', status: 'approved', lastDonation: '2025-10-15' },
    { id: '2', name: 'Sarah Miller', email: 'sarah@example.com', bloodGroup: 'A-', location: 'Westside', status: 'pending', lastDonation: 'Never' },
    { id: '3', name: 'Michael Chen', email: 'mike@example.com', bloodGroup: 'O-', location: 'City Center', status: 'blocked', lastDonation: '2024-01-20' },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-200 pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Donor Management</h1>
        <button className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-red-400">
          + Add Donor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors">
            <FaFilter /> Filters
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Donation</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white font-medium">
              {mockDonors.map((donor) => (
                <tr key={donor.id} className="hover:bg-red-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{donor.name}</div>
                    <div className="text-xs text-gray-500">{donor.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center bg-red-100 text-primary font-bold w-10 h-10 rounded-full">
                      {donor.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4">{donor.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                      donor.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                      donor.status === 'blocked' ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}>
                      {donor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{donor.lastDonation}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100" title="Approve">
                        <FaCheck size={14} />
                      </button>
                      <button className="p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100" title="Block">
                        <FaBan size={14} />
                      </button>
                      <button className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100" title="Edit">
                        <FaEdit size={14} />
                      </button>
                      <button className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100" title="Delete">
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500 font-medium">
          <span>Showing 1 to 3 of 1205 donors</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
