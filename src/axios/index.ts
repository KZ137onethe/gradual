import { VAxios } from "./instance"
import { CreateAxiosOptions } from "./type";
import { transform } from './axiosTransform.ts'
import {merge} from "lodash-es";
import {ContentType} from "@/utils/http.ts";

const urlPrefix = '/server_api'

function createAxios(opt?: Partial<CreateAxiosOptions>) {
    return new VAxios(
      merge(
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
            // TODO: 其他参数，比如：忽略重复请求，是否携带token，重试机制等
          },
          withCredentials: false,
        },
        opt || {}
      )
    )
}

export const httpRequest = createAxios()
