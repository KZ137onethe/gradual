import {isObject, isString} from "lodash-es";
import type {Recordable} from "./type.ts";
import dayjs  from "dayjs";

const DATE_TIME_FORMAT = "YYYY-MM-DD"
// join timestamp
export function joinTimestamp(join: boolean, restful = false) {
  if(!join) {
    return restful ? '' : {}
  }
  const now = Date.now()
  if(restful) {
    return `?_t=${now}`
  }
  return { _t: now }
}

export function formatRequestDate(params: Recordable) {
  if(!isObject(params)) {
    return
  }
  
  for(const key in params) {
    if(params[key] && params[key]._isDateObject) {
      params[key] = dayjs(params[key]).format(DATE_TIME_FORMAT)
    }
    if(isString(key)) {
      const value = params[key]
      if(value) {
        try {
          params[key] = isString(value) ? value.trim() : value
        } catch(error: any) {
          throw new Error(error)
        }
      }
    }
    if(isObject(params[key])) {
      formatRequestDate(params[key])
    }
  }
}

// 将一个对象的键值对转换为URL查询字符串的格式
export function setObjToUrlParams<T extends object>(url: string ,obj: T): string {
  return url + Object.entries(obj)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key as string)}=${encodeURIComponent(value)}`)
      .join('&')
}
