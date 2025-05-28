<template>
  <div class="tasks-view">
    <h1 class="tasks-view__title">Gestor de Tareas</h1>

    <button @click="showForm = !showForm" class="tasks-view__toggle-button">
      {{ showForm ? 'Ver Tareas' : 'Añadir Nueva Tarea' }}
    </button>

    <TaskForm
      v-if="showForm"
      @task-saved="handleTaskSaved"
      @cancel-edit="handleCancelEdit"
      class="tasks-view__form"
    />

    <TaskList v-else @edit-task="handleEditTask" class="tasks-view__list" />
  </div>
</template>

<script setup lang="ts">
// Al usar <script setup>, no necesitas importar defineComponent.
// Las importaciones de variables reactivas, stores y componentes son directas.
import { ref } from 'vue'
import TaskList from '@/components/TaskList.vue'
import TaskForm from '@/components/TaskForm.vue'
import { useTaskStore } from '@/stores/tasks'
import type { Task } from '@/types/task'

const taskStore = useTaskStore()
const showForm = ref(false) // Controla la visibilidad del formulario

// Maneja la emisión del evento 'editTask' desde TaskList
const handleEditTask = (task: Task) => {
  taskStore.setEditingTask(task) // Establece la tarea a editar en el store
  showForm.value = true // Muestra el formulario para editar
}

// Maneja el evento 'task-saved' desde TaskForm
const handleTaskSaved = () => {
  showForm.value = false // Oculta el formulario y vuelve a la lista
  taskStore.setEditingTask(null) // Limpia la tarea en edición
}

// Maneja el evento 'cancel-edit' desde TaskForm
const handleCancelEdit = () => {
  showForm.value = false // Oculta el formulario
  taskStore.setEditingTask(null) // Limpia la tarea en edición
}

// Con <script setup>, no necesitas un return { ... }.
// Todas las variables y funciones declaradas aquí son automáticamente expuestas al template.
</script>

<style lang="scss" scoped>
.tasks-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background-color: #f0f2f5;
  min-height: 100vh; // Ocupa toda la altura de la ventana
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  &__title {
    color: #2c3e50;
    margin-bottom: 25px;
    font-size: 2.5rem;
    text-align: center;
  }

  &__toggle-button {
    padding: 12px 25px;
    margin-bottom: 30px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: bold;
    transition:
      background-color 0.3s ease,
      transform 0.1s ease;
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);

    &:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__form,
  &__list {
    width: 100%;
    max-width: 900px; // Coincide con el max-width de TaskList
  }

  // Puedes añadir más estilos para .tasks-view__form si es necesario
}
</style>
