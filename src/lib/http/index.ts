import { CreateAxiosOptions } from "@/axios/type"
import axios, { type AxiosInstance } from "axios"
import { HttpHandler, respHandler } from "./handler"

type interceptorsHandlerKey = "reqSuccess" | "reqError" | "respSuccess" | "respError"

class HttpEventEmitter {
  public http: AxiosInstance
  private handlers: Record<string, Set<Function>> = {
    'PARAM_CHECK_FAILD': new Set(),
    'INVAILD_TOKEN': new Set()
  }
  private interceptorsHandler = new Map<interceptorsHandlerKey, (v: any) => any | Promise<any>>([
    ['reqSuccess', (v) => v],
    ['reqError', (v) => Promise.reject(v)],
    ['respSuccess', (v) => v],
    ['respError', (v) => Promise.reject(v)]
  ])

  constructor(options: CreateAxiosOptions) {
    this.http = this.init(options)
  }

  init(options: CreateAxiosOptions) {
    const instance = axios.create(options)

    instance.interceptors.request.use(
      this.reqSuccessHandler,
      this.reqErrorHandler
    )

    instance.interceptors.response.use(
      this.respSuccessHandler,
      this.respErrorHandler
    )

    return instance
  }

  setInterceptorsHandler(name: interceptorsHandlerKey, handler: (v: any) => any | Promise<any>) {
    this.interceptorsHandler.set(name, handler)
  }

  private reqSuccessHandler = <T>(config: T) => {
    return this.interceptorsHandler.get('reqSuccess')?.(config)
  }

  private reqErrorHandler = (error: any) => {
    return this.interceptorsHandler.get('reqError')?.(error)
  }

  private respSuccessHandler = <T>(resp: T) => {
    return this.interceptorsHandler.get('respSuccess')?.(resp)
  }

  private respErrorHandler = (error: any) => {
    return this.interceptorsHandler.get('respError')?.(error)
  }

  listen = (eventName: string, hanlder: Function) => {
    this.handlers[eventName].add(hanlder)
  }

  emit = (eventName: string, ...args: any[]) => {
    this.handlers[eventName].forEach((handler) => {
      handler(...args)
    })
  }
}

// TODO: 以插件的方式来加入这些预处理
function request(config): any {
  // TODO: 加入鉴权
  const service = new HttpEventEmitter({
    baseURL: "http://localhost:5173" + __APP_API_TEST__,
    timeout: 3000
  })
  const mergeConfig = Object.assign({}, HttpHandler.defReqConfig, config)
  service.setInterceptorsHandler('reqSuccess', (config) => {
    return config
  })
  service.setInterceptorsHandler('respSuccess', (repsonse) => {
    const handler = new HttpHandler(repsonse)
    handler.use(respHandler)
    return handler._data
  })
  service.setInterceptorsHandler('respError', (error) => {
    const code = error.response.status
    // TODO: 处理不同的状态码
    return Promise.reject(code)
  })
  return service.http(mergeConfig)
}

export {
  HttpEventEmitter,
  request
}