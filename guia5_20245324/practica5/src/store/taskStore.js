import { create } from 'zustand';

export const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  // filtros
  currentFilter: 'all',
  currentCategory: 'all',
  searchQuery: '',

  setTasks: (tasks) =>
    set({ tasks, loading: false, error: null }),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task]
    })),

  updateTask: (taskId, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updatedTask }
          : task
      )
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter(
        (task) => task.id !== taskId
      )
    })),

  setFilter: (filter) =>
    set({ currentFilter: filter }),

  setCategory: (category) =>
    set({ currentCategory: category }),

  setSearchQuery: (query) =>
    set({ searchQuery: query }),

  setLoading: (loading) =>
    set({ loading }),

  setError: (error) =>
    set({ error, loading: false })
}));