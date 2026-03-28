import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import {
  FaTachometerAlt, FaUsers, FaSyringe, FaHospital, FaNotesMedical,
  FaExclamationTriangle, FaMapMarkedAlt, FaCampground, FaChartBar,
  FaCog, FaSignOutAlt, FaBars, FaTimes, FaHeartbeat
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
  const { isSidebarOpen, toggleSidebar, setSidebarOpen } = useAdminStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth() || {};

  const handleLogout = async () => {
    if (logout) await logout();
    navigate('/admin/login');
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);

  // Ensure sidebar opens correctly if window resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: <FaTachometerAlt /> },
    { name: 'Donors', path: '/admin/donors', icon: <FaUsers /> },
    { name: 'Blood Requests', path: '/admin/requests', icon: <FaSyringe /> },
    { name: 'Hospitals', path: '/admin/hospitals', icon: <FaHospital /> },
    { name: 'Blood Inventory', path: '/admin/inventory', icon: <FaNotesMedical /> },
    { name: 'Emergency Alerts', path: '/admin/alerts', icon: <FaExclamationTriangle /> },
    { name: 'Map Management', path: '/admin/map', icon: <FaMapMarkedAlt /> },
    { name: 'Donation Camps', path: '/admin/camps', icon: <FaCampground /> },
    { name: 'Reports', path: '/admin/reports', icon: <FaChartBar /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 lg:overflow-hidden'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 h-16 shrink-0">
          <div className="flex items-center gap-2 text-primary">
            <FaHeartbeat size={24} />
            <span className="font-display font-bold text-xl text-gray-900 tracking-wide">Admin SOS</span>
          </div>
          <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={toggleSidebar}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin'} // Exact match for dashboard
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-red-50 text-primary' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen transition-all duration-300">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 transition-all">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <FaBars size={20} />
            </button>
            <h2 className="font-semibold text-gray-800 text-lg hidden sm:block">
              {navLinks.find(l => l.path === location.pathname)?.name || 'Admin Panel'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.displayName || 'Admin User'}</p>
              <p className="text-xs text-gray-500 whitespace-nowrap">Super Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20 shrink-0">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
