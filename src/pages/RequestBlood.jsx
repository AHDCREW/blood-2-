import React, { useState, useEffect } from 'react';
import { BloodRequestCard } from '../components/BloodRequestCard';
import { FaHospital, FaNotesMedical, FaUserInjured, FaExclamationTriangle, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import apiClient from '../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const RequestBlood = () => {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'new'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    patient_name: '',
    blood_group: '',
    hospital: '',
    city: '',
    contact: '',
    urgency: 'normal',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  // AuthContext to get requester_email
  const { user } = useAuth() || {};

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Fetching recent requests from backend
      const res = await apiClient.get('/api/requests/recent');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load emergency board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setGroup = (bg) => {
    setFormData({ ...formData, blood_group: bg });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.blood_group) {
      toast.error('Please select a blood group');
      return;
    }

    setSubmitting(true);
    try {
      // Get dummy location for now (in production, use Geolocation API)
      const location = { lat: 9.9312, lng: 76.2673 }; // Kochi dummy

      const payload = {
        ...formData,
        location,
        requester_email: user?.email || 'anonymous@example.com'
      };

      await apiClient.post('/api/requests/create', payload);
      toast.success('Blood request broadcasted successfully!');
      
      // Reset form and switch to board
      setFormData({
        patient_name: '', blood_group: '', hospital: '', city: '', contact: '', urgency: 'normal', notes: ''
      });
      setActiveTab('requests');
      fetchRequests();
    } catch (err) {
      console.error(err);
      // toast is handled by interceptor, but we can catch
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 flex flex-col min-h-full animate-fade-in-up">
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Blood Requests</h1>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6 shadow-inner">
        <button 
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'requests' ? 'bg-white text-primary shadow' : 'text-gray-500'}`}
        >
          Emergency Board
        </button>
        <button 
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'new' ? 'bg-white text-primary shadow' : 'text-gray-500'}`}
        >
          New Request
        </button>
      </div>

      {activeTab === 'requests' ? (
        <div className="flex flex-col gap-4 pb-20">
          {loading ? (
             <div className="flex justify-center py-10">
               <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : requests.length > 0 ? (
            requests.map(req => (
              <BloodRequestCard key={req.id} request={{
                id: req.id,
                patientName: req.patient_name,
                bloodGroup: req.blood_group,
                hospital: req.hospital + ', ' + req.city,
                urgency: req.urgency,
                requiredDate: req.created_at ? new Date(req.created_at).toLocaleString() : 'ASAP'
              }} />
            ))
          ) : (
             <div className="text-center text-gray-500 mt-10">
               No active requests found.
             </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 pb-20 mb-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Patient Name</label>
              <div className="relative">
                <FaUserInjured className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="text" name="patient_name" value={formData.patient_name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" placeholder="Enter patient name" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Blood Group Required</label>
              <div className="grid grid-cols-4 gap-2">
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <button 
                    type="button" 
                    key={bg} 
                    onClick={() => setGroup(bg)}
                    className={`py-2.5 border rounded-xl font-bold transition-colors ${formData.blood_group === bg ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:bg-red-50 hover:text-primary'}`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Hospital / Clinic</label>
              <div className="relative">
                <FaHospital className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="text" name="hospital" value={formData.hospital} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" placeholder="Enter hospital name" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">City</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" placeholder="Enter city" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Contact Phone</label>
              <div className="relative">
                <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="tel" name="contact" value={formData.contact} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" placeholder="Your phone number" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Urgency Level</label>
              <div className="relative">
                <FaExclamationTriangle className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                <select required name="urgency" value={formData.urgency} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium appearance-none">
                  <option value="normal">Normal (Within 2-3 Days)</option>
                  <option value="urgent">Urgent (Within 24 Hours)</option>
                  <option value="critical">Critical (Immediate Need)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Medical Notes (Optional)</label>
              <div className="relative">
                <FaNotesMedical className="absolute left-4 top-4 text-gray-400" />
                <textarea rows="3" name="notes" value={formData.notes} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium resize-none" placeholder="Any specific instructions..."></textarea>
              </div>
            </div>

            <button disabled={submitting} type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow mt-6 active:scale-[0.98] transition-transform disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center">
              {submitting ? 'Broadcasting...' : 'Post Request'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
