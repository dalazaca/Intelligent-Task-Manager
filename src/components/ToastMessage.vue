<template>
  <TransitionGroup name="toast" tag="div" class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast-message"
      :class="[`toast-message--${toast.type}`]"
    >
      <div class="toast-message__icon">
        <span v-if="toast.type === 'success'">✔️</span>
        <span v-else-if="toast.type === 'error'">❌</span>
        <span v-else-if="toast.type === 'info'">ℹ️</span>
        <span v-else-if="toast.type === 'warning'">⚠️</span>
      </div>
      <div class="toast-message__content">
        <p class="toast-message__text">{{ toast.message }}</p>
        <button
          v-if="toast.dismissible"
          @click="dismissToast(toast.id)"
          class="toast-message__dismiss-button"
        >
          &times;
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
  dismissible?: boolean
  timeoutId?: ReturnType<typeof setTimeout>
}

const { toasts, dismissToast } = useToast()
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  width: 90%;
  pointer-events: none;
}

.toast-message {
  display: flex;
  align-items: center;
  padding: 12px 18px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: white;
  font-weight: bold;
  pointer-events: all;
  background-color: #333;
  border: 1px solid transparent;

  &__icon {
    margin-right: 12px;
    font-size: 1.2rem;
    line-height: 1;
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
  }

  &__text {
    margin: 0;
    flex-grow: 1;
  }

  &__dismiss-button {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    margin-left: 15px;
    line-height: 1;
    padding: 0;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  &--success {
    background-color: #4caf50;
    border-color: #388e3c;
  }
  &--error {
    background-color: #f44336;
    border-color: #d32f2f;
  }
  &--info {
    background-color: #2196f3;
    border-color: #1976d2;
  }
  &--warning {
    background-color: #ffc107;
    border-color: #ffa000;
    color: #333;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.toast-move {
  transition: transform 0.5s ease;
}
</style>
