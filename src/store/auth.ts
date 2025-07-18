import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setAuthenticated: (auth) => set({ isAuthenticated: auth }),
      logout: () => set({ isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
); 