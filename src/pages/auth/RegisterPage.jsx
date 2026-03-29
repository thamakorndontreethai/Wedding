import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore(); // ✅ ย้ายมาอยู่ในนี้
    const [role, setRole] = useState('customer');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', phone: '', email: '', password: '',
        serviceType: 'food',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'firstName' || name === 'lastName')
            setFormData(prev => ({ ...prev, [name]: value.replace(/[0-9]/g, '') }));
        else if (name === 'phone')
            setFormData(prev => ({ ...prev, phone: value.replace(/\D/g, '').slice(0, 10) }));
        else
            setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = role === 'customer'
                ? '/auth/register/customer'
                : '/auth/register/provider';

            const payload = role === 'customer'
                ? {
                    username: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email, password: formData.password, phone: formData.phone
                }
                : {
                    firstName: formData.firstName, lastName: formData.lastName,
                    email: formData.email, password: formData.password,
                    phone: formData.phone, serviceType: formData.serviceType
                };

            const { data } = await api.post(endpoint, payload);
            setAuth(data.user, data.token, role);
            navigate(role === 'customer' ? '/search' : '/provider/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-bg">
            <div className="auth-card" style={{ maxWidth: '520px' }}>

                <div className="auth-header">
                    <div className="auth-icon">🌸</div>
                    <h1>สร้างบัญชีใหม่</h1>
                    <p>เลือกประเภทผู้ใช้งานเพื่อเริ่มต้น</p>
                </div>

                <div className="auth-body">
                    <form onSubmit={handleSubmit}>

                        {/* Role */}
                        <div className="role-selector" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '20px' }}>
                            {[
                                { value: 'customer', label: '👫 ลูกค้า (คู่บ่าวสาว)' },
                                { value: 'provider', label: '🎵 ผู้ให้บริการ' },
                            ].map((r) => (
                                <button key={r.value} type="button"
                                    className={`role-btn ${role === r.value ? 'active' : ''}`}
                                    onClick={() => setRole(r.value)}>
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        {/* Name row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="input-group">
                                <label className="input-label">ชื่อ</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">👤</span>
                                    <input className="auth-input" name="firstName" placeholder="ชื่อ"
                                        value={formData.firstName} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">นามสกุล</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">👤</span>
                                    <input className="auth-input" name="lastName" placeholder="นามสกุล"
                                        value={formData.lastName} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">เบอร์โทร</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📱</span>
                                <input className="auth-input" name="phone" placeholder="0812345678"
                                    value={formData.phone} onChange={handleChange} inputMode="numeric" />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">อีเมล</label>
                            <div className="input-wrapper">
                                <span className="input-icon">✉️</span>
                                <input className="auth-input" type="email" name="email" placeholder="example@ku.th"
                                    value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">รหัสผ่าน</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input className="auth-input" type="password" name="password" placeholder="••••••••"
                                    value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Service type (provider only) */}
                        {role === 'provider' && (
                            <div className="input-group">
                                <label className="input-label">ประเภทบริการ</label>
                                <select className="auth-input" name="serviceType"
                                    value={formData.serviceType} onChange={handleChange}
                                    style={{ paddingLeft: '16px' }}>
                                    <option value="food">🍽️ อาหาร</option>
                                    <option value="music">🎵 วงดนตรี</option>
                                    <option value="photo">📷 ช่างภาพ</option>
                                </select>
                            </div>
                        )}

                        {error && <div className="auth-error">⚠️ {error}</div>}

                        <button className="auth-btn auth-btn-primary" type="submit" disabled={loading}>
                            {loading ? 'กำลังสมัคร...' : 'ยืนยันการสมัคร'}
                        </button>

                    </form>

                    <Link to="/login" className="auth-link">← ย้อนกลับไปหน้า Login</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;