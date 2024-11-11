import { createApp } from 'vue'
import "./styles/index.scss"
import App from './App.vue'

import { router } from './router'
import {setupGlobCom} from "./common";

const app = createApp(App)
app.use(router)
app.use(setupGlobCom)
app.mount('#app')
