import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // กำหนดเมนูตาม Role (ตรงตามขอบเขตงานที่คุณวางไว้)
  const menus = {
    customer: [
      { name: '🔍 ค้นหาสถานที่', path: '/search' },
      { name: '📅 การจองของฉัน', path: '/my-bookings' },
      { name: '💳 แจ้งชำระเงิน', path: '/payment' },
    ],
    admin: [
      { name: '📊 Dashboard', path: '/admin/dashboard' },
      { name: '📦 จัดการแพ็กเกจ', path: '/admin/packages' },
      { name: '✅ ตรวจสอบยอดเงิน', path: '/admin/verify-payment' },
    ],
    provider: [
      { name: '📋 รายการสั่งงาน', path: '/orders' },
      { name: '🗓️ ตารางคิวงาน', path: '/schedule' },
    ]
  };

  const userMenu = menus[user?.role] || [];

  return (
    <aside className="w-64 bg-gradient-to-b from-stone-900 via-stone-900 to-[#1f1a17] text-stone-100 min-h-screen p-4 flex flex-col border-r border-amber-800/30">
      <div className="mb-10 p-2 text-center">
        <h2 className="text-xl font-bold text-amber-300">Wedding Planner</h2>
        <p className="text-xs text-stone-400">KU Sriracha Project</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {userMenu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block p-3 rounded-lg transition-all ${
                  location.pathname === item.path 
                  ? 'bg-gradient-to-r from-rose-200 to-amber-200 text-stone-900 border border-rose-300/80 hover:from-rose-300 hover:to-amber-300 hover:-translate-y-0.5 focus-visible:ring-rose-300' 
                  : 'hover:bg-stone-800 text-stone-300'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t border-stone-700/60">
        <p className="text-xs text-stone-500 mb-2">Logged in as:</p>
        <p className="text-sm font-medium truncate">{user?.name} ({user?.role})</p>
        <button
          onClick={handleLogout}
          className="text-xs text-rose-400 hover:text-rose-300 mt-2"
        >
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;