// src/api/tasks.ts
import type { Task } from '@/types/task' // Importa TaskPriority
import { v4 as uuidv4 } from 'uuid'

// Simula la base de datos en localStorage
const LOCAL_STORAGE_KEY = 'tasks_spa'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

const simulateNetworkDelay = (ms: number = 500) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * @function fetchTasks
 * @description Simula la obtención de todas las tareas desde el servidor.
 * Puede fallar un 20% de las veces para simular errores de red.
 */
export async function fetchTasks(): Promise<ApiResponse<Task[]>> {
  await simulateNetworkDelay()

  if (Math.random() < 0.2) {
    return { success: false, error: 'Error de red simulado al obtener tareas.' }
  }

  const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY)
  try {
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : []
    // Opcional: Si estás migrando datos viejos sin prioridad, puedes asignar una por defecto aquí
    // return { success: true, data: tasks.map(t => ({ ...t, priority: t.priority || 'Media' })) };
    return { success: true, data: tasks }
  } catch (e) {
    console.error('Error al parsear tareas de localStorage:', e)
    return { success: false, error: 'Error interno al procesar datos.' }
  }
}

/**
 * @function createTask
 * @description Simula la creación de una nueva tarea en el servidor.
 * Puede fallar un 15% de las veces.
 */
export async function createTask(newTask: Omit<Task, 'id'>): Promise<ApiResponse<Task>> {
  await simulateNetworkDelay()

  if (Math.random() < 0.15) {
    return { success: false, error: 'Error simulado al crear la tarea.' }
  }

  const tasksResponse = await fetchTasks()
  if (!tasksResponse.success || !tasksResponse.data) {
    return {
      success: false,
      error:
        tasksResponse.error || 'No se pudieron cargar las tareas existentes para crear una nueva.',
    }
  }

  const tasks = tasksResponse.data
  // Asegúrate de que newTask ya incluya priority desde el formulario.
  const taskWithId: Task = { ...newTask, id: uuidv4() }
  tasks.push(taskWithId)
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks))
  return { success: true, data: taskWithId }
}

/**
 * @function changeTask
 * @description Simula la actualización de una tarea existente en el servidor.
 * Puede fallar un 10% de las veces.
 */
export async function changeTask(updatedTask: Task): Promise<ApiResponse<Task>> {
  await simulateNetworkDelay()

  if (Math.random() < 0.1) {
    return { success: false, error: 'Error simulado al actualizar la tarea.' }
  }

  const tasksResponse = await fetchTasks()
  if (!tasksResponse.success || !tasksResponse.data) {
    return {
      success: false,
      error: tasksResponse.error || 'No se pudieron cargar las tareas existentes para actualizar.',
    }
  }

  const tasks = tasksResponse.data
  const index = tasks.findIndex((task) => task.id === updatedTask.id)
  if (index !== -1) {
    tasks[index] = updatedTask
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks))
    return { success: true, data: updatedTask }
  }
  return { success: false, error: 'Tarea no encontrada para actualizar.' }
}

/**
 * @function removeTask
 * @description Simula la eliminación de una tarea en el servidor.
 * Puede fallar un 5% de las veces.
 */
export async function removeTask(id: string): Promise<ApiResponse<string>> {
  await simulateNetworkDelay()

  if (Math.random() < 0.05) {
    return { success: false, error: 'Error simulado al eliminar la tarea.' }
  }

  const tasksResponse = await fetchTasks()
  if (!tasksResponse.success || !tasksResponse.data) {
    return {
      success: false,
      error: tasksResponse.error || 'No se pudieron cargar las tareas existentes para eliminar.',
    }
  }

  let tasks = tasksResponse.data
  const initialLength = tasks.length
  tasks = tasks.filter((task) => task.id !== id)

  if (tasks.length < initialLength) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks))
    return { success: true, data: id }
  }
  return { success: false, error: 'Tarea no encontrada para eliminar.' }
}
