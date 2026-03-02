import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { logoutUser } from '../../services/authService';

export default function Navbar() {
  const { user, clearUser } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();

    if (result.success) {
      clearUser();
      navigate('/login');
    }
  };

  return (
    <nav
      className={`shadow-md transition-colors ${
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-white text-gray-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link
            to="/dashboard"
            className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            Task Manager Pro
          </Link>

          {/* Lado derecho */}
          <div className="flex items-center gap-4">

            {/* Usuario + botón tema */}
            <div className="flex items-center gap-2">
              <span>
                {user?.displayName || user?.email}
              </span>

              <button
                onClick={toggleTheme}
                className="btn-secondary text-sm"
              >
                {theme === 'dark' ? '☀' : '🌙'}
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Cerrar sesión
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}