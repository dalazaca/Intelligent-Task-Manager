export type TaskStatus = 'Pendiente' | 'En progreso' | 'Completada'

export interface Task {
  id: string
  title: string
  description?: string // Opcional
  dueDate: string // Formato 'YYYY-MM-DD'
  status: TaskStatus
}
