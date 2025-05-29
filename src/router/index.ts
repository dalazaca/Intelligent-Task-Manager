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
      path: '/task/:id',
      name: 'task-detail',
      component: TaskDetailView,
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
})

export default router
