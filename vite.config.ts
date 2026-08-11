import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Fourfeeter/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/**'],
      exclude: [
        'src/test/**',
        'src/**/*.test.{ts,tsx}',
        'src/lang/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
})
