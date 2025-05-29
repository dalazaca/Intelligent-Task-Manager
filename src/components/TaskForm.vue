<template>
  <div class="task-form">
    <h2 class="task-form__title">
      {{ isEditing ? $t('taskForm.editTask') : $t('taskForm.addNewTask') }}
    </h2>
    <form @submit.prevent="saveTask" class="task-form__form">
      <div class="task-form__group">
        <label for="title" class="task-form__label">{{ $t('global.title') }}:</label>
        <input
          type="text"
          id="title"
          v-model="task.title"
          required
          class="task-form__input"
          :placeholder="$t('taskForm.titlePlaceholder')"
          :disabled="formLoading"
        />
      </div>

      <div class="task-form__group">
        <label for="description" class="task-form__label"
          >{{ $t('global.description') }} ({{ $t('global.noDescription') }}):</label
        >
        <textarea
          id="description"
          v-model="task.description"
          class="task-form__textarea"
          rows="3"
          :placeholder="$t('taskForm.descriptionPlaceholder')"
          :disabled="formLoading"
        ></textarea>
      </div>

      <div class="task-form__group">
        <label for="dueDate" class="task-form__label">{{ $t('taskForm.dueDateLabel') }}</label>
        <input
          type="date"
          id="dueDate"
          v-model="task.dueDate"
          required
          class="task-form__input"
          :disabled="formLoading"
        />
      </div>

      <div class="task-form__group">
        <label for="priority" class="task-form__label">{{ $t('taskForm.priorityLabel') }}</label>
        <select
          id="priority"
          v-model="task.priority"
          required
          class="task-form__select"
          :disabled="formLoading"
        >
          <option value="Baja">{{ $t('taskPriority.baja') }}</option>
          <option value="Media">{{ $t('taskPriority.media') }}</option>
          <option value="Alta">{{ $t('taskPriority.alta') }}</option>
          <option value="Urgente">{{ $t('taskPriority.urgente') }}</option>
        </select>
      </div>

      <div class="task-form__group">
        <label for="status" class="task-form__label">{{ $t('taskForm.statusLabel') }}</label>
        <select
          id="status"
          v-model="task.status"
          required
          class="task-form__select"
          :disabled="formLoading"
        >
          <option value="Pendiente">{{ $t('taskList.pending') }}</option>
          <option value="En progreso">{{ $t('taskList.inProgress') }}</option>
          <option value="Completada">{{ $t('taskList.completed') }}</option>
        </select>
      </div>

      <div class="task-form__actions">
        <button
          type="submit"
          class="task-form__button task-form__button--submit"
          :disabled="formLoading"
        >
          <span v-if="formLoading" class="task-form__loader"></span>
          {{
            formLoading
              ? $t('taskForm.loadingForm')
              : isEditing
                ? $t('taskForm.saveChanges')
                : $t('taskForm.addTask')
          }}
        </button>
        <button
          type="button"
          @click="cancelEdit"
          class="task-form__button task-form__button--cancel"
          :disabled="formLoading"
        >
          {{ $t('taskForm.cancel') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import type { Task } from '@/types/task'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'

const taskStore = useTaskStore()
const emit = defineEmits(['taskSaved', 'cancelEdit'])
const { t } = useI18n()
const { showErrorToast } = useToast()

const task = ref<Partial<Task>>({
  title: '',
  dueDate: '',
  status: 'Pendiente',
  priority: 'Media',
  description: '',
})

const isEditing = ref(false)
const formLoading = ref(false)

const initializeForm = () => {
  if (taskStore.currentEditingTask) {
    task.value = { ...taskStore.currentEditingTask }
    isEditing.value = true
  } else {
    isEditing.value = false
    resetForm()
  }
}

watch(
  () => taskStore.currentEditingTask,
  () => {
    initializeForm()
  },
  { immediate: true },
)

onMounted(() => {
  initializeForm()
})

const resetForm = () => {
  task.value = {
    title: '',
    dueDate: '',
    status: 'Pendiente',
    priority: 'Media',
    description: '',
  }
}

const saveTask = async () => {
  formLoading.value = true
  try {
    if (isEditing.value) {
      if (task.value.id) {
        await taskStore.updateTask(task.value as Task)
      } else {
        showErrorToast(t('taskForm.idNotFound'))
        console.error('Error: Trying to update a task without an ID while in editing mode.')
        formLoading.value = false
        return
      }
    } else {
      await taskStore.addTask(task.value as Omit<Task, 'id'>)
    }

    if (!taskStore.loading && !taskStore.error) {
      resetForm()
      emit('taskSaved')
    }
  } catch (error) {
    console.error('Error inesperado al guardar tarea en TaskForm:', error)
    showErrorToast(t('taskForm.unexpectedError'))
  } finally {
    formLoading.value = false
  }
}

const cancelEdit = () => {
  resetForm()
  emit('cancelEdit')
}
</script>

<style lang="scss" scoped>
.task-form {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  margin: 20px auto;
  box-sizing: border-box;

  &__title {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 1.8rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__group {
    display: flex;
    flex-direction: column;
  }

  &__label {
    font-weight: bold;
    color: #555;
    margin-bottom: 8px;
    font-size: 0.95rem;
  }

  &__input,
  &__textarea,
  &__select {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    transition:
      border-color 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }

    &:disabled {
      background-color: #e9ecef;
      cursor: not-allowed;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 80px;
  }

  &__select {
    appearance: none;
    background-color: transparent;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13%205.4l-117.4%20117.4-117.4-117.4a17.6%2017.6%200%200%200-25%200%2017.6%2017.6%200%200%200%200%2025l129.9%20129.9a17.6%2017.6%200%200%200%2025%200l129.9-129.9a17.6%2017.6%200%200%000-25z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 12px;
    padding-right: 35px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;

    &:disabled {
      background-color: #a0a0a0;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    &--submit {
      background-color: #28a745;
      color: white;

      &:hover:not(:disabled) {
        background-color: #218838;
        transform: translateY(-1px);
      }
    }

    &--cancel {
      background-color: #6c757d;
      color: white;

      &:hover:not(:disabled) {
        background-color: #5a6268;
        transform: translateY(-1px);
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    }
  }

  &__loader {
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #fff;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }
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
