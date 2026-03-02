import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';
import { useTasks } from '../../hooks/useTasks';

import TaskFilters from '../../components/tasks/TaskFilters';
import TaskList from '../../components/tasks/TaskList';
import TaskStats from '../../components/tasks/TaskStats';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const theme = useUIStore((state) => state.theme);

  const {
    tasks,
    currentFilter,
    currentCategory,
    searchQuery,
    loading
  } = useTaskStore();

  useTasks();

  const filteredTasks = tasks.filter((task) => {

    // Filtro por estado
    if (currentFilter === 'completed' && !task.completed) return false;
    if (currentFilter === 'pending' && task.completed) return false;

    // Filtro por categoría
    if (currentCategory !== 'all' && task.category !== currentCategory) return false;

    // Filtro por búsqueda (título o descripción)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDescription = task.description?.toLowerCase().includes(query);

      if (!matchesTitle && !matchesDescription) return false;
    }

    return true;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Bienvenido, {user?.displayName || 'Usuario'}
        </h1>

        <p className={`mt-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Tienes {tasks.filter(t => !t.completed).length} tareas pendientes
        </p>
      </div>

      {/* Estadísticas */}
      <TaskStats />

      {/* Filtros + búsqueda */}
      <TaskFilters />

      {/* Lista */}
      <TaskList tasks={filteredTasks} />

    </div>
  );
}