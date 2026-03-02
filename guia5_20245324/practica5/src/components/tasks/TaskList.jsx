import { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

export default function TaskList({ tasks }) {
  const theme = useUIStore((state) => state.theme);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>

      {/* Header con contador y botón */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Mis Tareas ({tasks.length})
        </h2>

        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          + Nueva Tarea
        </button>
      </div>

      {/* Formulario de nueva tarea (condicional) */}
      {showForm && (
        <div className="mb-6">
          <TaskForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Lista de tareas o mensaje vacío */}
      {tasks.length === 0 ? (
        <div className={`p-6 rounded-lg shadow-sm text-center py-12 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No hay tareas para mostrar
          </p>
          <p className={`mt-2 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Crea una nueva tarea para comenzar
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}
        </div>
      )}

    </div>
  );
}