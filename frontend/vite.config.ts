import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  base: '/app/klasspuls/',
  server: {
	proxy: {
		'/app/klasspuls/api': {
			target: 'http://localhost:3005',
			rewrite: path => path.replace('/app/klasspuls', '')
		}
	}
  }
})
