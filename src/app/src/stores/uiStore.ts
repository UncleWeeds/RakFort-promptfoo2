import { create } from 'zustand';

interface UIState {
  isNavbarVisible: boolean;
  isDrawerCollapsed: boolean;
  isSidebarOpen: boolean;
  // darkMode: boolean | null; // Remove darkMode

  // Toggle methods
  toggleNavbar: () => void;
  toggleDrawer: () => void;
  toggleSidebar: () => void;
  

  // Setters
  setNavbarVisible: (visible: boolean) => void;
  setDrawerCollapsed: (val: boolean) => void;
  setSidebarOpen: (val: boolean) => void;
  // setDarkMode: (mode: boolean | null) => void; // Remove setDarkMode
}

export const useUIStore = create<UIState>((set) => ({
  isNavbarVisible: true,
  isDrawerCollapsed: true,
  isSidebarOpen: false,
  // darkMode: null, // Remove darkMode

  toggleNavbar: () =>
    set((state) => ({ isNavbarVisible: !state.isNavbarVisible })),

  toggleDrawer: () =>
    set((state) => ({ isDrawerCollapsed: !state.isDrawerCollapsed })),

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Remove toggleDarkMode

  setNavbarVisible: (visible) => set({ isNavbarVisible: visible }),
  setDrawerCollapsed: (val) => set({ isDrawerCollapsed: val }),
  setSidebarOpen: (val) => set({ isSidebarOpen: val }),
  // setDarkMode: (mode: boolean | null) => set({ darkMode: mode }), // Remove setDarkMode
}));
