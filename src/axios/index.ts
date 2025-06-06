import type { CreateAxiosOptions } from './type'
import { ContentType } from '@/utils/http.ts'
import { transform } from './axiosTransform.ts'
import { VAxios } from './instance'

const urlPrefix = '/server_api'

// 创建axios实例
function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    Object.assign(
      // 第一个对象是默认配置
      {
        timeout: 10 * 1000,
        authenticationScheme: '',
        // 接口前缀
        prefixUrl: urlPrefix,
        headers: { 'Content-Type': ContentType.JSON },
        // 数据处理方式
        transform,
        // 配置项
        requestOptions: {
          // 默认将 prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: false,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'none',
          // 接口地址
          apiUrl: '',
          // 接口拼接地址
          urlPrefix: '',
          // 是否加入时间戳
          joinTime: true,
          // 是否忽略 取消请求
          ignoreCancel: true,
          // 取消请求的AbortController对象
          controller: AbortController,
          // TODO: 其他参数，比如：忽略重复请求，是否携带token，重试机制等
        },
        withCredentials: false,
      },
      opt || {},
    ),
  )
}

export const httpRequest = createAxios()
