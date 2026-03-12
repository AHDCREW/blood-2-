import { useState } from 'react';
import apiClient from '../../api/client';
import { BLOOD_GROUPS } from '../../utils/bloodGroups';
import { LocationButton } from '../ui/LocationButton';
import { ConfirmationModal } from '../ui/ConfirmationModal';

const phoneRegex = /^[+]?[\d\s-]{10,}$/;

export function DonorRegisterForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    bloodGroup: '',
    city: '',
    lat: '',
    lng: '',
    lastDonatedDate: '',
    availableNow: true,
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, success: false, title: '', message: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleLocation = (lat, lng) => {
    setForm((prev) => ({ ...prev, lat: String(lat), lng: String(lng) }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName?.trim()) e.fullName = 'Full name is required.';
    if (!form.email?.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email.';
    if (!form.phone?.trim()) e.phone = 'Phone is required.';
    else if (!phoneRegex.test(form.phone)) e.phone = 'Invalid phone number.';
    if (!form.bloodGroup) e.bloodGroup = 'Blood group is required.';
    if (!form.city?.trim()) e.city = 'City is required.';
    if (!form.lat || !form.lng) e.location = 'Please detect your location.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await apiClient.post('/api/donors/register', {
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        blood_group: form.bloodGroup,
        city: form.city,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        last_donated_date: form.lastDonatedDate || null,
        available_now: form.availableNow,
      });
      setModal({ open: true, success: true, title: 'Registered', message: 'You are registered as a donor. Thank you!' });
      setForm({ fullName: '', email: '', phone: '', bloodGroup: '', city: '', lat: '', lng: '', lastDonatedDate: '', availableNow: true });
    } catch (err) {
      setModal({
        open: true,
        success: false,
        title: 'Error',
        message: err.response?.data?.message || 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label htmlFor="donor-name" className="block text-sm font-medium text-textMuted mb-1">Full Name *</label>
          <input
            id="donor-name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent"
          />
          {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="donor-email" className="block text-sm font-medium text-textMuted mb-1">Email *</label>
          <input
            id="donor-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="donor-phone" className="block text-sm font-medium text-textMuted mb-1">Phone *</label>
          <input
            id="donor-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent"
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="donor-blood" className="block text-sm font-medium text-textMuted mb-1">Blood Group *</label>
          <select
            id="donor-blood"
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent"
          >
            <option value="">Select</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.bloodGroup && <p className="text-sm text-red-500 mt-1">{errors.bloodGroup}</p>}
        </div>
        <div>
          <label htmlFor="donor-city" className="block text-sm font-medium text-textMuted mb-1">City *</label>
          <input
            id="donor-city"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent"
          />
          {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">Location *</label>
          <LocationButton onLocation={handleLocation} disabled={loading} />
          {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
        </div>
        <div>
          <label htmlFor="donor-last" className="block text-sm font-medium text-textMuted mb-1">Last Donated Date (optional)</label>
          <input
            id="donor-last"
            name="lastDonatedDate"
            type="date"
            value={form.lastDonatedDate}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-bg border border-muted text-text focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="donor-available"
            name="availableNow"
            type="checkbox"
            checked={form.availableNow}
            onChange={handleChange}
            className="rounded border-muted text-primary focus:ring-accent"
          />
          <label htmlFor="donor-available" className="text-sm text-textMuted">Available now</label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {loading ? 'Registering…' : 'Register as Donor'}
        </button>
      </form>

      <ConfirmationModal
        open={modal.open}
        onClose={closeModal}
        success={modal.success}
        title={modal.title}
        message={modal.message}
      />
    </>
  );
}
