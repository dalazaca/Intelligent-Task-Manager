// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import TasksView from '@/views/TasksView.vue'
import TaskDetailView from '@/views/TaskDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'tasks',
      component: TasksView,
    },
    {
      path: '/task/:id', // Ruta dinámica para el ID de la tarea
      name: 'task-detail',
      component: TaskDetailView,
      // Props: true si quieres pasar los parámetros de la ruta como props al componente
      // Sin embargo, para Composition API y <script setup>, es más común acceder a route.params directamente.
      // props: true, // Puedes habilitarlo si prefieres pasar props
    },
    // Opcional: Ruta 404
    {
      path: '/:catchAll(.*)',
      redirect: '/', // Redirecciona a la vista de tareas si la ruta no existe
    },
  ],
})

export default router
