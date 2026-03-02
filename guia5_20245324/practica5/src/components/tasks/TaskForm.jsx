import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { createTask, updateTask } from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';

export default function TaskForm({ onClose, taskToEdit = null }) {
    const user = useAuthStore((state) => state.user);
    const theme = useUIStore((state) => state.theme);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditing = !!taskToEdit;

    const defaultValues = taskToEdit
    ? {
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        category: taskToEdit.category,
        priority: taskToEdit.priority,
        dueDate: taskToEdit.dueDate
          ? taskToEdit.dueDate.toISOString().split('T')[0]
          : ''
      }
    : {
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        dueDate: ''
      };

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        // Convertir fecha correctamente para evitar problemas de zona horaria
        let dueDateConverted = null;
        if (data.dueDate) {
            // Agregar tiempo para asegurar que sea la fecha correcta en zona local
            dueDateConverted = new Date(data.dueDate + 'T12:00:00');
        }

        const taskData = {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        dueDate: dueDateConverted
        };

        console.log('Datos a enviar:', taskData);
        console.log('Fecha original:', data.dueDate);
        console.log('Fecha convertida:', dueDateConverted);

        let result;

        if (isEditing) {
        result = await updateTask(taskToEdit.id, taskData);
        } else {
        result = await createTask(user.uid, taskData);
        }

        if (result.success) {
        toast.success(
            isEditing
            ? 'Tarea actualizada correctamente'
            : 'Tarea creada correctamente'
        );
        onClose();
        } else {
        toast.error(
            isEditing
            ? 'Error al actualizar la tarea'
            : 'Error al crear la tarea'
        );
        setError('Ocurrió un error inesperado');
        }

        setLoading(false);
    };

    return (
        <div className={`p-6 rounded-lg shadow-sm ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
            {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
            </h3>
            <button
            onClick={onClose}
            className={`text-2xl ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
            >
            &times;
            </button>
        </div>

        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
            <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
                Título *
            </label>
            <input
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                }`}
                {...register('title', {
                required: 'El título es obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                })}
            />
            {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
                </p>
            )}
            </div>

            <div>
            <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
                Descripción
            </label>
            <textarea
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                }`}
                rows="3"
                {...register('description')}
            />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <select className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
            }`} {...register('category')}>
                {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                    {cat.label}
                </option>
                ))}
            </select>

            <select className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
            }`} {...register('priority')}>
                {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                    {p.label}
                </option>
                ))}
            </select>

            <input
                type="date"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                }`}
                {...register('dueDate')}
            />
            </div>

            <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
            </button>
            <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
            >
                {loading
                ? isEditing
                    ? 'Actualizando...'
                    : 'Guardando...'
                : isEditing
                ? 'Actualizar'
                : 'Crear Tarea'}
            </button>
            </div>
        </form>
        </div>
    );
}