
export const cloneDeep = (origin: any, hashMap = new WeakMap()) => {
  if(origin == undefined || typeof origin !== 'object') {
    return origin;
  }
  if(origin instanceof Date) {
    return origin
  }
  if (origin instanceof RegExp) {
    return origin
  }
  const hashKey = hashMap.get(origin)
  if (hashKey) {
    return hashKey
  }
  const target = new origin.constructor()
  hashMap.set(origin, target)
  for (let k in origin) {
    if (origin.hasOwnProperty(k)) {
      target[k] = cloneDeep(origin[k], hashMap)
    }
  }
  return target
}