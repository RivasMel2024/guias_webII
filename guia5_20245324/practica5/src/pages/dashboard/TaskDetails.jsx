import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUIStore } from '../../store/uiStore';
import {
  getTaskById,
  updateTask,
  deleteTask
} from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import {
  formatDateTime,
  getDueDateLabel,
  isOverdue
} from '../../utils/dateHelpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TaskForm from '../../components/tasks/TaskForm';

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const theme = useUIStore((state) => state.theme);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    setLoading(true);

    const result = await getTaskById(taskId);

    if (result.success) {
      setTask(result.task);
    } else {
      navigate('/dashboard');
    }

    setLoading(false);
  };

  const handleToggleComplete = async () => {
    const result = await updateTask(taskId, {
      completed: !task.completed
    });

    if (result.success) {
      setTask({ ...task, completed: !task.completed });
      toast.success(
        task.completed 
          ? 'Tarea marcada como pendiente' 
          : 'Tarea completada'
      );
    } else {
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      const result = await deleteTask(taskId);

      if (result.success) {
        toast.success('Tarea eliminada correctamente');
        navigate('/dashboard');
      } else {
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (editing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <TaskForm
          taskToEdit={task}
          onClose={() => {
            setEditing(false);
            loadTask();
          }}
        />
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === task.category);
  const priority = PRIORITIES.find((p) => p.id === task.priority);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          Volver al Dashboard
        </Link>
      </div>

      <div className={`p-6 rounded-lg shadow-sm ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              {task.title}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium bg-${category.color}-100 text-${category.color}-800`}
              >
                {category.label}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium bg-${priority.color}-100 text-${priority.color}-800`}
              >
                {priority.label}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {task.completed ? 'Completada' : 'Pendiente'}
              </span>

              {task.dueDate && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isOverdue(task.dueDate, task.completed)
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  Vence: {getDueDateLabel(task.dueDate)}
                </span>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary"
            >
              Editar
            </button>

            <button
              onClick={handleDelete}
              className="btn-danger"
            >
              Eliminar
            </button>
          </div>
        </div>

        {/* Descripción */}
        <div className={`border-t pt-6 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Descripción
          </h2>

          <p className={`whitespace-pre-wrap ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {task.description || 'Sin descripción'}
          </p>
        </div>

        {/* Información adicional */}
        <div className={`border-t pt-6 mt-6 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Información adicional
          </h2>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Creada
              </dt>
              <dd className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                {formatDateTime(task.createdAt)}
              </dd>
            </div>

            {task.dueDate && (
              <div>
                <dt className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Fecha de vencimiento
                </dt>
                <dd className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                  {formatDateTime(task.dueDate)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Toggle completado */}
        <div className={`border-t pt-6 mt-6 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={handleToggleComplete}
            className={
              task.completed
                ? 'btn-secondary w-full'
                : 'btn-primary w-full'
            }
          >
            {task.completed
              ? 'Marcar como pendiente'
              : 'Marcar como completada'}
          </button>
        </div>
      </div>
    </div>
  );
}