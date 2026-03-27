import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import { useAuthStore } from '../../store/authStore';

const MainLayout = () => {
  const user = useAuthStore((state) => state.user);
  const displayName = user?.name || 'ผู้ใช้งาน';
  const displayRole = user?.role || 'guest';
  const avatarText = displayName.trim().charAt(0) || 'U';

  return (
    <div className="flex min-h-screen">
      {/* ส่วนเมนูด้านข้างที่จะเปลี่ยนตาม Role */}
      <Sidebar /> 
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-stone-300/60 bg-white/75 backdrop-blur-sm flex items-center px-8 justify-end">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-600 to-amber-500 text-white flex items-center justify-center font-semibold">{avatarText}</div>
            <span className="font-medium text-sm text-stone-700">{displayName} ({displayRole})</span>
          </div>
        </header>
        
        <main className="p-8 bg-gradient-to-b from-transparent to-white/30 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;