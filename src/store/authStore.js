import { create } from 'zustand';

export const demoAccounts = [
  {
    id: 'U001',
    name: 'แอดมินทดสอบ',
    role: 'admin',
    email: 'admin@test.com',
    password: 'Admin1234',
  },
  {
    id: 'U002',
    name: 'ลูกค้าทดสอบ',
    role: 'customer',
    email: 'customer@test.com',
    password: 'Customer1234',
  },
  {
    id: 'U003',
    name: 'ผู้ให้บริการทดสอบ',
    role: 'provider',
    email: 'provider@test.com',
    password: 'Provider1234',
  },
];

// จำลองสถานะ User (ในงานจริงจะดึงจาก API login)
export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  login: ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) return false;

    const matchedAccount = demoAccounts.find(
      (account) =>
        account.email.toLowerCase() === normalizedEmail &&
        account.password === normalizedPassword
    );

    if (!matchedAccount) return false;

    set({
      user: {
        id: matchedAccount.id,
        name: matchedAccount.name,
        role: matchedAccount.role,
      },
      isLoggedIn: true,
    });

    return true;
  },
  logout: () => set({ user: null, isLoggedIn: false }),
}));