// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth'; // Import the correct user type


interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  // Update setUser signature
  setUser: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user, token) => {
        set({ user, token, isAuthenticated: true });
        // Note: Interceptor already handles adding token to headers
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Optional: Explicitly remove header if interceptor logic needs backup
        // delete apiClient.defaults.headers.common['Authorization'];
        // Note: The response interceptor might handle redirection already
        // if the logout was triggered by a 401. Manual redirect might still be needed
        // for explicit logout button clicks.
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);