<template>
  <div class="task-list">
    <div v-if="taskStore.loading" class="task-list__message task-list__message--loading">
      Cargando tareas...
    </div>
    <div v-if="taskStore.error" class="task-list__message task-list__message--error">
      Error: {{ taskStore.error }}
    </div>
    <div class="task-list__language-switcher">
      <button @click="changeLanguage('es')" :class="{ active: $i18n.locale === 'es' }">
        Español
      </button>
      <button @click="changeLanguage('en')" :class="{ active: $i18n.locale === 'en' }">
        English
      </button>
    </div>

    <div class="task-list__controls">
      <div class="task-list__filter-group">
        <label for="status-filter" class="task-list__label">{{
          $t('taskList.filterByStatus')
        }}</label>
        <select id="status-filter" v-model="filterStatus" class="task-list__select">
          <option value="">{{ $t('taskList.all') }}</option>
          <option value="Pendiente">{{ $t('taskList.pending') }}</option>
          <option value="En progreso">{{ $t('taskList.inProgress') }}</option>
          <option value="Completada">{{ $t('taskList.completed') }}</option>
        </select>
      </div>

      <div class="task-list__filter-group">
        <label for="sort-by" class="task-list__label">{{ $t('taskList.sortBy') }}</label>
        <select id="sort-by" v-model="sortBy" class="task-list__select">
          <option value="dueDate">{{ $t('taskList.dueDate') }}</option>
          <option value="status">{{ $t('taskList.status') }}</option>
          <option value="title">{{ $t('taskList.title') }}</option>
        </select>
        <button @click="toggleSortDirection" class="task-list__sort-button">
          {{ sortDirection === 'asc' ? $t('taskList.ascending') : $t('taskList.descending') }}
        </button>
      </div>
    </div>

    <table class="task-list__table">
      <thead class="task-list__header">
        <tr class="task-list__header-row">
          <th class="task-list__header-cell task-list__header-cell--title">
            {{ $t('taskList.title') }}
          </th>
          <th class="task-list__header-cell task-list__header-cell--due-date">
            {{ $t('taskList.dueDate') }}
          </th>
          <th class="task-list__header-cell task-list__header-cell--status">
            {{ $t('taskList.status') }}
          </th>
          <th class="task-list__header-cell task-list__header-cell--actions">
            {{ $t('taskList.actions') }}
          </th>
        </tr>
      </thead>
      <tbody class="task-list__body">
        <tr v-if="filteredAndSortedTasks.length === 0" class="task-list__no-tasks">
          <td colspan="4" class="task-list__no-tasks-cell">{{ $t('taskList.noTasks') }}</td>
        </tr>
        <tr v-for="task in filteredAndSortedTasks" :key="task.id" class="task-list__row">
          <td class="task-list__cell task-list__cell--title">{{ task.title }}</td>
          <td class="task-list__cell task-list__cell--due-date">{{ task.dueDate }}</td>
          <td class="task-list__cell task-list__cell--status">
            {{ $t(`taskList.statusOrder.${task.status.toLowerCase().replace(' ', '')}`) }}
          </td>
          <td class="task-list__cell task-list__cell--actions">
            <router-link
              :to="{ name: 'task-detail', params: { id: task.id } }"
              class="task-list__action-button task-list__action-button--view"
            >
              {{ $t('taskList.viewDetail') }}
            </router-link>
            <button
              @click="$emit('editTask', task)"
              class="task-list__action-button task-list__action-button--edit"
            >
              {{ $t('taskList.edit') }}
            </button>
            <button
              @click="confirmDelete(task.id)"
              class="task-list__action-button task-list__action-button--delete"
            >
              {{ $t('taskList.delete') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import type { Task, TaskStatus } from '@/types/task'
import { useI18n } from 'vue-i18n' // Importa useI18n

defineEmits(['editTask'])

const taskStore = useTaskStore()
const { t, locale } = useI18n() // Obtén la función de traducción y la locale actual

// Estado para el filtrado
const filterStatus = ref<TaskStatus | ''>('')

// Estado para el ordenamiento
const sortBy = ref<keyof Task>('dueDate')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Función para cambiar el idioma
const changeLanguage = (lang: string) => {
  locale.value = lang
}

// Computed property para filtrar tareas
const filteredTasks = computed(() => {
  if (!filterStatus.value) {
    return taskStore.allTasks
  }
  return taskStore.allTasks.filter((task) => task.status === filterStatus.value)
})

// Computed property para ordenar y luego filtrar
const filteredAndSortedTasks = computed(() => {
  const tasksToSort = [...filteredTasks.value]

  return tasksToSort.sort((a, b) => {
    let result = 0
    if (sortBy.value === 'dueDate') {
      result = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    } else if (sortBy.value === 'status') {
      // Es crucial que los estatus en el objeto `statusOrder` coincidan con los valores literales
      // de `TaskStatus` y con las claves de traducción si se usan en el template.
      // Aquí usamos los valores literales para la lógica de ordenamiento.
      const statusOrder: Record<TaskStatus, number> = {
        Pendiente: 1,
        'En progreso': 2,
        Completada: 3,
      }
      result = statusOrder[a.status] - statusOrder[b.status]
    } else if (sortBy.value === 'title') {
      result = a.title.localeCompare(b.title)
    }

    return sortDirection.value === 'asc' ? result : -result
  })
})

// Función para cambiar la dirección del ordenamiento
const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

// Función para confirmar y eliminar tarea
const confirmDelete = (id: string) => {
  // Usamos $t para traducir el mensaje de confirmación
  if (confirm(t('taskList.confirmDelete'))) {
    taskStore.deleteTask(id)
  }
}
</script>

<style lang="scss" scoped>
.task-list {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 20px auto;

  &__language-switcher {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 15px;
    gap: 10px;

    button {
      padding: 8px 15px;
      border: 1px solid #007bff;
      border-radius: 5px;
      background-color: transparent;
      color: #007bff;
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        background-color: #007bff;
        color: white;
        font-weight: bold;
      }

      &:hover:not(.active) {
        background-color: #e6f2ff;
      }
    }
  }

  &__controls {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    align-items: flex-end;
  }

  &__filter-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__label {
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }

  &__select,
  &__input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    min-width: 150px;
  }

  &__sort-button {
    padding: 8px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s ease-in-out;
    margin-left: 10px;

    &:hover {
      background-color: #0056b3;
    }
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  &__header {
    background-color: #e2e6ea;
  }

  &__header-row {
    border-bottom: 2px solid #ccc;
  }

  &__header-cell {
    padding: 12px 15px;
    text-align: left;
    font-weight: bold;
    color: #333;
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  &__row {
    border-bottom: 1px solid #eee;

    &:nth-child(even) {
      background-color: #f6f6f6;
    }

    &:hover {
      background-color: #e9ecef;
    }
  }

  &__cell {
    padding: 10px 15px;
    vertical-align: middle;
    color: #555;

    &--status {
      &[data-status='Pendiente'] {
        color: orange;
      }
      &[data-status='En progreso'] {
        color: blue;
      }
      &[data-status='Completada'] {
        color: green;
      }
    }
  }

  &__action-button {
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background-color 0.2s ease-in-out;
    margin-right: 8px;

    &--view {
      background-color: #007bff;
      color: white;
      text-decoration: none;
      display: inline-block;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 0.85rem;
      margin-right: 8px;

      &:hover {
        background-color: #0056b3;
      }
    }

    &--edit {
      background-color: #28a745;
      color: white;
      &:hover {
        background-color: #218838;
      }
    }

    &--delete {
      background-color: #dc3545;
      color: white;
      &:hover {
        background-color: #c82333;
      }
    }
  }

  &__no-tasks {
    text-align: center;
    color: #777;
    font-style: italic;
    padding: 20px;

    &-cell {
      padding: 20px;
    }
  }
}
</style>
