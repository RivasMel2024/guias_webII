import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';
import { isOverdue } from '../../utils/dateHelpers';

export default function TaskStats() {
    const tasks = useTaskStore((state) => state.tasks);
    const theme = useUIStore((state) => state.theme);

    // Calcular estadísticas
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const overdueTasks = tasks.filter(task => isOverdue(task.dueDate, task.completed)).length;
    
    // Porcentaje de completitud
    const completionPercentage = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0;

    const stats = [
        {
            label: 'Total de tareas',
            value: totalTasks,
            color: 'blue',
            icon: '📋'
        },
        {
            label: 'Completadas',
            value: completedTasks,
            color: 'green',
            icon: '✓'
        },
        {
            label: 'Pendientes',
            value: pendingTasks,
            color: 'yellow',
            icon: '⏳'
        },
        {
            label: 'Vencidas',
            value: overdueTasks,
            color: 'red',
            icon: '⚠️'
        }
    ];

    return (
        <div className="mb-6">
            {/* Grid de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {stats.map((stat, index) => (
                    <div 
                        key={index}
                        className={`p-4 rounded-lg shadow-sm border-l-4 border-${stat.color}-500 ${
                            theme === 'dark' 
                                ? 'bg-gray-800' 
                                : `bg-${stat.color}-50`
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {stat.label}
                                </p>
                                <p className={`text-3xl font-bold text-${stat.color}-600 mt-1`}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className="text-4xl opacity-50">
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Barra de progreso */}
            <div className={`p-4 rounded-lg shadow-sm ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        Porcentaje de completitud
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                        {completionPercentage}%
                    </span>
                </div>
                
                <div className={`w-full rounded-full h-4 overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${completionPercentage}%` }}
                    >
                    </div>
                </div>

                {totalTasks > 0 && (
                    <p className={`text-xs mt-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        {completedTasks} de {totalTasks} tareas completadas
                    </p>
                )}
            </div>
        </div>
    );
}
