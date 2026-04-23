import { useState } from 'react';
import apiClient from '../../api/client';
import { BLOOD_GROUPS } from '../../utils/bloodGroups';
import { LocationButton } from '../ui/LocationButton';

const phoneRegex = /^[+]?[\d\s-]{10,}$/;
const URGENCY_LEVELS = ['Critical', 'Urgent', 'Normal'];

export function BloodRequestForm() {
  const [form, setForm] = useState({
    patientName: '',
    bloodGroup: '',
    hospitalName: '',
    city: '',
    contactNumber: '',
    urgency: 'Normal',
    lat: '',
    lng: '',
    requesterEmail: '',
    additionalNotes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [donorsNotified, setDonorsNotified] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleLocation = (lat, lng) => {
    setForm((prev) => ({ ...prev, lat: String(lat), lng: String(lng) }));
  };

  const validate = () => {
    const e = {};
    if (!form.patientName?.trim()) e.patientName = 'Patient name is required.';
    if (!form.bloodGroup) e.bloodGroup = 'Blood group is required.';
    if (!form.hospitalName?.trim()) e.hospitalName = 'Hospital name is required.';
    if (!form.city?.trim()) e.city = 'City is required.';
    if (!form.contactNumber?.trim()) e.contactNumber = 'Contact number is required.';
    else if (!phoneRegex.test(form.contactNumber)) e.contactNumber = 'Invalid phone number.';
    if (!form.lat || !form.lng) e.location = 'Please detect your location.';
    if (!form.requesterEmail?.trim()) e.requesterEmail = 'Requester email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.requesterEmail)) e.requesterEmail = 'Invalid email.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitted(false);
    try {
      const payload = {
        patient_name: form.patientName,
        blood_group: form.bloodGroup,
        hospital: form.hospitalName,
        city: form.city,
        contact: form.contactNumber,
        urgency: form.urgency.toLowerCase(),
        location: {
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng),
        },
        requester_email: form.requesterEmail,
        notes: form.additionalNotes || null,
      };
      const { data } = await apiClient.post('/api/requests/create', payload);
      setDonorsNotified(data?.notified_count ?? 0);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setDonorsNotified(0);
      // Don't set submitted to true on error so the user can fix the form
      setErrors({ location: 'Failed to submit request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const count = donorsNotified ?? 0;
    return (
      <div className="max-w-xl rounded-xl bg-surface border border-muted p-6 text-center animate-fade-in-up">
        <p className="text-green-500 text-lg font-medium">✅ Alert sent to {count} donors within 5km</p>
        <p className="text-textMuted mt-2">Donors near the location have been notified.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label htmlFor="req-patient" className="block text-sm font-medium text-textMuted mb-1">Patient Name *</label>
        <input id="req-patient" name="patientName" value={form.patientName} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent" />
        {errors.patientName && <p className="text-sm text-red-500 mt-1">{errors.patientName}</p>}
      </div>
      <div>
        <label htmlFor="req-blood" className="block text-sm font-medium text-textMuted mb-1">Blood Group Needed *</label>
        <select id="req-blood" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent">
          <option value="">Select</option>
          {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        {errors.bloodGroup && <p className="text-sm text-red-500 mt-1">{errors.bloodGroup}</p>}
      </div>
      <div>
        <label htmlFor="req-hospital" className="block text-sm font-medium text-textMuted mb-1">Hospital Name *</label>
        <input id="req-hospital" name="hospitalName" value={form.hospitalName} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent" />
        {errors.hospitalName && <p className="text-sm text-red-500 mt-1">{errors.hospitalName}</p>}
      </div>
      <div>
        <label htmlFor="req-city" className="block text-sm font-medium text-textMuted mb-1">City *</label>
        <input id="req-city" name="city" value={form.city} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent" />
        {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
      </div>
      <div>
        <label htmlFor="req-contact" className="block text-sm font-medium text-textMuted mb-1">Contact Number *</label>
        <input id="req-contact" name="contactNumber" type="tel" value={form.contactNumber} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent" />
        {errors.contactNumber && <p className="text-sm text-red-500 mt-1">{errors.contactNumber}</p>}
      </div>
      <div>
        <span className="block text-sm font-medium text-textMuted mb-2">Urgency Level *</span>
        <div className="flex gap-4 flex-wrap">
          {URGENCY_LEVELS.map((u) => (
            <label key={u} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="urgency" value={u} checked={form.urgency === u} onChange={handleChange} className="text-primary focus:ring-accent" />
              <span className="text-text">{u}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-textMuted mb-1">Location *</label>
        <LocationButton onLocation={handleLocation} disabled={loading} />
        {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
      </div>
      <div>
        <label htmlFor="req-email" className="block text-sm font-medium text-textMuted mb-1">Requester Email *</label>
        <input id="req-email" name="requesterEmail" type="email" value={form.requesterEmail} onChange={handleChange} required className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent" />
        {errors.requesterEmail && <p className="text-sm text-red-500 mt-1">{errors.requesterEmail}</p>}
      </div>
      <div>
        <label htmlFor="req-notes" className="block text-sm font-medium text-textMuted mb-1">Additional Notes (optional)</label>
        <textarea id="req-notes" name="additionalNotes" value={form.additionalNotes} onChange={handleChange} rows={3} className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent resize-none" />
      </div>
      <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent">
        {loading ? 'Submitting…' : 'Submit Request'}
      </button>
    </form>
  );
}
