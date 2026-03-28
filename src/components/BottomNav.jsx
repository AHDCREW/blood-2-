import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSearch, FaPlus, FaTint, FaUser } from 'react-icons/fa';

export const BottomNav = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: <FaHome size={24} /> },
    { name: 'Find Donor', path: '/find-donor', icon: <FaSearch size={24} /> },
    { name: 'Request Blood', path: '/request-blood', icon: <FaPlus size={24} /> },
    { name: 'Donate', path: '/donate', icon: <FaTint size={24} /> },
    { name: 'Profile', path: '/profile', icon: <FaUser size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-muted shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 pb-[env(safe-area-inset-bottom)] transition-all duration-300">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <li key={item.name} className="flex-1 w-full h-full">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full w-full space-y-1 transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-textMuted hover:text-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-medium leading-none">{item.name}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
