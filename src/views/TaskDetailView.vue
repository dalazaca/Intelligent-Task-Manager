<template>
  <div class="task-detail">
    <div v-if="task" class="task-detail__card">
      <h1 class="task-detail__title">{{ task.title }}</h1>
      <p class="task-detail__description">
        {{ task.description || $t('taskDetail.noDescription') }}
      </p>
      <div class="task-detail__info-group">
        <span class="task-detail__label">{{ $t('taskDetail.dueDate') }}</span>
        <span class="task-detail__value">{{ task.dueDate }}</span>
      </div>
      <div class="task-detail__info-group">
        <span class="task-detail__label">{{ $t('taskDetail.priority') }}</span>
        <span class="task-detail__value" :data-priority="task.priority">{{
          $t(`taskPriority.${task.priority.toLowerCase()}`)
        }}</span>
      </div>
      <div class="task-detail__info-group">
        <span class="task-detail__label">{{ $t('taskDetail.status') }}</span>
        <span class="task-detail__value" :data-status="task.status">{{
          $t(`taskList.statusOrder.${task.status.toLowerCase().replace(' ', '')}`)
        }}</span>
      </div>
      <div class="task-detail__actions">
        <button @click="goBack" class="task-detail__button task-detail__button--back">
          {{ $t('taskDetail.backToList') }}
        </button>
      </div>
    </div>
    <div v-else class="task-detail__not-found">
      <p>{{ $t('taskDetail.taskNotFound') }}</p>
      <button @click="goBack" class="task-detail__button task-detail__button--back">
        {{ $t('taskDetail.backToList') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import type { Task } from '@/types/task'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const { t } = useI18n()
const { showErrorToast } = useToast()

const task = ref<Task | undefined>(undefined)

const loadTask = async () => {
  const taskId = route.params.id as string
  if (!taskId) {
    task.value = undefined
    showErrorToast(t('taskDetail.taskNotFound'))
    return
  }

  if (taskStore.allTasks.length === 0 && !taskStore.loading) {
    await taskStore.loadTasks()
  }

  task.value = taskStore.getTaskById(taskId)

  if (!task.value) {
    if (taskStore.error) {
      showErrorToast(taskStore.error)
    } else {
      showErrorToast(t('taskDetail.taskNotFound'), 5000)
    }
  }
}

watch(
  () => route.params.id,
  (newId) => {
    if (typeof newId === 'string' && newId) {
      loadTask()
    } else {
      task.value = undefined
    }
  },
  { immediate: true },
)

onMounted(() => {
  loadTask()
})

const goBack = () => {
  router.push({ name: 'tasks' })
}
</script>

<style lang="scss" scoped>
.task-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  background-color: #f0f2f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  &__card {
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    max-width: 600px;
    width: 100%;
    text-align: center;
  }

  &__title {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
    padding-bottom: 15px;
  }

  &__description {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 25px;
    line-height: 1.6;
  }

  &__info-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    font-size: 1rem;
  }

  &__label {
    font-weight: bold;
    color: #333;
    margin-right: 10px;
  }

  &__value {
    color: #555;

    // Estilos de estado existentes
    &[data-status='Pendiente'] {
      color: #f0ad4e;
      font-weight: bold;
    }
    &[data-status='En progreso'] {
      color: #0275d8;
      font-weight: bold;
    }
    &[data-status='Completada'] {
      color: #5cb85c;
      font-weight: bold;
    }
    // Nuevos estilos para prioridad
    &[data-priority='Baja'] {
      color: #6c757d; // Gris
      font-weight: bold;
    }
    &[data-priority='Media'] {
      color: #007bff; // Azul
      font-weight: bold;
    }
    &[data-priority='Alta'] {
      color: #ffc107; // Naranja
      font-weight: bold;
    }
    &[data-priority='Urgente'] {
      color: #dc3545; // Rojo
      font-weight: bold;
    }
  }

  &__actions {
    margin-top: 30px;
  }

  &__button {
    padding: 12px 25px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition:
      background-color 0.3s ease,
      transform 0.1s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    &--back {
      background-color: #6c757d;
      color: white;

      &:hover {
        background-color: #5a6268;
        transform: translateY(-2px);
      }
    }
  }

  &__not-found {
    text-align: center;
    font-size: 1.2rem;
    color: #888;
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;

    p {
      margin-bottom: 20px;
    }
  }

  &__message {
    padding: 15px 20px;
    margin: 20px auto;
    border-radius: 8px;
    font-weight: bold;
    text-align: center;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &--loading {
      background-color: #e7f3ff;
      color: #007bff;
      border: 1px solid #cce5ff;
    }

    &--error {
      background-color: #f8d7da;
      color: #dc3545;
      border: 1px solid #f5c6cb;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;

      button {
        margin-top: 10px;
      }
    }
  }
}
</style>
