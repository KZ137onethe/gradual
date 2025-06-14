import { isArray, isSymbol } from "./type"

type judgeType = number | string


// TODO
/**
 * 1. 处理简单范围内的值，如  val >= 10 && val < 20 的情况
 * 2. 处理返回值
 */
/**
 * 判断处理器函数
 * @param  code 判断的变量
 * @param  handlerMap 取值和处理器函数的映射
 * @description 可以处理单个值、多个值的判断，支持Symbol类型的key来执行默认情况
 */
function judgeHandler<T = judgeType>(code: T, handlerArr: [T | T[] | symbol, Function][]) {
  const storeMap = new Map(handlerArr)
  const judgeKeys = handlerArr.map((item) => item[0])
  // 校验
  if (judgeKeys.flat().length !== new Set(judgeKeys.flat()).size) throw new Error('handlerMap中key中存在重复值')
  if (judgeKeys.flat().filter((item) => isSymbol(item)).length > 1) throw new Error('Symbol类型的key值不能大于1个')

  // 如果code能直接从Map的key中取出，直接执行
  if (storeMap.has(code as any)) return storeMap.get(code)!()
  // 如果code在judgeKeys的二维数组中，代表code可以是这个数组的取值
  if (judgeKeys.flat().includes(code)) {
    const [key] = judgeKeys.filter(item => {
      return isArray(item) && item.includes(code)
    })
    return storeMap.get(key)!()
  }
  // code 的 else 判断
  if (judgeKeys.some(item => isSymbol(item))) {
    const [key] = judgeKeys.filter(item => {
      return isSymbol(item)
    })
    return storeMap.get(key)!()
  }
}

export {
  judgeHandler
}