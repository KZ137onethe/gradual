import type { AxiosRequestConfig } from 'axios'
import type { ConfigType, pendingMapValueType } from './type.ts'
import { isFunction } from "@/utils/type.ts"

let pendingMap = new Map<string, pendingMapValueType>()

export function getPendingUrl(config: AxiosRequestConfig) {
  return [config.method, config.url, JSON.stringify(config.data), JSON.stringify(config.params)].join('&')
}

export class AxiosCanceler {
  // 添加请求
  addPending(config: AxiosRequestConfig<any> & ConfigType) {
    this.removePending(config)
    const url = getPendingUrl(config)
    const { controller } = config.requestOptions
    if (config.signal) {
      if (!pendingMap.has(url)) {
        pendingMap.set(url, { controller, signal: config.signal })
      }
    }
  }

  // 取消（也可以是暂停）所有的请求，然后清空pendingMap
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel()
    })
    pendingMap.clear()
  }

  // 取消请求
  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config)
    if (pendingMap.has(url)) {
      const pending = pendingMap.get(url)
      pending && pending.controller.abort()
      pendingMap.delete(url)
    }
  }

  // 清空
  reset() {
    pendingMap = new Map<string, pendingMapValueType>()
  }
}
