import { isArray, isSymbol } from "./type"

type judgeType = number | string


// TODO: 处理简单范围内的值
/**
 * 判断处理器函数
 * @param  code 判断的变量
 * @param  handlerMap 取值和处理器函数的映射
 * @description 可以处理单个值、多个值的判断，支持Symbol类型的key来执行默认情况
 */
function judgeHandler<T = judgeType>(code: T, handlerMap: Map<T | T[] | symbol, Function>) {
  const judgeKeys = Array.from(handlerMap.keys())
  // 校验
  if(judgeKeys.flat().length !== new Set(judgeKeys.flat()).size) throw new Error('handlerMap中key中存在重复值')
  if(judgeKeys.flat().filter((item) => isSymbol(item)).length > 1) throw new Error('Symbol类型的key值不能大于1个')

  // 如果code能直接从Map的key中取出，直接执行
  if(handlerMap.has(code as any)) return handlerMap.get(code)!()
  // 如果code在judgeKeys的二维数组中，代表code可以是这个数组的取值
  if(judgeKeys.flat().includes(code)) {
    const [key] = judgeKeys.filter(item => {
      return isArray(item) && item.includes(code)
    })
    return handlerMap.get(key)!()
  }
  // code 的 else 判断
  if(judgeKeys.some(item => isSymbol(item))) {
    const [key] = judgeKeys.filter(item => {
      return isSymbol(item)
    })
    return handlerMap.get(key)!()
  }
}

export {
  judgeHandler
}