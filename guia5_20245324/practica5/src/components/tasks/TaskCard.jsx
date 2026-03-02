import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUIStore } from '../../store/uiStore';
import { updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES } from '../../utils/constants';
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers';

export default function TaskCard({ task }) {
    const theme = useUIStore((state) => state.theme);
    const category = CATEGORIES.find(c => c.id === task.category);

    const handleToggleComplete = async (e) => {
        e.preventDefault(); // Evitar que el Link navegue
        
        const result = await updateTask(task.id, {
            completed: !task.completed
        });

        if (result.success) {
            toast.success(
                task.completed 
                    ? 'Tarea marcada como pendiente' 
                    : 'Tarea completada'
            );
        } else {
            toast.error('Error al actualizar la tarea');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault(); // Evitar que el Link navegue
        
        if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            const result = await deleteTask(task.id);
            
            if (result.success) {
                toast.success('Tarea eliminada correctamente');
            } else {
                toast.error('Error al eliminar la tarea');
            }
        }
    };

    return (
        <Link to={`/tasks/${task.id}`} className="block">
            <div className={`p-4 rounded-lg shadow-sm hover:shadow-lg transition-all ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } ${
                task.completed ? 'opacity-60' : ''
            } ${
                isOverdue(task.dueDate, task.completed) ? 'border-2 border-red-500' : ''
            }`}>
                {/* Header con título y estado */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-lg font-semibold flex-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                        {task.title}
                    </h3>
                    
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        task.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {task.completed ? 'Completada' : 'Pendiente'}
                    </span>
                </div>

                {/* Descripción */}
                {task.description && (
                    <p className={`text-sm mb-3 line-clamp-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        {task.description}
                    </p>
                )}

                {/* Categoría y fecha */}
                <div className="flex items-center gap-3 mb-4">
                    {category && (
                        <span className={`text-xs px-3 py-1 rounded-full bg-${category.color}-100 text-${category.color}-800`}>
                            {category.label}
                        </span>
                    )}
                    
                    {task.dueDate && (
                        <span className={`text-xs ${
                            isOverdue(task.dueDate, task.completed) 
                                ? 'text-red-600 font-semibold' 
                                : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            📅 {getDueDateLabel(task.dueDate)}
                        </span>
                    )}
                </div>

                {/* Botones de acción */}
                <div className={`flex gap-2 pt-3 border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'  
                }`}>
                    <button
                        onClick={handleToggleComplete}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            task.completed
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    >
                        {task.completed ? '↩️ Marcar pendiente' : '✓ Completar'}
                    </button>
                    
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                    >
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        </Link>
    );
}
