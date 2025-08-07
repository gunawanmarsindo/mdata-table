import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const baseConfig = {
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  }

  if (mode === 'library') {
    return {
      ...baseConfig,
      plugins: [
        ...baseConfig.plugins,
        dts({
          insertTypesEntry: true,
          include: ['src/index.ts', 'src/lib/**/*'],
          exclude: ['src/main.tsx', 'src/App.tsx', '**/*.test.*', '**/*.spec.*']
        })
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'MDataTable',
          formats: ['es', 'cjs'],
          fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
        },
        rollupOptions: {
          external: ['react', 'react-dom', '@tanstack/react-table'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              '@tanstack/react-table': 'ReactTable'
            }
          }
        },
        sourcemap: true
      }
    }
  }

  // Development mode
  return baseConfig
})
