import type { App } from 'vue'
import CustomIcon from './CustomIcon'

export function setupGlobCom(app: App<Element>): void {
  app.component('custom-icon', CustomIcon)
}
