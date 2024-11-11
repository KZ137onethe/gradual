import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import type {CreateAxiosOptions, RequestOptions, Result} from "./type.ts";
import { isFunction, cloneDeep } from "lodash-es";
import {AxiosCanceler} from "@/axios/axiosCancel.ts";

export class VAxios {
  private axiosInstance: AxiosInstance;
  private options: CreateAxiosOptions;
  
  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors()
  }
  
  getAxios(): AxiosInstance {
    return this.axiosInstance;
  }
  
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return
    }
    this.createAxios(config);
  }
  
  setHeader(headers: any) {
    if (!this.axiosInstance) {
      return
    }
    Object.assign(this.options, headers);
  }
  
  //  创建axios实例
  private createAxios(config: CreateAxiosOptions) {
    this.axiosInstance = axios.create(config)
  }
  
  private getTransform() {
    const {transform} = this.options
    return transform;
  }
  
  // 拦截器配置
  private setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) {
      return
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch
    } = transform
    
    const axiosCanceler = new AxiosCanceler()
    
    // 请求拦截器配置
    this.axiosInstance.interceptors.request.use(
        (config: AxiosRequestConfig): AxiosRequestConfig => {
          const {
            headers: { ignoreCancelToken }
          }  = config as AxiosRequestConfig & { headers: any}
          const ignoreCancel =
              ignoreCancelToken !== undefined
                  ? ignoreCancelToken
                  : this.options.requestOptions?.ignoreCancelToken;
          !ignoreCancel && axiosCanceler.addPending(config)
          
          if (requestInterceptors && isFunction(requestInterceptors)) {
            config = requestInterceptors(config, this.options)
          }
          return config
        }, undefined
    );
    
    // 请求拦截器错误捕获处理
    requestInterceptorsCatch && isFunction(requestInterceptorsCatch)
    && this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);
    
    // 响应结果拦截器处理
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && axiosCanceler.removePending(res.config)
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res;
    }, undefined)
    
    // 响应结果拦截器错误捕获处理
    responseInterceptorsCatch && isFunction(responseInterceptorsCatch)
    && this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
  }
  
  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: AxiosRequestConfig = cloneDeep(config);
    const transform = this.getTransform();
    
    const {requestOptions} = this.options;
    
    const opt: RequestOptions = Object.assign({}, requestOptions, options)
    
    const {beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {}
    console.log(requestCatchHook, transformRequestHook)
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }
    
    // @ts-ignore
    conf.requestOptions = opt;
    
    return new Promise((resolve, reject) => {
      this.axiosInstance
      .request<any, AxiosResponse<Result>>(conf)
      .then((res: AxiosResponse<Result>) => {
        // 请求是否被取消
        const isCancel = axios.isCancel(res)
        if (transformRequestHook && isFunction(transformRequestHook) && !isCancel) {
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
    return this.request({...config, method: "GET"}, options)
  }
  
  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({...config, method: "POST"}, options)
  }
  
  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({...config, method: "PUT"}, options)
  }
  
  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({...config, method: "DELETE"}, options)
  }
}
