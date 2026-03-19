import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingSOS } from './components/layout/FloatingSOS';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { DonatePage } from './pages/DonatePage';
import { RequestPage } from './pages/RequestPage';
import { FindDonorsPage } from './pages/FindDonorsPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SOSPage } from './pages/SOSPage';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <FloatingSOS />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{ className: 'bg-surface border border-muted text-text' }} />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/donate" element={<Layout><ProtectedRoute><DonatePage /></ProtectedRoute></Layout>} />
            <Route path="/request" element={<Layout><RequestPage /></Layout>} />
            <Route path="/find-donors" element={<Layout><FindDonorsPage /></Layout>} />
            <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProtectedRoute><ProfilePage /></ProtectedRoute></Layout>} />
            <Route path="/sos" element={<SOSPage />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
