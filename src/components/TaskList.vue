<template>
  <div class="task-list">
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
        <label for="priority-filter" class="task-list__label">{{
          $t('taskList.filterByPriority')
        }}</label>
        <select id="priority-filter" v-model="filterPriority" class="task-list__select">
          <option value="">{{ $t('taskList.all') }}</option>
          <option value="Baja">{{ $t('taskPriority.low') }}</option>
          <option value="Media">{{ $t('taskPriority.medium') }}</option>
          <option value="Alta">{{ $t('taskPriority.high') }}</option>
          <option value="Urgente">{{ $t('taskPriority.urgent') }}</option>
        </select>
      </div>

      <button @click="$emit('addTask')" class="task-list__add-button">
        {{ $t('taskList.addTask') }}
      </button>
    </div>

    <table class="task-list__table">
      <thead class="task-list__header">
        <tr class="task-list__header-row">
          <th
            class="task-list__header-cell task-list__header-cell--sortable"
            @click="setSortBy('title')"
          >
            {{ $t('taskList.title') }}
            <span class="task-list__sort-icon">
              <span v-if="sortBy === 'title'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </span>
          </th>
          <th
            class="task-list__header-cell task-list__header-cell--sortable"
            @click="setSortBy('dueDate')"
          >
            {{ $t('taskList.dueDate') }}
            <span class="task-list__sort-icon">
              <span v-if="sortBy === 'dueDate'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </span>
          </th>
          <th
            class="task-list__header-cell task-list__header-cell--sortable"
            @click="setSortBy('priority')"
          >
            {{ $t('taskList.priority') }}
            <span class="task-list__sort-icon">
              <span v-if="sortBy === 'priority'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </span>
          </th>
          <th
            class="task-list__header-cell task-list__header-cell--sortable"
            @click="setSortBy('status')"
          >
            {{ $t('taskList.status') }}
            <span class="task-list__sort-icon">
              <span v-if="sortBy === 'status'">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </span>
          </th>
          <th class="task-list__header-cell list__header-cell--actions">
            {{ $t('taskList.actions') }}
          </th>
        </tr>
      </thead>
      <TransitionGroup name="task-list-item" tag="tbody" class="task-list__body">
        <tr v-if="taskStore.loading" key="loading-message" class="task-list__loading">
          <td colspan="5" class="task-list__loading-cell">
            {{ $t('taskList.loadingTasks') }}
            <span class="task-list__loader"></span>
          </td>
        </tr>
        <tr
          v-else-if="filteredAndSortedTasks.length === 0"
          key="no-tasks-message"
          class="task-list__no-tasks"
        >
          <td colspan="5" class="task-list__no-tasks-cell">{{ $t('taskList.noTasks') }}</td>
        </tr>
        <tr v-for="task in filteredAndSortedTasks" :key="task.id" class="task-list__row">
          <td class="task-list__cell task-list__cell--title">{{ task.title }}</td>
          <td class="task-list__cell task-list__cell--due-date">{{ task.dueDate }}</td>
          <td class="task-list__cell task-list__cell--priority" :data-priority="task.priority">
            {{ $t(`taskPriority.${task.priority.toLowerCase()}`) }}
          </td>
          <td class="task-list__cell task-list__cell--status" :data-status="task.status">
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
      </TransitionGroup>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import type { Task, TaskStatus, TaskPriority } from '@/types/task' // Importa TaskPriority
import { useI18n } from 'vue-i18n'

defineEmits(['editTask', 'addTask'])

const taskStore = useTaskStore()
const { t } = useI18n()

const filterStatus = ref<TaskStatus | ''>('')
const filterPriority = ref<TaskPriority | ''>('') // Nuevo ref para el filtro de prioridad
const sortBy = ref<keyof Task>('dueDate')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Definir el orden de las prioridades para el ordenamiento
const priorityOrder: Record<TaskPriority, number> = {
  Urgente: 1,
  Alta: 2,
  Media: 3,
  Baja: 4,
}

const setSortBy = (field: keyof Task) => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    // La dirección por defecto al cambiar de columna debería ser la que tenga sentido para ese campo.
    // Para prioridad, quizás 'Urgente' primero, que es 'asc' en nuestro mapa.
    sortDirection.value = field === 'priority' || field === 'dueDate' ? 'asc' : 'asc'
  }
}

const filteredTasks = computed(() => {
  let tasksToFilter = taskStore.allTasks

  if (filterStatus.value) {
    tasksToFilter = tasksToFilter.filter((task) => task.status === filterStatus.value)
  }

  if (filterPriority.value) {
    tasksToFilter = tasksToFilter.filter((task) => task.priority === filterPriority.value)
  }

  return tasksToFilter
})

const filteredAndSortedTasks = computed(() => {
  const tasksToSort = [...filteredTasks.value]

  return tasksToSort.sort((a, b) => {
    let result = 0
    if (sortBy.value === 'dueDate') {
      result = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    } else if (sortBy.value === 'status') {
      const statusOrder: Record<TaskStatus, number> = {
        Pendiente: 1,
        'En progreso': 2,
        Completada: 3,
      }
      result = statusOrder[a.status] - statusOrder[b.status]
    } else if (sortBy.value === 'priority') {
      // Lógica de ordenamiento por prioridad
      result = priorityOrder[a.priority] - priorityOrder[b.priority]
    } else if (sortBy.value === 'title') {
      result = a.title.localeCompare(b.title)
    }

    return sortDirection.value === 'asc' ? result : -result
  })
})

const confirmDelete = (id: string) => {
  if (confirm(t('global.confirmDelete'))) {
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
  width: 100%;
  margin: 20px auto;

  &__controls {
    display: flex;
    align-items: flex-end;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 20px;
  }

  &__filter-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex-grow: 1;
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
    width: 100%;
    appearance: none;
    background-color: #fff;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13%205.4l-117.4%20117.4-117.4-117.4a17.6%2017.6%200%200%200-25%200%2017.6%2017.6%200%200%200%200%2025l129.9%20129.9a17.6%2017.6%200%200%200%2025%200l129.9-129.9a17.6%2017.6%200%200%000-25z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 10px;
    padding-right: 30px;
    cursor: pointer;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }
  }

  &__add-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease;
    align-self: flex-end;
    height: 38px;
    box-sizing: border-box;
  }

  &__message {
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 5px;
    font-weight: bold;
    text-align: center;

    &--loading {
      background-color: #e7f3ff;
      color: #007bff;
    }

    &--error {
      background-color: #f8d7da;
      color: #dc3545;
      border: 1px solid #f5c6cb;
    }
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-spacing: 0;
    padding: 0;
  }

  &__header {
    background-color: #e2e6ea;
  }

  &__header-cell,
  &__cell {
    padding: 10px 15px;
    text-align: left;
    vertical-align: middle;
    color: #555;
    white-space: nowrap;
    box-sizing: border-box;

    &--title {
      min-width: 150px;
    }
    &--due-date {
      min-width: 120px;
    }
    &--priority {
      /* Nuevo estilo para celda de prioridad */
      min-width: 100px;
      font-weight: bold;
      &[data-priority='Baja'] {
        color: #6c757d; // Gris
      }
      &[data-priority='Media'] {
        color: #007bff; // Azul
      }
      &[data-priority='Alta'] {
        color: #ffc107; // Naranja
      }
      &[data-priority='Urgente'] {
        color: #dc3545; // Rojo
      }
    }
    &--status {
      min-width: 120px;
    }
    &--actions {
      min-width: 200px;
      text-align: center;
    }
  }

  &__header-cell {
    font-weight: bold;
    color: #333;
    text-transform: uppercase;
    font-size: 0.9rem;

    &--sortable {
      cursor: pointer;
      user-select: none;
      position: relative;

      &:hover {
        background-color: #d1d8e0;
      }
    }
  }

  &__sort-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.7rem;
    color: #666;
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

/* --- Animaciones para TransitionGroup --- */

.task-list-item-enter-active,
.task-list-item-leave-active {
  transition: all 0.5s ease;
}

.task-list-item-enter-from,
.task-list-item-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.task-list-item-leave-active {
  position: absolute;
  width: 100%;
}

.task-list-item-move {
  transition: transform 0.5s ease;
}

// Nuevo spinner de carga
.task-list__loading {
  text-align: center;
  color: #007bff;
  font-style: italic;
  padding: 20px;

  &-cell {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-weight: bold;
  }
}
.task-list__loader {
  border: 3px solid rgba(0, 123, 255, 0.3); /* Color del spinner adaptado */
  border-top: 3px solid #007bff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
