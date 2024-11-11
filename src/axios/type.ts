export type CreateAxiosOptions = any

// 消息类型
/**
 * none => 调用时明确表示不希望自动弹出错误/成功提示
 * modal => 弹出模态框提示，用于一些比较重要的错误/成功
 * message => 弹出消息提示，用于一些相对不重要的错误/成功
 * notification => 弹出通知，用于一些不重要的成功
 */
export type ErrorMessageMode = 'none' | 'modal' | 'message'
export type SuccessMessageMode = 'none' | 'modal' | 'message' | 'notification'

export enum MessageTitle {
  SUCCESS = '成功提示',
  ERROR = '错误提示'
}

export type Recordable<T = any> = Record<string, T>

export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export interface RequestOptions {
  // 是否需要将请求参数拼接到url
  joinParamsToUrl?: boolean
  // 格式化请求参数时间
  formatDate?: boolean
  // 是否处理请求结果
  isTransformResponse?: boolean
  // 是否返回本地响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse?: boolean
  // 是否拼接url
  joinPrefix?: boolean
  // 接口地址，如果设置了请求地址，则接口地址会自动拼接在url前面，使用方式见文档说明
  apiUrl?: string
  // 请求拼接路径
  urlPrefix?: string
  // 错误消息提示类型
  errorMessageMode?: ErrorMessageMode
  // 成功消息提示类型
  successMessageMode?: SuccessMessageMode
  // 是否添加时间戳
  joinTime?: boolean
  ignoreCancelToken?: boolean
  // 是否在标头中发送令牌
  withToken?: boolean
}

export interface Result<T = any> {
  code: number
  type?: 'success' | 'error' | 'warning'
  message?: string
  msg?: string
  data?: T
  result?: T
}

export enum ResultEnum {
  SUCCESS = 0,
  ERROR = 1,
  TIMEOUT = 401,
  TYPE = 'success'
}

