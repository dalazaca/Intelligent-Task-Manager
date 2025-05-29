// src/api/tasks.ts
import type { Task } from '@/types/task'
import { v4 as uuidv4 } from 'uuid'

const LOCAL_STORAGE_KEY = 'tasks_spa'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

const simulateNetworkDelay = (ms: number = 500) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchTasks(): Promise<ApiResponse<Task[]>> {
  await simulateNetworkDelay()
  if (Math.random() < 0.2) {
    return { success: false, error: 'Error de red simulado al obtener tareas.' }
  }
  const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY)
  try {
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : []
    return { success: true, data: tasks }
  } catch (e) {
    console.error('Error al parsear tareas de localStorage:', e)
    return { success: false, error: 'Error interno al procesar datos.' }
  }
}

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
  const taskWithId: Task = { ...newTask, id: uuidv4() }
  tasks.push(taskWithId)
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks))
  return { success: true, data: taskWithId }
}

// NUEVA FUNCIÓN: createManyTasks
export async function createManyTasks(newTasks: Omit<Task, 'id'>[]): Promise<ApiResponse<Task[]>> {
  await simulateNetworkDelay()
  if (Math.random() < 0.1) {
    // Menor probabilidad de error para la carga masiva
    return { success: false, error: 'Error simulado al importar tareas.' }
  }
  const tasksResponse = await fetchTasks()
  if (!tasksResponse.success || !tasksResponse.data) {
    return {
      success: false,
      error: tasksResponse.error || 'No se pudieron cargar las tareas existentes para importar.',
    }
  }
  const tasks = tasksResponse.data
  const createdTasks: Task[] = []
  newTasks.forEach((newTask) => {
    const taskWithId: Task = { ...newTask, id: uuidv4() }
    tasks.push(taskWithId)
    createdTasks.push(taskWithId)
  })
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks))
  return { success: true, data: createdTasks }
}

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
