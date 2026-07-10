import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/gait-analysis/, so asset URLs must
  // be prefixed with the repo path. Change if the deploy path changes.
  base: '/gait-analysis/',
  plugins: [react()],
})
