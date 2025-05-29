import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '@/types/task'
import { fetchTasks, createTask, changeTask, removeTask } from '@/api/tasks'
import { useToast } from '@/composables/useToast'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const currentEditingTask = ref<Task | null>(null)
  const loading = ref(false)

  const { showErrorToast, showSuccessToast } = useToast()

  const loadTasks = async () => {
    loading.value = true
    const response = await fetchTasks()
    if (response.success && response.data) {
      tasks.value = response.data
    } else {
      showErrorToast(response.error || 'Fallo al cargar las tareas.')
      console.error('Error loading tasks:', response.error)
    }
    loading.value = false
  }

  const addTask = async (newTask: Omit<Task, 'id'>) => {
    loading.value = true
    const response = await createTask(newTask)
    if (response.success && response.data) {
      tasks.value.push(response.data)
      showSuccessToast('Tarea creada exitosamente.')
    } else {
      showErrorToast(response.error || 'Fallo al añadir la tarea.')
      console.error('Error adding task:', response.error)
    }
    loading.value = false
  }

  const updateTask = async (updatedTask: Task) => {
    loading.value = true
    const response = await changeTask(updatedTask)
    if (response.success && response.data) {
      const index = tasks.value.findIndex((task) => task.id === response.data!.id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      showSuccessToast('Tarea actualizada exitosamente.')
    } else {
      showErrorToast(response.error || 'Fallo al actualizar la tarea.')
      console.error('Error updating task:', response.error)
    }
    loading.value = false
  }

  const deleteTask = async (id: string) => {
    loading.value = true
    const response = await removeTask(id)
    if (response.success) {
      tasks.value = tasks.value.filter((task) => task.id !== id)
      showSuccessToast('Tarea eliminada exitosamente.')
    } else {
      showErrorToast(response.error || 'Fallo al eliminar la tarea.')
      console.error('Error deleting task:', response.error)
    }
    loading.value = false
  }

  const setEditingTask = (task: Task | null) => {
    currentEditingTask.value = task
  }

  const allTasks = computed(() => tasks.value)

  const getTaskById = computed(() => (id: string) => {
    return tasks.value.find((task) => task.id === id)
  })

  loadTasks()

  return {
    tasks,
    currentEditingTask,
    loading,
    allTasks,
    getTaskById,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    setEditingTask,
  }
})
