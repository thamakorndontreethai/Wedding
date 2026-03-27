import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { demoAccounts, useAuthStore } from '../../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    const isSuccess = login({ email: normalizedEmail, password: normalizedPassword });
    if (!isSuccess) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง (ใช้บัญชีทดลองด้านล่าง)');
      return;
    }

    setError('');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-pink-600 mb-2">Wedding Planner</h1>
        <p className="text-center text-gray-500 mb-8">เข้าสู่ระบบเพื่อจัดการงานแต่งงานของคุณ</p>
        
        <form className="space-y-4" onSubmit={handleLogin}>
          <Input
            label="อีเมลผู้ใช้งาน"
            type="email"
            placeholder="example@ku.th"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            label="รหัสผ่าน"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button variant="primary" className="w-full" type="submit">เข้าสู่ระบบ</Button>
        </form>
        
        <div className="mt-6">
          <Button variant="primary" className="w-full" onClick={() => navigate('/register')}>
            สมัครสมาชิก
          </Button>
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
          <p className="font-semibold text-gray-800 mb-2">บัญชีทดลองสำหรับทดสอบระบบ</p>
          <div className="space-y-2 text-gray-700">
            {demoAccounts.map((account) => (
              <p key={account.id}>
                {account.role}: {account.email} / {account.password}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;