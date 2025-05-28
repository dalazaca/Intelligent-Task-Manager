<template>
  <div class="task-form">
    <h2 class="task-form__title">{{ isEditing ? 'Editar Tarea' : 'Añadir Nueva Tarea' }}</h2>
    <form @submit.prevent="saveTask" class="task-form__form">
      <div class="task-form__group">
        <label for="title" class="task-form__label">Título:</label>
        <input
          type="text"
          id="title"
          v-model="task.title"
          required
          class="task-form__input"
          placeholder="Título de la tarea"
        />
      </div>

      <div class="task-form__group">
        <label for="description" class="task-form__label">Descripción (Opcional):</label>
        <textarea
          id="description"
          v-model="task.description"
          class="task-form__textarea"
          rows="3"
          placeholder="Descripción detallada de la tarea"
        ></textarea>
      </div>

      <div class="task-form__group">
        <label for="dueDate" class="task-form__label">Fecha de Vencimiento:</label>
        <input type="date" id="dueDate" v-model="task.dueDate" required class="task-form__input" />
      </div>

      <div class="task-form__group">
        <label for="status" class="task-form__label">Estatus:</label>
        <select id="status" v-model="task.status" required class="task-form__select">
          <option value="Pendiente">Pendiente</option>
          <option value="En progreso">En progreso</option>
          <option value="Completada">Completada</option>
        </select>
      </div>

      <div class="task-form__actions">
        <button type="submit" class="task-form__button task-form__button--submit">
          {{ isEditing ? 'Guardar Cambios' : 'Añadir Tarea' }}
        </button>
        <button
          type="button"
          @click="cancelEdit"
          class="task-form__button task-form__button--cancel"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import type { Task } from '@/types/task'

// Obtenemos el store de tareas
const taskStore = useTaskStore()

// Definimos los eventos que este componente puede emitir
const emit = defineEmits(['taskSaved', 'cancelEdit'])

// Estado local para el formulario. Usamos Omit para el ID y lo hacemos opcional
// ya que no se genera en el formulario, sino en el store al añadir.
const task = ref<Omit<Task, 'id' | 'description'> & { id?: string; description?: string }>({
  title: '',
  dueDate: '',
  status: 'Pendiente',
  description: '',
})

const isEditing = ref(false) // Indica si estamos en modo edición o creación

// Función para inicializar el formulario. Se llama al montar o cuando cambia la tarea en edición.
const initializeForm = () => {
  if (taskStore.currentEditingTask) {
    // Si hay una tarea en edición en el store, la cargamos en el formulario local
    task.value = { ...taskStore.currentEditingTask }
    isEditing.value = true
  } else {
    // Si no hay tarea en edición, reseteamos el formulario para una nueva tarea
    // resetForm()
    isEditing.value = false
  }
}

// Observa cambios en `currentEditingTask` del store.
// `immediate: true` asegura que la función se ejecute una vez al inicio.
watch(
  () => taskStore.currentEditingTask,
  () => {
    initializeForm()
  },
  { immediate: true },
)

// Asegura que el formulario se inicialice correctamente al montar el componente,
// útil si la tarea en edición ya está establecida antes de que el componente se monte.
onMounted(() => {
  initializeForm()
})

// Resetea el formulario a sus valores por defecto
const resetForm = () => {
  task.value = {
    title: '',
    dueDate: '',
    status: 'Pendiente',
    description: '',
  }
}

// Guarda la tarea: añade una nueva o actualiza una existente
const saveTask = () => {
  if (isEditing.value) {
    // Si estamos editando y tenemos un ID, actualizamos la tarea
    if (task.value.id) {
      taskStore.updateTask(task.value as Task)
    }
  } else {
    // Si no estamos editando, añadimos una nueva tarea
    taskStore.addTask(task.value)
  }
  resetForm() // Limpiamos el formulario
  emit('taskSaved') // Emitimos un evento para notificar al componente padre
}

// Cancela la operación actual (edición o creación)
const cancelEdit = () => {
  resetForm() // Limpiamos el formulario
  emit('cancelEdit') // Emitimos un evento para notificar al componente padre
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
  }

  &__textarea {
    resize: vertical;
    min-height: 80px;
  }

  &__select {
    appearance: none;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13%205.4l-117.4%20117.4-117.4-117.4a17.6%2017.6%200%200%200-25%200%2017.6%2017.6%200%200%200%200%2025l129.9%20129.9a17.6%2017.6%200%200%200%2025%200l129.9-129.9a17.6%2017.6%200%200%000-25z%22%2F%3E%3C%2Fsvg%3E');
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

    &--submit {
      background-color: #28a745;
      color: white;

      &:hover {
        background-color: #218838;
        transform: translateY(-1px);
      }
    }

    &--cancel {
      background-color: #6c757d;
      color: white;

      &:hover {
        background-color: #5a6268;
        transform: translateY(-1px);
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
