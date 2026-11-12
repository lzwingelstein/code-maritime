import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Same alias as Nuxt, for plain TS modules tested without Nuxt.
    alias: { '~': fileURLToPath(new URL('./app', import.meta.url)) },
  },
  test: {
    include: ['app/**/*.test.ts'],
    // The theme tokens are read as text by the contrast test: do not let Vitest blank the CSS files.
    css: { include: [/assets\/themes\/.+\.css/] },
  },
})
