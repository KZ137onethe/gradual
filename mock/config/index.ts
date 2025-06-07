// api路径
const apiPath = (path: string) => {
  return `${__APP_API_TEST__}/${path}`
}

// 响应信息数据结构
const responseDataStructure = (data: any) => {
  return {
    code: 200,
    success: true,
    message: "请求成功",
    data,
    timestamp: new Date().getTime()
  }
}

// 生成 min 到 max 之间的整数
function generateInteger(min: number, max: number): number;
function generateInteger(min: number): number;
function generateInteger(min: number, max?: number): number {
  if(!max) {
    max = min;
    min = 0;
  }
  if([min, max].every(num => Number.isInteger(num)) && max > min) {
    return Math.round(Math.random() * max - min) + min
  }
  throw new Error("min或者max不符合预期")
}

export {
  apiPath,
  responseDataStructure,
  generateInteger
}