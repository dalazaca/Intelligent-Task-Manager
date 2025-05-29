// src/stores/tasks.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskStatus, TaskPriority } from '@/types/task' // Importa TaskPriority
import { fetchTasks, createTask, changeTask, removeTask } from '@/api/tasks'
import { useToast } from '@/composables/useToast'

export const useTaskStore = defineStore('tasks', () => {
  // 1. STATE (Estado Reactivo)
  const tasks = ref<Task[]>([])
  const currentEditingTask = ref<Task | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { showErrorToast, showSuccessToast } = useToast()

  // 2. GETTERS (Propiedades Calculadas)
  const allTasks = computed(() => tasks.value)

  const getTaskById = computed(() => (id: string) => {
    return tasks.value.find((task) => task.id === id)
  })

  // 3. ACTIONS (Funciones que modifican el estado o realizan operaciones asíncronas)

  const loadTasks = async () => {
    /* ... (Sin cambios funcionales, ya maneja Task con priority) ... */
    loading.value = true
    error.value = null
    try {
      const response = await fetchTasks()
      if (response.success && response.data) {
        tasks.value = response.data
      } else {
        error.value = response.error || 'Fallo al cargar las tareas.'
        showErrorToast(error.value)
        console.error('Error loading tasks:', response.error)
      }
    } catch (e) {
      error.value = 'Error de conexión al cargar tareas.'
      showErrorToast(error.value)
      console.error('Network or unexpected error loading tasks:', e)
    } finally {
      loading.value = false
    }
  }

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    /* ... (Sin cambios funcionales) ... */
    loading.value = true
    error.value = null
    try {
      const response = await createTask(newTask)
      if (response.success && response.data) {
        tasks.value.push(response.data)
        showSuccessToast('Tarea creada exitosamente.')
      } else {
        error.value = response.error || 'Fallo al añadir la tarea.'
        showErrorToast(error.value)
        console.error('Error adding task:', response.error)
      }
    } catch (e) {
      error.value = 'Error de conexión al añadir la tarea.'
      showErrorToast(error.value)
      console.error('Network or unexpected error adding task:', e)
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (updatedTask: Task) => {
    /* ... (Sin cambios funcionales) ... */
    loading.value = true
    error.value = null
    try {
      const response = await changeTask(updatedTask)
      if (response.success && response.data) {
        const index = tasks.value.findIndex((task) => task.id === response.data!.id)
        if (index !== -1) {
          tasks.value[index] = response.data
        }
        showSuccessToast('Tarea actualizada exitosamente.')
      } else {
        error.value = response.error || 'Fallo al actualizar la tarea.'
        showErrorToast(error.value)
        console.error('Error updating task:', response.error)
      }
    } catch (e) {
      error.value = 'Error de conexión al actualizar la tarea.'
      showErrorToast(error.value)
      console.error('Network or unexpected error updating task:', e)
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id: string) => {
    /* ... (Sin cambios funcionales) ... */
    loading.value = true
    error.value = null
    try {
      const response = await removeTask(id)
      if (response.success) {
        tasks.value = tasks.value.filter((task) => task.id !== id)
        showSuccessToast('Tarea eliminada exitosamente.')
      } else {
        error.value = response.error || 'Fallo al eliminar la tarea.'
        showErrorToast(error.value)
        console.error('Error deleting task:', response.error)
      }
    } catch (e) {
      error.value = 'Error de conexión al eliminar la tarea.'
      showErrorToast(error.value)
      console.error('Network or unexpected error deleting task:', e)
    } finally {
      loading.value = false
    }
  }

  const setEditingTask = (task: Task | null) => {
    currentEditingTask.value = task
  }

  loadTasks()

  return {
    tasks,
    currentEditingTask,
    loading,
    error,
    allTasks,
    getTaskById,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    setEditingTask,
  }
})
