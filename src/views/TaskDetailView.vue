<template>
  <div class="task-detail-view">
    <div v-if="task" class="task-detail">
      <h1 class="task-detail__title">Detalle de la Tarea</h1>
      <div class="task-detail__group">
        <span class="task-detail__label">Título:</span>
        <p class="task-detail__value">{{ task.title }}</p>
      </div>
      <div class="task-detail__group">
        <span class="task-detail__label">Descripción:</span>
        <p class="task-detail__value">{{ task.description || 'No hay descripción' }}</p>
      </div>
      <div class="task-detail__group">
        <span class="task-detail__label">Fecha de Vencimiento:</span>
        <p class="task-detail__value">{{ task.dueDate }}</p>
      </div>
      <div class="task-detail__group">
        <span class="task-detail__label">Estatus:</span>
        <p class="task-detail__value task-detail__value--status" :data-status="task.status">
          {{ task.status }}
        </p>
      </div>

      <div class="task-detail__actions">
        <button
          @click="editTask"
          class="task-detail__action-button task-detail__action-button--edit"
        >
          Editar Tarea
        </button>
        <button @click="goBack" class="task-detail__action-button task-detail__action-button--back">
          Volver a la lista
        </button>
      </div>
    </div>
    <div v-else class="task-detail--not-found">
      <p>Tarea no encontrada.</p>
      <button @click="goBack" class="task-detail__action-button task-detail__action-button--back">
        Volver a la lista
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import type { Task } from '@/types/task'

const route = useRoute() // Acceder a la ruta actual
const router = useRouter() // Acceder al objeto router para navegación
const taskStore = useTaskStore()

const task = ref<Task | null>(null)

// Usamos watchEffect para reaccionar a cambios en los parámetros de la ruta
// y buscar la tarea correspondiente en el store.
watchEffect(() => {
  const taskId = route.params.id as string // Obtener el ID de los parámetros de la ruta
  if (taskId) {
    task.value = taskStore.getTaskById(taskId) // Buscar la tarea en el store
  } else {
    task.value = null
  }
})

const editTask = () => {
  if (task.value) {
    taskStore.setEditingTask(task.value) // Establece la tarea a editar en el store
    router.push({ name: 'tasks' }) // Navega de vuelta a la vista de tareas, que mostrará el formulario de edición
  }
}

const goBack = () => {
  router.push({ name: 'tasks' }) // Vuelve a la ruta de la lista de tareas
}
</script>

<style lang="scss" scoped>
.task-detail-view {
  display: flex;
  justify-content: center;
  padding: 30px;
  background-color: #f0f2f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.task-detail {
  background-color: #fff;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: left;
  box-sizing: border-box;

  &__title {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
    font-size: 2.2rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
  }

  &__group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
  }

  &__label {
    font-weight: bold;
    color: #444;
    font-size: 1.1rem;
    margin-bottom: 5px;
  }

  &__value {
    color: #666;
    font-size: 1rem;
    line-height: 1.5;
    background-color: #f9f9f9;
    padding: 10px 15px;
    border-radius: 5px;
    border: 1px solid #eee;

    &--status {
      font-weight: bold;
      &[data-status='Pendiente'] {
        color: orange;
        border-color: orange;
      }
      &[data-status='En progreso'] {
        color: blue;
        border-color: blue;
      }
      &[data-status='Completada'] {
        color: green;
        border-color: green;
      }
    }
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 40px;
  }

  &__action-button {
    padding: 12px 25px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition:
      background-color 0.3s ease,
      transform 0.1s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &--edit {
      background-color: #007bff;
      color: white;
      &:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
      }
    }

    &--back {
      background-color: #6c757d;
      color: white;
      &:hover {
        background-color: #5a6268;
        transform: translateY(-2px);
      }
    }
    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    }
  }
}

.task-detail--not-found {
  text-align: center;
  padding: 50px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  color: #dc3545;
  font-size: 1.2rem;
  font-weight: bold;

  .task-detail__action-button--back {
    margin-top: 20px;
  }
}
</style>
