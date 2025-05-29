import { createI18n } from 'vue-i18n'

// Importa tus archivos de traducción JSON
import enMessages from '@/locales/en.json'
import esMessages from '@/locales/es.json'
import itMessages from '@/locales/it.json'

// Define los idiomas disponibles, sus nombres completos y la ruta a su bandera
export const availableLocales = [
  { code: 'es', name: 'Español', flag: '/flags/es.svg' },
  { code: 'en', name: 'English', flag: '/flags/us.svg' },
  { code: 'it', name: 'Italiano', flag: '/flags/it.svg' },
]

const i18n = createI18n({
  locale: 'es',
  fallbackLocale: 'en',
  messages: {
    en: enMessages,
    es: esMessages,
    it: itMessages,
  },
  legacy: false,
  globalInjection: true,
})

export default i18n
