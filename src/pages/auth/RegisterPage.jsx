import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState('customer');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleNameChange = (event) => {
    const sanitizedName = event.target.value.replace(/[0-9]/g, '');
    setFormData((prev) => ({ ...prev, fullName: sanitizedName }));
  };

  const handlePhoneChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, phone: digitsOnly }));
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-2 text-center">สร้างบัญชีผู้ใช้ใหม่</h1>
        <p className="text-gray-500 mb-6 text-center ">เลือกประเภทผู้ใช้งานเพื่อเริ่มต้น</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole('customer')}
            className={`p-4 border-2 rounded-xl font-bold transition-colors ${
              selectedRole === 'customer'
                ? 'border-pink-500 text-pink-600 bg-pink-50'
                : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
            }`}
          >
            ลูกค้า (คู่บ่าวสาว)
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('provider')}
            className={`p-4 border-2 rounded-xl font-bold transition-colors ${
              selectedRole === 'provider'
                ? 'border-pink-500 text-pink-600 bg-pink-50'
                : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
            }`}
          >
            ผู้ให้บริการ (Service Provider)
          </button>
        </div>

        <form className="grid grid-cols-2 gap-4" onSubmit={handleRegisterSubmit}>
          <Input
            label="ชื่อ-นามสกุล"
            value={formData.fullName}
            onChange={handleNameChange}
            required
          />
          <Input
            label="เบอร์โทรศัพท์"
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            required
            pattern="[0-9]+"
            maxLength={10}
            inputMode="numeric"
          />
          <div className="col-span-2">
            <Input
              label="อีเมล"
              type="email"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <Input
              label="รหัสผ่าน"
              type="password"
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
          </div>
          <Button variant="primary" className="col-span-2" type="submit">ยืนยันการสมัคร</Button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
            ย้อนกลับไปหน้า Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;