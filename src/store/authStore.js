import { create } from 'zustand';

// จำลองสถานะ User (ในงานจริงจะดึงจาก API login)
export const useAuthStore = create((set) => ({
  user: {
    id: 'U001',
    name: 'สิรวิชญ์ ',
    role: 'admin', // 'admin', 'provider', 'customer'
  },
  isLoggedIn: true,
  logout: () => set({ user: null, isLoggedIn: false }),
}));