import path from 'node:path'
import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
// import WebfontDownload from 'vite-plugin-webfont-dl'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {

  return {
    plugins: [
      vue(),
      vueJsx(),
      VueRouter({
        routesFolder: [
          // 路由会扫描哪些文件以及配置
          {
            src: 'src/pages',
            path: '',
            // 排查路径名
            exclude: ['**/_components/**', '**/_data/**'],
            // 解析的文件类型
            extensions: ['.vue'],
          },
        ],
        dts: 'types/plugins/auto-router.d.ts',
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', VueRouterAutoImports],
        resolvers: [ElementPlusResolver()],
        dts: 'types/plugins/auto-import.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'types/plugins/auto-components.d.ts',
      }),
      // WebfontDownload([
      //   'https://fonts.bunny.net/css?family=noto-sans-sc:100,200,300,400,500,600,700,800,900|zcool-kuaile:400',
      // ]),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 全局注入
          additionalData: `@use "@/styles/reset.scss" as *;`,
          devSourcemap: true
        }
      }
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.ts', '.js', '.mjs', '.jsx', '.tsx', '.json', '.vue'],
    },
    server: {
      port: 5173,
      strictPort: true,
      open: true,
    },
    build: {
      outDir: 'dist',
    },
    cacheDir: 'dist/.cache'
  }
})
