import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

export const router = createRouter({
  history: createWebHistory(),
  // 这里使用了自动路由配置，类似与Nuxt，参考文档：https://uvr.esm.is/guide/file-based-routing.html
  routes: routes
})
