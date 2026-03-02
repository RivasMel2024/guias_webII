import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
  Timestamp
} from 'firebase/firestore';

import { db } from './firebase';

const TASKS_COLLECTION = 'tasks';

/**
 * Suscribirse a las tareas del usuario en tiempo real
 * @param {string} userId - ID del usuario
 * @param {function} callback - Función que se ejecuta cuando cambian las tareas
 * @returns {function} Función para desuscribirse
 */
export const subscribeToTasks = (userId, callback) => {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),

      createdAt: doc.data().createdAt?.toDate(),
      dueDate: doc.data().dueDate?.toDate()
    }))
    
    .sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt - a.createdAt;
    });

    callback(tasks);
  });
};

/**
 * Crear una nueva tarea
 */
export const createTask = async (userId, taskData) => {
  try {
    const taskDataWithTimestamp = {
      ...taskData,
      ...(taskData.dueDate && { dueDate: Timestamp.fromDate(taskData.dueDate) })
    };
    
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
      ...taskDataWithTimestamp,
      userId,
      completed: false,
      createdAt: serverTimestamp() 
    });

    return { success: true, id: docRef.id };

  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar una tarea existente
 */
export const updateTask = async (taskId, updates) => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    
    const updatesWithTimestamp = {
      ...updates
    };
    
    if ('dueDate' in updates) {
      updatesWithTimestamp.dueDate = updates.dueDate 
        ? Timestamp.fromDate(updates.dueDate) 
        : null;
    }
    
    await updateDoc(taskRef, updatesWithTimestamp);

    return { success: true };

  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Eliminar una tarea
 */
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
    return { success: true };

  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener una tarea específica por ID
 */
export const getTaskById = async (taskId) => {
  try {
    const taskDoc = await getDoc(doc(db, TASKS_COLLECTION, taskId));

    if (taskDoc.exists()) {
      return {
        success: true,
        task: {
          id: taskDoc.id,
          ...taskDoc.data(),
          createdAt: taskDoc.data().createdAt?.toDate(),
          dueDate: taskDoc.data().dueDate?.toDate()
        }
      };
    } else {
      return { success: false, error: 'Tarea no encontrada' };
    }

  } catch (error) {
    console.error('Error getting task:', error);
    return { success: false, error: error.message };
  }
};