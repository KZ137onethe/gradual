import { judgeHandler } from "@/utils/handler"
import axios, { type AxiosInstance } from "axios"

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

  constructor(url: string) {
    this.http = this.init(url)
  }

  init(url: string) {
    const instance = axios.create({
      baseURL: url
    })

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

// TODO: 加入鉴权
function request(config): any {
  const service = new HttpEventEmitter("http://localhost:5173" + __APP_API_TEST__)
  service.http.defaults.timeout = 3000
  service.setInterceptorsHandler('reqSuccess', (config) => {
    config.headers['Content-Type'] = 'application/json'
    return config
  })
  service.setInterceptorsHandler('respSuccess', (repsonse) => {
    const { data: res, status } = repsonse
    switch (status) {
      case 200:
        return res.data
      default:
        return res
    }
  })
  service.setInterceptorsHandler('respError', (error) => {
    const code = error.response.status
    judgeHandler<number>(code, [
      [
        401,
        () => { }
      ],
      [
        404,
        () => { }
      ]
    ])
    return Promise.reject(code)
  })
  return service.http(config)
}

export default request