// src/stores/tasks.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskStatus } from '@/types/task'
// Importa las funciones de la API simulada
import { fetchTasks, createTask, updateTask, deleteTask } from '@/api/tasks'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const currentEditingTask = ref<Task | null>(null)
  const loading = ref(false) // Para indicar si una operación está en curso
  const error = ref<string | null>(null) // Para almacenar mensajes de error

  // --- Acciones asíncronas que simulan llamadas a la API ---

  const loadTasks = async () => {
    loading.value = true
    error.value = null // Limpiar errores previos
    const response = await fetchTasks()
    if (response.success && response.data) {
      tasks.value = response.data
    } else {
      error.value = response.error || 'Fallo al cargar las tareas.'
      console.error('Error loading tasks:', error.value)
    }
    loading.value = false
  }

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    loading.value = true
    error.value = null
    const response = await createTask(newTask)
    if (response.success && response.data) {
      tasks.value.push(response.data)
    } else {
      error.value = response.error || 'Fallo al añadir la tarea.'
      console.error('Error adding task:', error.value)
    }
    loading.value = false
  }

  const updateTask = async (updatedTask: Task) => {
    loading.value = true
    error.value = null
    const response = await updateTask(updatedTask)
    if (response.success && response.data) {
      const index = tasks.value.findIndex((task) => task.id === response.data!.id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
    } else {
      error.value = response.error || 'Fallo al actualizar la tarea.'
      console.error('Error updating task:', error.value)
    }
    loading.value = false
  }

  const deleteTask = async (id: string) => {
    loading.value = true
    error.value = null
    const response = await deleteTask(id)
    if (response.success) {
      tasks.value = tasks.value.filter((task) => task.id !== id)
    } else {
      error.value = response.error || 'Fallo al eliminar la tarea.'
      console.error('Error deleting task:', error.value)
    }
    loading.value = false
  }

  const setEditingTask = (task: Task | null) => {
    currentEditingTask.value = task
  }

  // --- Getters ---
  const allTasks = computed(() => tasks.value)

  const getTaskById = computed(() => (id: string) => {
    return tasks.value.find((task) => task.id === id)
  })

  // Cargar las tareas al inicializar el store
  // Podrías llamar a loadTasks en el onMounted de tu vista principal (TasksView)
  // para tener más control sobre cuándo se cargan los datos inicialmente.
  // Pero para este ejemplo, lo mantenemos aquí para simplicidad.
  loadTasks()

  return {
    tasks,
    currentEditingTask,
    loading,
    error,
    allTasks,
    getTaskById,
    loadTasks, // Expón loadTasks para recargar si es necesario
    addTask,
    updateTask,
    deleteTask,
    setEditingTask,
  }
})
