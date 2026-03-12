export const MOCK_STATS = {
  donors: 1284,
  livesSaved: 342,
  radiusKm: 5,
};

export const MOCK_DONORS = [
  { id: '1', name: 'Rahul M.', bloodGroup: 'O+', distanceKm: 1.2, lastActive: '2024-03-10', available: true },
  { id: '2', name: 'Priya S.', bloodGroup: 'A+', distanceKm: 2.8, lastActive: '2024-03-09', available: true },
  { id: '3', name: 'Vikram K.', bloodGroup: 'B+', distanceKm: 3.1, lastActive: '2024-03-08', available: false },
  { id: '4', name: 'Anita R.', bloodGroup: 'O-', distanceKm: 4.5, lastActive: '2024-03-11', available: true },
  { id: '5', name: 'Suresh P.', bloodGroup: 'AB+', distanceKm: 2.0, lastActive: '2024-03-07', available: true },
];

export const MOCK_BLOOD_AVAILABILITY = {
  'A+': 14,
  'A-': 4,
  'B+': 8,
  'B-': 3,
  'O+': 18,
  'O-': 2,
  'AB+': 5,
  'AB-': 1,
};

export const MOCK_RECENT_REQUESTS = [
  { id: '1', patientName: 'Patient', bloodGroup: 'O+', hospital: 'City Hospital', urgency: 'Critical', status: 'Active', city: 'Mumbai' },
  { id: '2', patientName: 'Patient', bloodGroup: 'A-', hospital: 'General Hospital', urgency: 'Urgent', status: 'Active', city: 'Delhi' },
  { id: '3', patientName: 'Patient', bloodGroup: 'B+', hospital: 'Care Clinic', urgency: 'Normal', status: 'Fulfilled', city: 'Bangalore' },
];
