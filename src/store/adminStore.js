import { create } from 'zustand';

export const useAdminStore = create((set) => ({
  isSidebarOpen: window.innerWidth >= 1024,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  stats: {
    totalDonors: 0,
    activeDonors: 0,
    bloodRequests: 0,
    approvedRequests: 0,
    emergencyRequests: 0,
    hospitalsRegistered: 0,
    bloodGroupsCount: {
      'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
      'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0
    }
  },
  setStats: (stats) => set({ stats: { ...stats } }),
  
  recentActivity: [],
  setRecentActivity: (activity) => set({ recentActivity: activity }),

  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
