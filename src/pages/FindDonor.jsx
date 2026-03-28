import React, { useState } from 'react';
import { DonorCard } from '../components/DonorCard';
import { FaSearch, FaMapMarkerAlt, FaTint } from 'react-icons/fa';

// Dummy data for design
const INITIAL_DONORS = [
  { id: 1, name: 'Alex Johnson', bloodGroup: 'O+', location: 'Downtown Medical Center (2.1km)', phone: '555-0101', isAvailable: true, rating: '4.9' },
  { id: 2, name: 'Sarah Miller', bloodGroup: 'A-', location: 'Westside Clinic (4.5km)', phone: '555-0102', isAvailable: false, rating: '4.7' },
  { id: 3, name: 'Michael Chen', bloodGroup: 'O-', location: 'City Hospital (1.2km)', phone: '555-0103', isAvailable: true, rating: '5.0' },
];

export const FindDonor = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [filteredDonors, setFilteredDonors] = useState(INITIAL_DONORS);

  const handleSearch = () => {
    const lowerLocation = location.toLowerCase();
    const results = INITIAL_DONORS.filter(donor => {
      const matchBlood = bloodGroup === '' || donor.bloodGroup === bloodGroup;
      const matchLocation = location === '' || donor.location.toLowerCase().includes(lowerLocation);
      return matchBlood && matchLocation;
    });
    setFilteredDonors(results);
  };


  return (
    <div className="p-4 flex flex-col min-h-full animate-fade-in-up">
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Find Donors</h1>
      
      {/* Search Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 mb-6 relative z-10">
        
        <div className="relative">
          <FaTint className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
          <select 
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          >
            <option value="">Any Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-gray-500"></div>
          </div>
        </div>

        <div className="relative">
          <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by location..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button 
          onClick={handleSearch}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 active:bg-red-700 shadow-sm transition-transform active:scale-[0.98]"
        >
          <FaSearch /> Search
        </button>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="font-semibold text-gray-800">Nearby Donors</h2>
        <span className="text-xs text-primary font-bold bg-primary/10 px-2.5 py-1 rounded-full">{filteredDonors.length} Found</span>
      </div>

      {/* Results List */}
      <div className="flex flex-col gap-4 pb-20">
        {filteredDonors.length > 0 ? (
          filteredDonors.map(donor => (
            <DonorCard key={donor.id} donor={donor} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3">
            <FaSearch className="text-4xl text-gray-300" />
            <p className="font-medium">No donors found matching your criteria.</p>
            <button 
              onClick={() => {
                setBloodGroup('');
                setLocation('');
                setFilteredDonors(INITIAL_DONORS);
              }}
              className="text-primary text-sm font-bold mt-2"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
