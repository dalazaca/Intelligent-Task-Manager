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
import { useToast } from '@/composables/useToast' // Importa el composable de toast

const taskStore = useTaskStore()
const emit = defineEmits(['taskSaved', 'cancelEdit'])
const { t } = useI18n()
const { showErrorToast } = useToast() // Obtiene la función de toast de error

const task = ref<Omit<Task, 'id' | 'description'> & { id?: string; description?: string }>({
  title: '',
  dueDate: '',
  status: 'Pendiente',
  description: '',
})

const isEditing = ref(false)
const formLoading = ref(false)
// Eliminamos: const formError = ref<string | null>(null);

const initializeForm = () => {
  if (taskStore.currentEditingTask) {
    task.value = { ...taskStore.currentEditingTask }
    isEditing.value = true
  } else {
    isEditing.value = false
  }
  // Eliminamos: formError.value = null;
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
    description: '',
  }
}

const saveTask = async () => {
  formLoading.value = true
  // Eliminamos: formError.value = null;

  try {
    if (isEditing.value) {
      if (task.value.id) {
        await taskStore.updateTask(task.value as Task)
        // El store ya manejará el toast de éxito/error, no necesitamos propagar aquí
      } else {
        // Muestra el toast de error directamente
        showErrorToast(t('taskForm.idNotFound'))
      }
    } else {
      await taskStore.addTask(task.value)
      // El store ya manejará el toast de éxito/error
    }
    // Si la operación en el store fue exitosa, entonces procedemos
    if (!taskStore.loading) {
      // Asume que loading se desactiva al final de la operación exitosa o fallida
      resetForm()
      emit('taskSaved')
    }
  } catch (error) {
    // Esto atraparía errores que no vienen directamente del store (ej. el throw new Error si ID no existe)
    console.error('Error inesperado al guardar tarea en TaskForm:', error)
    showErrorToast(t('taskForm.errorSaving'))
  } finally {
    formLoading.value = false
  }
}

const cancelEdit = () => {
  resetForm()
  emit('cancelEdit')
  // Eliminamos: formError.value = null;
}
</script>

<style lang="scss" scoped>
.task-form {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px; /* Ancho máximo en pantallas grandes */
  width: 100%; /* Ocupa el 100% del espacio disponible hasta el max-width */
  margin: 20px auto; /* Centrado horizontal y espacio vertical */
  box-sizing: border-box; /* Asegura que padding y border no aumenten el tamaño total */

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
    gap: 20px; /* Espacio entre los grupos de formulario */
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
    width: 100%; /* Ocupa el 100% del ancho de su contenedor */
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
    resize: vertical; /* Permite redimensionar verticalmente */
    min-height: 80px;
  }

  &__select {
    appearance: none; /* Elimina el estilo por defecto del select en algunos navegadores */
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13%205.4l-117.4%20117.4-117.4-117.4a17.6%2017.6%200%200%200-25%200%2017.6%2017.6%200%200%200%200%2025l129.9%20129.9a17.6%2017.6%200%200%200%2025%200l129.9-129.9a17.6%2017.6%200%200%000-25z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 12px;
    padding-right: 35px; /* Espacio para el icono de la flecha */
  }

  &__actions {
    display: flex;
    justify-content: flex-end; /* Alinea los botones a la derecha */
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
    display: flex; /* Para centrar el loader y el texto */
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
    animation: spin 1s linear infinite; /* Animación de spinner */
    margin-right: 8px; /* Espacio entre el loader y el texto */
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
