import { createApp } from 'vue'
import App from './App.vue'
import setupGlobCom from './common'

import { router } from './router'
import './styles/index.scss'

const setupAll = async () => {
  const app = createApp(App)
  app.use(router)
  app.use(setupGlobCom)
  app.mount('#app')
}

setupAll()
