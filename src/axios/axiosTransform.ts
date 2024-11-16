import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import type { Result, RequestOptions, Recordable, ConfigType } from "./type.ts"
import { ResultEnum, RequestEnum, MessageTitle } from "./type.ts"
import { isObject, isString } from "lodash-es"
import { joinTimestamp, formatRequestDate, setObjToUrlParams } from "./helps.ts"
import { ElNotification } from "element-plus"
import { checkStatus } from "@/axios/checkStatus.ts"
import axios from "axios"

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string
  transform?: AxiosTransform
  requestOptions?: RequestOptions
}

export abstract class AxiosTransform {
  // 请求之前的hook钩子
  beforeRequestHook?: (config: AxiosRequestConfig, options?: RequestOptions) => AxiosRequestConfig
  // 请求成功后的处理
  transformRequestHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any
  // 请求失败后的处理
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>
  // 请求之前的拦截器
  requestInterceptors?: (config: AxiosRequestConfig, options?: CreateAxiosOptions) => AxiosRequestConfig
  // 请求之后的拦截器
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>
  // 请求之前的拦截器错误处理
  requestInterceptorsCatch?: (error: AxiosError) => void
  // 请求之后的拦截器错误处理
  responseInterceptorsCatch?: (error: AxiosError<Result, any> & { config: ConfigType }) => void
}

// 数据处理器
export const transform: AxiosTransform = {
  // 请求之前处理config
  beforeRequestHook: (config: AxiosRequestConfig<any>, options?: RequestOptions) => {
    if(!options) return config
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options
    
    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }
    
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }
    const params = config.params || {}
    const data = config.data || false
    formatDate && data && !isString(data) && formatRequestDate(data)
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        if (Reflect.has(config, "data") && config.data && Object.keys(config.data).length > 0) {
          config.data = data
          config.params = params
        } else {
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data))
        }
      } else {
        // 兼容 restful 风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },
  // 处理请求数据。如果数据不是预期格式，可直接抛出错误
  transformRequestHook: (res: AxiosResponse<Result, AxiosRequestConfig & ConfigType>, options: RequestOptions) => {
    const { isTransformResponse, isReturnNativeResponse } = options
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取信息时开启
    if (!isTransformResponse) {
      return res.data
    }
    const { data } = res
    console.log(data)
    if (!data) {
      throw new Error("请求出错，请稍后重试")
    }
    // TODO: 修改为自己项目中的接口返回格式
    const { code, result, message, type, data: _data, msg } = data
    const tipInfo = message || msg
    let hasSuccess: boolean = true
    if (isObject(data)) {
      hasSuccess = data && Reflect.has(data, "code") && (code === ResultEnum.SUCCESS || code === 200)
    }
    console.log(hasSuccess)
    if (hasSuccess) {
      if (type === 'success' && tipInfo && options.successMessageMode) {
        // 信息成功提示
        switch (options.successMessageMode) {
          case "message":
            ElMessage({
              message: tipInfo,
              type: "success",
              duration: 2000,
            })
            break
          case "notification":
            ElNotification({
              title: tipInfo || MessageTitle.SUCCESS,
              type: "success",
              message: h("i", { style: "color: #206864" }, tipInfo),
              duration: 2000,
            })
            break
          case "modal":
            ElMessageBox({
              title: tipInfo || MessageTitle.SUCCESS,
              message: h("i", { style: "color: #206864" }, tipInfo),
              type: "success",
              showClose: true,
            }).then(undefined)
            break
          default:
        }
        // 兼容导出接口
        return isObject(data) ? data : result ? result : undefined
      }
    }
    
    // TODO: 在此处根据自己项目的实际情况对不同的code执行不同的操作
    
    if (options.errorMessageMode === "modal") {
      ElMessageBox({
        title: tipInfo || MessageTitle.SUCCESS,
        center: true,
        type: "error",
        showClose: true,
        message: h("i", { style: "color: #206864" }, tipInfo),
      }).then(undefined)
    }
    throw new Error("请求出错，请稍候重试")
  },
  // 请求拦截器处理
  requestInterceptors: (config: Recordable<any>, options?: CreateAxiosOptions) => {
    if(!options) return config
    // 请求之前处理config
    // TODO: 这里可以处理 token 等配置
    return config as AxiosRequestConfig
  },
  // 响应拦截器处理
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },
  /**
   * 响应错误拦截器处理
   * TODO: 搞清axios的错误信息
   * @param error
   */
  responseInterceptorsCatch: (error: AxiosError<Result, any> & { config: ConfigType }) => {
    const { response, code, message, config } = error
    const errorMessageMode = config?.requestOptions?.errorMessageMode || "none"
    const msg: string = response?.data?.message ?? ""
    const err: string = error?.toString?.() ?? ""
    let errMessage = ""
    
    try {
      // 请求被取消，可以通过这个方法来判断
      if (axios.isCancel(error)) {
        errMessage = "请求被取消"
      }
      if (code === "ECONNABORTED" || message.includes("timeout")) {
        errMessage = "接口请求超时，请刷新页面重试！"
      }
      if (err?.includes("Network Error")) {
        errMessage = "网络异常，请检查您的网络连接是否正常！"
      }
      if (errMessage) {
        if (errorMessageMode === "modal") {
          ElMessageBox({
            title: MessageTitle.ERROR,
            center: true,
            type: "error",
            showClose: true,
            message: h("i", { style: "color: #206864" }, errMessage),
          }).then(undefined)
        } else if (errorMessageMode === "message") {
          ElMessage({
            message: errMessage,
            type: "error",
            duration: 2000,
          })
        }
        return Promise.reject(error)
      }
    } catch (error: any) {
      throw new Error(error)
    }
    
    checkStatus(response!.status, msg, errorMessageMode)
    // TODO: 可以添加一些机制，比如：自动重试机制等等
    return Promise.reject(error)
  },
}
