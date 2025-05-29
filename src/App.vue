<template>
  <div id="app-container">
    <header class="app-header">
      <h1 class="app-header__title">{{ $t('global.appName') }}</h1>
      <div class="app-header__language-switcher">
        <span class="app-header__language-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="20px"
            height="20px"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.22.2-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.95-2.61c-.57.37-1.2.68-1.89.92L15 15v-1c0-1.1-.9-2-2-2v-1h5.05c.57.57.95 1.25.95 2s-.38 1.43-.95 2.19zM12 4.07c3.95.49 7 3.85 7 7.93 0 .62-.08 1.22-.2 1.79L15 9V8c0-1.1-.9-2-2-2V4.07zm-6.95 2.61c.57-.37 1.2-.68 1.89-.92L9 9v1c0 1.1.9 2 2 2v1H5.05c-.57-.57-.95-1.25-.95-2s.38-1.43.95-2.19z"
            />
          </svg>
        </span>
        <select v-model="$i18n.locale" class="app-header__language-select">
          <option
            v-for="localeOption in availableLocales"
            :key="localeOption.code"
            :value="localeOption.code"
          >
            {{ localeOption.name }}
          </option>
        </select>
        <div class="app-header__selected-language-display">
          <img
            :src="selectedLocaleFlag"
            alt="Flag"
            class="app-header__selected-flag"
            v-if="selectedLocaleFlag"
          />
          <span class="app-header__selected-text">
            {{ selectedLocaleName }}
          </span>
          <span class="app-header__dropdown-arrow"></span>
        </div>
      </div>
    </header>
    <router-view />

    <ToastMessage
      :toasts="toastComposable.toasts.value"
      @dismiss-toast="toastComposable.dismissToast"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { availableLocales } from '@/i18n'
import { useToast } from '@/composables/useToast'
import ToastMessage from '@/components/ToastMessage.vue'

const { locale } = useI18n()
const toastComposable = useToast()

// Añade esta línea para depuración
watch(
  toastComposable.toasts,
  (newVal) => {
    console.log('Toasts actualizados en ToastMessage.vue:', newVal)
  },
  { deep: true, immediate: true },
)

const selectedLocaleFlag = computed(() => {
  const currentLocale = availableLocales.find((l) => l.code === locale.value)
  return currentLocale ? currentLocale.flag : ''
})

const selectedLocaleName = computed(() => {
  const currentLocale = availableLocales.find((l) => l.code === locale.value)
  return currentLocale ? currentLocale.name : ''
})
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f0f2f5;
}

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
    margin-bottom: 15px;
  }

  &__title {
    color: #2c3e50;
    font-size: 1.8rem;
    margin: 0;
    flex-grow: 1;

    @media (max-width: 768px) {
      width: 100%;
      text-align: center;
      margin-bottom: 10px;
    }
  }

  &__language-switcher {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0;
    border: 1px solid #c0c0c0;
    border-radius: 6px;
    overflow: hidden;
    z-index: 100;
    background-color: #f8f8f8;
    transition:
      box-shadow 0.2s ease,
      border-color 0.2s ease;

    &:focus-within {
      border-color: #007bff;
      box-shadow: 0 0 0 1px #007bff;
    }

    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
      margin-top: 10px;
    }
  }

  &__language-icon {
    display: flex;
    align-items: center;
    color: #555;
    padding: 0 8px;
    border-right: 1px solid #c0c0c0;
    height: 38px;
    line-height: 1;
    pointer-events: none;
  }

  &__language-select {
    appearance: none;
    background-color: transparent;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    color: #555;
    width: 100%;
    height: 38px;
    line-height: 1.5;
    text-align: left;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 2;
  }

  &__selected-language-display {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #555;
    background-color: transparent;
    height: 38px;
    box-sizing: border-box;
    flex-grow: 1;
    justify-content: flex-start;
    position: relative;
    padding-right: 35px;
  }

  &__selected-flag {
    width: 30px;
    height: 20px;
    object-fit: cover;
    margin-right: 8px;
    border: 0.5px solid #eee;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  }

  &__dropdown-arrow {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #666;
    transition: transform 0.2s ease;
    pointer-events: none;
  }

  &__language-select:focus + &__selected-language-display &__dropdown-arrow {
    transform: translateY(-50%) rotate(180deg);
  }
}

/* Estilos para router-view para que el contenido se centre */
.router-view-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
