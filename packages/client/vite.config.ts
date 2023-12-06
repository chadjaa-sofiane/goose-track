import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import viteConfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svgr(), react(), viteConfigPaths()],
    test: {
        environment: 'jsdom',
        globals: true,
        css: true,
        setupFiles: 'src/setupTests.tsx',
    },
})
