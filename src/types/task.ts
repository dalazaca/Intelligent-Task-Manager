export type TaskStatus = 'Pendiente' | 'En progreso' | 'Completada'
export type TaskPriority = 'Baja' | 'Media' | 'Alta' | 'Urgente'
export interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  status: TaskStatus
  priority: TaskPriority
}
