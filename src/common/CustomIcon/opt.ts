import type { IconTypes } from './types'
import { eventBus } from '@/utils/eventBus'
// eslint-disable-next-line import/order
import { addIcon } from '@iconify/vue'

type IconOptParam = Partial<Pick<IconTypes, 'isLocal' | 'prefix' | 'size' | 'fillColor' | 'hoverColor' | 'folder'>>
interface CssAttrs {
  style: Record<string, string | undefined>
  other: Record<string, string | undefined>
}

class IconOpt {
  public localPrefix = 'local'
  public iconName?: string
  public iconCSS?: Record<string, any>
  public folder?: string
  constructor(public name: string, opt: Partial<IconOptParam>) {
    if (IconOpt.verify(name)) {
      this.init(opt).then(() => eventBus.emit('iconLoaded'))
    }
  }

  static verify(name: string) {
    if (name === '' || !name) {
      console.warn('name 字段为空，初始化失败！')
      return false
    }
    return true
  }

  async init(opt: IconOptParam) {
    this.iconName = await this.getIconName(opt)
    this.iconCSS = this.getIconCSS(opt)
  }

  async getIconName(opt: Pick<IconTypes, 'isLocal' | 'prefix' | 'folder' | 'size'>) {
    if (opt.isLocal && opt.folder) {
      this.folder = opt.folder
      return await this.addLocalIcon(opt.size!)
    } else {
      eventBus.emit('iconLoaded', 'remote')
      if (opt.prefix !== '' && opt.prefix) {
        return `${opt.prefix}:${this.name}`
      } else {
        return this.name
      }
    }
  }

  getIconCSS(opt: Pick<IconOptParam, 'fillColor' | 'hoverColor' | 'size' >): CssAttrs {
    const { fillColor, hoverColor, size } = opt
    return {
      style: {
        width: `${size}px`,
        height: `${size}px`,
        fill: fillColor,
      },
      other: {
        hoverColor,
      },
    }
  }

  async addLocalIcon(size: number) {
    const iconModule = await import(`@/assets/${this.folder}/${this.name}.svg?raw`)
    addIcon(`${this.localPrefix}:${this.name}`, {
      body: iconModule.default,
      width: size,
      height: size,
    })

    return `${this.localPrefix}:${this.name}`
  }
}

const color = {
  fill: '#ff7f50',
  hover: '#2ecc71',
}

export default IconOpt
export {
  color,
}
