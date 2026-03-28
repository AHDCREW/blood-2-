import React, { useState } from 'react';
import { FaUser, FaTint, FaPhoneAlt, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

export const Donate = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in-up">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
        <p className="text-gray-600">Your profile has been updated. You are now visible to people seeking blood donations.</p>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col min-h-full animate-fade-in-up pb-24">
      <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-3xl p-6 text-white mb-6 shadow-md relative overflow-hidden">
        <FaTint className="absolute -right-4 -bottom-4 text-8xl text-red-400 opacity-30 rotate-12" />
        <h1 className="text-2xl font-display font-bold mb-2">Be a Hero</h1>
        <p className="text-sm opacity-90 leading-tight">Join our community of donors. Register to help people in emergencies.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Full Name</label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all" placeholder="Enter your name" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Blood Group</label>
          <div className="relative">
            <FaTint className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
            <select required className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium appearance-none transition-all">
              <option value="" disabled selected>Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Phone Number</label>
          <div className="relative">
            <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all" placeholder="+1 (555) 000-0000" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Location / Area</label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all" placeholder="City or Neighborhood" />
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500 flex items-start gap-2">
          <input type="checkbox" id="consent" required className="mt-0.5 accent-primary w-4 h-4 rounded" />
          <label htmlFor="consent" className="leading-tight">
            I confirm that I am eligible to donate blood and agree to share my contact information with those in need.
          </label>
        </div>

        <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow mt-2 hover:bg-red-700 active:scale-[0.98] transition-all">
          Register as Donor
        </button>
      </form>
    </div>
  );
};
