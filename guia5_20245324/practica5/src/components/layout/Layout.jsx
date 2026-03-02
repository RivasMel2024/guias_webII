import { Outlet } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import Navbar from './Navbar';

export default function Layout() {
  const theme = useUIStore((state) => state.theme);

  return (
    <div className={`min-h-screen transition-colors ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Navbar />

      <main>
        {/* Outlet: aquí se renderizan las rutas hijas (Dashboard, TaskDetails, etc.) */}
        <Outlet />
      </main>
    </div>
  );
}