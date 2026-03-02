import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';
import { FILTERS, CATEGORIES } from '../../utils/constants';

export default function TaskFilters() {
    const theme = useUIStore((state) => state.theme);
    const {
        currentFilter,
        currentCategory,
        searchQuery,
        setFilter,
        setCategory,
        setSearchQuery
    } = useTaskStore();

    return (
        <div className={`p-4 rounded-lg shadow-sm mb-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>

        {/* 🔎 Buscador */}
        <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
            Buscar tareas
            </label>

            <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
            }`}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Filtro por estado */}
            <div>
            <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
                Filtrar por estado
            </label>

            <div className="flex gap-2">
                {FILTERS.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => setFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentFilter === filter.id
                        ? 'bg-blue-600 text-white'
                        : theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {filter.label}
                </button>
                ))}
            </div>
            </div>

            {/* Filtro por categoría */}
            <div>
            <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
                Filtrar por categoría
            </label>

            <select
                value={currentCategory}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
                <option value="all">Todas las categorías</option>

                {CATEGORIES.map((category) => (
                <option
                    key={category.id}
                    value={category.id}
                >
                    {category.label}
                </option>
                ))}
            </select>
            </div>

        </div>
        </div>
    );
}