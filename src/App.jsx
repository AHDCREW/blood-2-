import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BloodAlertBanner } from './components/BloodAlertBanner';
import { useBloodRequests } from './hooks/useBloodRequests';

// PWA Use Components
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { FindDonor } from './pages/FindDonor';
import { RequestBlood } from './pages/RequestBlood';
import { Donate } from './pages/Donate';
import { Profile } from './pages/Profile';

// Profile Sub-pages
import { DonationHistory } from './pages/profile/DonationHistory';
import { SavedDonors } from './pages/profile/SavedDonors';
import { Settings } from './pages/profile/Settings';
import { Support } from './pages/profile/Support';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DonorsManagement } from './pages/admin/DonorsManagement';
import { RequestsManagement } from './pages/admin/RequestsManagement';
import { HospitalsManagement } from './pages/admin/HospitalsManagement';
import { InventoryManagement } from './pages/admin/InventoryManagement';
import { AlertsManagement } from './pages/admin/AlertsManagement';
import { MapManagement } from './pages/admin/MapManagement';
import { CampsManagement } from './pages/admin/CampsManagement';
import { ReportsManagement } from './pages/admin/ReportsManagement';
import { AdminAuth } from './pages/admin/AdminAuth';

// User Layout specifically for PWA
const UserLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); 
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="w-full flex flex-col min-h-[100dvh]">
      <Navbar />
      <div className="flex-1 w-full flex flex-col pt-14 pb-16 min-h-screen relative overflow-x-hidden bg-surface">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm transition-opacity duration-300">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className={`flex-1 flex flex-col w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

/**
 * GlobalAlertListener — mounted once inside BrowserRouter so it has access
 * to useNavigate (via BloodAlertBanner). Listens to Firestore in real-time
 * and shows a popup whenever a new blood request is posted by anyone.
 */
function GlobalAlertListener() {
  const { newAlert, clearAlert } = useBloodRequests();
  return <BloodAlertBanner request={newAlert} onClose={clearAlert} />;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{ className: 'bg-white rounded-xl shadow-lg border border-gray-100' }} />
      <BrowserRouter>
        <ErrorBoundary>
          {/* Global real-time emergency alert — shown on every page */}
          <GlobalAlertListener />

          <Routes>
            {/* User PWA Routes */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="find-donor" element={<FindDonor />} />
              <Route path="request-blood" element={<RequestBlood />} />
              <Route path="donate" element={<ProtectedRoute><Donate /></ProtectedRoute>} />
              <Route path="profile">
                <Route index element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="history" element={<ProtectedRoute><DonationHistory /></ProtectedRoute>} />
                <Route path="saved" element={<ProtectedRoute><SavedDonors /></ProtectedRoute>} />
                <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminAuth />} />
            
            {/* Protected Admin Array */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="donors" element={<DonorsManagement />} />
              <Route path="requests" element={<RequestsManagement />} />
              <Route path="hospitals" element={<HospitalsManagement />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="alerts" element={<AlertsManagement />} />
              <Route path="map" element={<MapManagement />} />
              <Route path="camps" element={<CampsManagement />} />
              <Route path="reports" element={<ReportsManagement />} />
              <Route path="settings" element={<div className="p-6"><h2>Admin Settings</h2></div>} />
            </Route>

          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
