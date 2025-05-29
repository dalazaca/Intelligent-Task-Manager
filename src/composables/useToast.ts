// src/composables/useToast.ts
import { ref, readonly } from 'vue'
import { v4 as uuidv4 } from 'uuid' // Necesitarás 'uuid' si no lo tienes ya para IDs únicos
import type { Toast, ToastType } from '@/components/ToastMessage.vue' // Importa los tipos

// La cola de toasts se maneja globalmente
const _toasts = ref<Toast[]>([])

/**
 * @function useToast
 * @description Composable para gestionar notificaciones de toast.
 * Permite añadir y descartar mensajes de toast de forma global.
 */
export function useToast() {
  // Exponer la cola de toasts como de solo lectura
  const toasts = readonly(_toasts)

  /**
   * @function showToast
   * @description Añade un nuevo mensaje de toast a la cola.
   * @param message El mensaje a mostrar.
   * @param type El tipo de toast (success, error, info, warning).
   * @param duration La duración en milisegundos. 0 para no auto-descartar. Por defecto 3000ms.
   * @param dismissible Si el toast puede ser descartado manualmente. Por defecto true.
   */
  const showToast = (
    message: string,
    type: ToastType = 'info',
    duration: number = 3000,
    dismissible: boolean = true,
  ) => {
    const id = `toast-${uuidv4()}` // Genera un ID único

    const newToast: Toast = {
      id,
      message,
      type,
      duration,
      dismissible,
    }

    if (duration && duration > 0) {
      newToast.timeoutId = setTimeout(() => {
        dismissToast(id)
      }, duration)
    }

    _toasts.value.push(newToast)
  }

  /**
   * @function dismissToast
   * @description Descarta un toast específico por su ID.
   * @param id El ID del toast a descartar.
   */
  const dismissToast = (id: string) => {
    const index = _toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      // Si el toast tiene un temporizador, lo limpiamos para evitar fugas de memoria
      if (_toasts.value[index].timeoutId) {
        clearTimeout(_toasts.value[index].timeoutId!)
      }
      _toasts.value.splice(index, 1)
    }
  }

  /**
   * Atajos para tipos de toast específicos
   */
  const showSuccessToast = (message: string, duration?: number, dismissible?: boolean) =>
    showToast(message, 'success', duration, dismissible)
  const showErrorToast = (message: string, duration?: number, dismissible?: boolean) =>
    showToast(message, 'error', duration, dismissible)
  const showInfoToast = (message: string, duration?: number, dismissible?: boolean) =>
    showToast(message, 'info', duration, dismissible)
  const showWarningToast = (message: string, duration?: number, dismissible?: boolean) =>
    showToast(message, 'warning', duration, dismissible)

  return {
    // La cola de toasts se pasa al componente ToastMessage
    toasts,
    showToast,
    dismissToast, // Expón dismissToast para el botón de cerrar en el ToastMessage
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
  }
}
