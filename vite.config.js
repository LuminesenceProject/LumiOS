import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
 plugins: [
   react(),
   viteSingleFile()
 ],
 build: {
   cssCodeSplit: false,
   assetsInlineLimit: 100000000,
   rollupOptions: {
     output: {
       inlineDynamicImports: false
     },
   }
 }
})