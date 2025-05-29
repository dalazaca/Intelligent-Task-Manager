<template>
  <div class="tasks-view">
    <TaskForm
      v-if="showForm"
      @task-saved="handleTaskSaved"
      @cancel-edit="handleCancelEdit"
      class="tasks-view__form"
    />

    <TaskList
      v-else
      @edit-task="handleEditTask"
      @add-task="handleAddTask"
      class="tasks-view__list"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TaskList from '@/components/TaskList.vue'
import TaskForm from '@/components/TaskForm.vue'
import { useTaskStore } from '@/stores/tasks'
import type { Task } from '@/types/task'
// Eliminado: import { useI18n } from 'vue-i18n';

const taskStore = useTaskStore()
// Eliminado: const { locale } = useI18n();

const showForm = ref(false)

// Eliminado: const changeLanguage = (lang: string) => { locale.value = lang; };

const handleEditTask = (task: Task) => {
  taskStore.setEditingTask(task)
  showForm.value = true
}

const handleAddTask = () => {
  taskStore.setEditingTask(null)
  showForm.value = true
}

const handleTaskSaved = () => {
  showForm.value = false
  taskStore.setEditingTask(null)
}

const handleCancelEdit = () => {
  showForm.value = false
  taskStore.setEditingTask(null)
}
</script>

<style lang="scss" scoped>
.tasks-view {
  /* position: relative;  Ya no es necesario, el switcher está en App.vue */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0; /* Padding general se puede manejar más desde el contenido */
  background-color: transparent; /* El fondo principal ahora puede ser App.vue */
  min-height: auto; /* O la altura que necesite para su contenido */
  width: 100%; /* Ocupa todo el ancho */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  /* Eliminado: &__header-container y sus estilos */
  /* Eliminado: &__title y sus estilos específicos de TasksView, ya que el título se movió a App.vue */
  /* Eliminado: &__language-switcher y sus estilos */

  &__form,
  &__list {
    width: 100%;
    max-width: 900px;
    /* El margin: auto se maneja en los componentes individuales */
  }
}
</style>
