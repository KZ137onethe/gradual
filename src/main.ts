import { createApp } from 'vue'
import App from './App.vue'
import setupGlobCom from './common'

import { router } from './router'
import './styles/index.scss'

import ofdview from 'ofdview-vue3';
import 'ofdview-vue3/viewer.css'

const app = createApp(App)
app.use(router)
app.use(setupGlobCom)
app.use(ofdview)
app.mount('#app')
