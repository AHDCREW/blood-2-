import React from 'react';

export const Navbar = () => {
  return (
    <header className="sticky top-0 w-full bg-primary text-white shadow-md z-40 h-14 flex items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-2">
        <span className="font-display font-bold tracking-wide text-xl">Blood SOS</span>
      </div>
    </header>
  );
};
