import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* ส่วนเมนูด้านข้างที่จะเปลี่ยนตาม Role */}
      <Sidebar /> 
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex items-center px-8 justify-end">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center">น</div>
            <span className="font-medium text-sm">สิรวิชญ์ (admin)</span>
          </div>
        </header>
        
        <main className="p-8 bg-gray-50 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;