import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/intelligent-task-manager', // ¡IMPORTANTE! Reemplaza 'gestor-de-tareas' con el nombre exacto de tu repositorio
  // Si tu repositorio es https://<USERNAME>.github.io/mi-repo/, entonces base es '/mi-repo/'
  // Si es un proyecto de usuario/organización (https://<USERNAME>.github.io/), entonces base es '/'
  build: {
    outDir: 'docs', // Opcional: GitHub Pages por defecto busca en 'docs/' o 'root/'.
    // Si prefieres mantener 'dist', tendrás que configurarlo en GitHub Pages manualmente.
    // Para simplicidad, podemos usar 'docs'.
  },
})
