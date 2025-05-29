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

const taskStore = useTaskStore()

const showForm = ref(false)

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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  background-color: transparent;
  min-height: auto;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  &__form,
  &__list {
    width: 100%;
    max-width: 1000px;
  }
}
</style>
