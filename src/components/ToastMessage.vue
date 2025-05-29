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
import { useToast } from '@/composables/useToast' // Importamos el composable
// Mantenemos la exportación de tipos para que otros archivos puedan importarlos si es necesario.
export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number // Duración en ms, 0 para no auto-descartar
  dismissible?: boolean // Si se puede cerrar manualmente
  timeoutId?: ReturnType<typeof setTimeout> // Para almacenar el ID del temporizador
}

// Desestructuramos `toasts` y `dismissToast` directamente del composable.
// El componente ToastMessage ahora solo "lee" la cola de toasts y activa el descarte.
const { toasts, dismissToast } = useToast()
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 20px; /* Posición desde arriba */
  left: 50%; /* Centrado horizontal */
  transform: translateX(-50%);
  z-index: 9999; /* Asegura que esté por encima de todo */
  display: flex;
  flex-direction: column;
  gap: 10px; /* Espacio entre múltiples toasts */
  max-width: 400px; /* Ancho máximo para los toasts */
  width: 90%; /* Ancho responsivo */
  pointer-events: none; /* Permite clicks a través del contenedor si no hay toast */
}

.toast-message {
  display: flex;
  align-items: center;
  padding: 12px 18px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: white;
  font-weight: bold;
  pointer-events: all; /* Permite interacción con el toast (ej. botón de cerrar) */
  background-color: #333; /* Color por defecto */
  border: 1px solid transparent; /* Borde por defecto */

  &__icon {
    margin-right: 12px;
    font-size: 1.2rem;
    line-height: 1; /* Asegura que el icono no añada espacio extra */
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
  }

  &__text {
    margin: 0; /* Elimina márgenes de párrafo */
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
    padding: 0; /* Elimina padding por defecto del botón */
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  /* Tipos de Toast */
  &--success {
    background-color: #4caf50; /* Verde */
    border-color: #388e3c;
  }
  &--error {
    background-color: #f44336; /* Rojo */
    border-color: #d32f2f;
  }
  &--info {
    background-color: #2196f3; /* Azul */
    border-color: #1976d2;
  }
  &--warning {
    background-color: #ffc107; /* Amarillo */
    border-color: #ffa000;
    color: #333; /* Texto oscuro para contraste */
  }
}

/* Animaciones para la TransitionGroup */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-30px); /* Entra/sale desde arriba */
}
.toast-move {
  transition: transform 0.5s ease;
}
</style>
