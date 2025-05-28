// src/i18n.ts
import { createI18n } from 'vue-i18n'

// Mensajes de traducción
const messages = {
  en: {
    // Inglés
    taskList: {
      filterByStatus: 'Filter by Status:',
      sortBy: 'Sort by:',
      ascending: 'Ascending',
      descending: 'Descending',
      all: 'All',
      pending: 'Pending',
      inProgress: 'In progress',
      completed: 'Completed',
      title: 'Title',
      dueDate: 'Due Date',
      status: 'Status',
      actions: 'Actions',
      viewDetail: 'View Detail',
      edit: 'Edit',
      delete: 'Delete',
      noTasks: 'No tasks to display.',
      confirmDelete: 'Are you sure you want to delete this task?',
      statusOrder: {
        // Para el ordenamiento, si es necesario, aunque se usa en la lógica
        pendiente: 'Pending',
        enprogreso: 'In progress',
        completada: 'Completed',
      },
    },
    // Otros componentes y vistas pueden ir aquí
    taskDetail: {
      // Mensajes para TaskDetailView si lo internacionalizas
    },
    taskForm: {
      // Mensajes para TaskForm si lo internacionalizas
    },
    global: {
      // Mensajes globales como "Save", "Cancel", etc.
    },
  },
  es: {
    // Español
    taskList: {
      filterByStatus: 'Filtrar por Estatus:',
      sortBy: 'Ordenar por:',
      ascending: 'Ascendente',
      descending: 'Descendente',
      all: 'Todos',
      pending: 'Pendiente',
      inProgress: 'En progreso',
      completed: 'Completada',
      title: 'Título',
      dueDate: 'Fecha',
      status: 'Estatus',
      actions: 'Acciones',
      viewDetail: 'Ver Detalle',
      edit: 'Editar',
      delete: 'Eliminar',
      noTasks: 'No hay tareas para mostrar.',
      confirmDelete: '¿Estás seguro de que quieres eliminar esta tarea?',
      statusOrder: {
        // Para el ordenamiento
        pendiente: 'Pendiente',
        enprogreso: 'En progreso',
        completada: 'Completada',
      },
    },
  },
}

const i18n = createI18n({
  locale: 'es', // Establece el idioma por defecto
  fallbackLocale: 'en', // Idioma de respaldo si una traducción no está disponible
  messages, // Carga los mensajes de traducción
  legacy: false, // Usa la API de composición (Composition API)
  globalInjection: true, // Hace $t y $i18n disponibles globalmente
})

export default i18n
