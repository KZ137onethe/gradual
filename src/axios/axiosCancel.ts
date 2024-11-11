import axios, { AxiosRequestConfig, Canceler } from 'axios'
import {isFunction} from "lodash-es";

let pendingMap = new Map<string, Canceler>()

export const getPendingUrl = (config: AxiosRequestConfig) =>
    [config.method, config.url, JSON.stringify(config.data), JSON.stringify(config.params)].join('&')

export class AxiosCanceler {
  
  // 添加请求
  addPending(config: AxiosRequestConfig) {
    this.removePending(config)
    const url = getPendingUrl(config)
    config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken((cancel) => {
          if(!pendingMap.has(url)) {
            pendingMap.set(url, cancel)
          }
        })
  }
  
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && isFunction(cancel) && cancel()
    })
    pendingMap.clear()
  }
  
  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config)
    if(pendingMap.has(url)) {
      const cancel = pendingMap.get(url)
      cancel && cancel(url)
      pendingMap.delete(url)
    }
  }
  
  reset() {
    pendingMap = new Map<string, Canceler>()
  }
}
