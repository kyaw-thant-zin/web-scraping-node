import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'


// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue({
      template: {
        transformAssetUrls
      },
    }),
    quasar({
      autoImportComponentCase: 'combined'
    }),
    VitePluginBrowserSync()
  ],
  resolve: {
    alias: [
      {
        // '@': resolve(__dirname, '/src'),
        find: '@',
        replacement: resolve(__dirname, '/src'),
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
      }
    ]
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
