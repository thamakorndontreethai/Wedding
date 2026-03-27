import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-pink-600 mb-2">Wedding Planner</h1>
        <p className="text-center text-gray-500 mb-8">เข้าสู่ระบบเพื่อจัดการงานแต่งงานของคุณ</p>
        
        <form className="space-y-4" onSubmit={handleLogin}>
          <Input label="อีเมลผู้ใช้งาน" type="email" placeholder="example@ku.th" />
          <Input label="รหัสผ่าน" type="password" placeholder="••••••••" />
          <Button variant="primary" className="w-full" type="submit">เข้าสู่ระบบ</Button>
        </form>
        
        <div className="mt-6">
          <Button variant="primary" className="w-full" onClick={() => navigate('/register')}>
            สมัครสมาชิก
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;