export const isString = (value: any): value is string => {
  return Object.prototype.toString.call(value) === '[object String]'
}

export const isNumber = (value: any):value is number => {
  return Object.prototype.toString.call(value) === '[object Number]'
}

export const isBoolean = (value: any): value is boolean => {
  return Object.prototype.toString.call(value) === '[object Boolean]'
}

export const isFunction = (value: any): value is Function => {
  return Object.prototype.toString.call(value) === '[object Function]'
}

export const isObject = (value: any): value is object => {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export const isArray = (value: any): value is Array<any> => {
  return Object.prototype.toString.call(value) === '[object Array]'
}

export const isNull = (value: any): value is null => {
  return Object.prototype.toString.call(value) === '[object Null]'
}

export const isUndefined = (value: any): value is undefined => {
  return Object.prototype.toString.call(value) === '[object Undefined]'
}

export const isSymbol = (value: any): value is symbol => {
  return Object.prototype.toString.call(value) === '[object Symbol]'
}

export const isDate = (value: any): value is Date => {
  return Object.prototype.toString.call(value) === '[object Date]'
}



