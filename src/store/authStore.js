import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoggedIn: !!localStorage.getItem('token'),

  setAuth: (user, token, role) => {
    const userWithRole = { ...user, role };
    localStorage.setItem('user', JSON.stringify(userWithRole));
    localStorage.setItem('token', token);
    set({ user: userWithRole, token, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isLoggedIn: false });
  },
}));