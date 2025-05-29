// src/stores/tasks.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '@/types/task'
import { fetchTasks, createTask, changeTask, removeTask, createManyTasks } from '@/api/tasks' // Importar createManyTasks
import { useToast } from '@/composables/useToast'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const currentEditingTask = ref<Task | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { showErrorToast, showSuccessToast } = useToast()

  const allTasks = computed(() => tasks.value)

  const getTaskById = computed(() => (id: string) => {
    return tasks.value.find((task) => task.id === id)
  })

  const loadTasks = async () => {
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
      showErrorToast(e.message || 'Error inesperado al añadir la tarea.')
      console.error('Network or unexpected error adding task:', e)
    } finally {
      loading.value = false
    }
  }

  // NUEVA ACCIÓN: importTasksFromFile
  const importTasksFromFile = async (importedTasks: Omit<Task, 'id'>[]) => {
    loading.value = true
    error.value = null
    try {
      const response = await createManyTasks(importedTasks)
      if (response.success && response.data) {
        tasks.value.push(...response.data) // Añadir todas las tareas importadas
        showSuccessToast(`${response.data.length} tarea(s) importada(s) exitosamente.`)
      } else {
        error.value = response.error || 'Fallo al importar las tareas.'
        showErrorToast(error.value)
        console.error('Error importing tasks:', response.error)
      }
    } catch (e) {
      error.value = 'Error de conexión al importar tareas.'
      showErrorToast(e.message || 'Error inesperado al importar tareas.')
      console.error('Network or unexpected error importing tasks:', e)
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (updatedTask: Task) => {
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
      showErrorToast(e.message || 'Error inesperado al actualizar la tarea.')
      console.error('Network or unexpected error updating task:', e)
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id: string) => {
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
      showErrorToast(e.message || 'Error inesperado al eliminar la tarea.')
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
    importTasksFromFile, // Exportar la nueva acción
  }
})
