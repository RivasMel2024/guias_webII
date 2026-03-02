import { useUIStore } from '../../store/uiStore';

export default function LoadingSpinner() {
  const theme = useUIStore((state) => state.theme);

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="text-center">
        {/* Spinner animado con Tailwind */}
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>

        <p className={`mt-4 font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Cargando...
        </p>
      </div>
    </div>
  );
}