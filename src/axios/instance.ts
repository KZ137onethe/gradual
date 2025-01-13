import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ConfigType, CreateAxiosOptions, RequestOptions, Result } from './type.ts'
import axios from 'axios'
import { cloneDeep, isFunction, merge } from 'lodash-es'
import { AxiosCanceler } from '@/axios/axiosCancel.ts'

export class VAxios {
  private axiosInstance: AxiosInstance
  private readonly options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return
    }
    this.createAxios(config)
  }

  setHeader(headers: any) {
    if (!this.axiosInstance) {
      return
    }
    Object.assign(this.options, headers)
  }

  // 创建axios实例
  private createAxios(config: CreateAxiosOptions) {
    this.axiosInstance = axios.create(config)
  }

  // 获取options中的数据处理方式
  private getTransform() {
    const { transform } = this.options
    return transform
  }

  // 获取options中的请求配置
  private getRequestOptions() {
    const { requestOptions } = this.options
    return requestOptions
  }

  // 拦截器配置，会使用transform的拦截器配置
  private setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) {
      return
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform

    const axiosCanceler = new AxiosCanceler()

    // 请求拦截器配置
    this.axiosInstance.interceptors.request.use((config) => {
      /**
       * 取消请求：https://www.axios-http.cn/docs/cancellation
       * 可以从 requestOptions 的 ignoreCancel 判断是否忽略取消请求的行为
       */
      const { signal: cancelRequestSignal } = config
      const { ignoreCancel } = this.getRequestOptions()
      if (!ignoreCancel && cancelRequestSignal) {
        axiosCanceler.addPending(config)
      }

      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options)
      }
      return config
    }, undefined)

    // 请求拦截器错误捕获处理
    requestInterceptorsCatch
    && isFunction(requestInterceptorsCatch)
    && this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch)

    // 响应结果拦截器处理
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && axiosCanceler.removePending(res.config)
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res
    }, undefined)

    // 响应结果拦截器错误捕获处理
    responseInterceptorsCatch
    && isFunction(responseInterceptorsCatch)
    && this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch)
  }

  // 自定义请求，会使用transform的钩子
  request<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions,
  ): Promise<T> {
    let conf = cloneDeep(config) as AxiosRequestConfig & ConfigType
    const transform = this.getTransform()
    const requestOptions = this.getRequestOptions()

    const opt: RequestOptions = merge({}, requestOptions, options)

    const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {}
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }

    conf.requestOptions = opt

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt)
              resolve(ret)
            } catch (err) {
              reject(err || new Error('request error!'))
            }
            return
          }
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e))
            return
          }
          reject(e)
        })
    })
  }

  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options)
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options)
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options)
  }
}
