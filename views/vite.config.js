import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'


// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          includeAbsolute: false,
        },
      },
    }),
    vuetify({ autoImport: true }),
    VitePluginBrowserSync()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '/src'),
    },
  },
  build: {
    rollupOptions: {
      input: resolve(__dirname, '/src/main.js'),
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
  },
  configureServer: app => {
    app.use(
      require("sass").middleware({
        src: __dirname,
        dest: __dirname,
        outputStyle: "compressed",
        prefix: "/",
      })
    );
  },
});
