
class HttpHandler {
  private data: any

  static defReqConfig = {
    header: {
      'Content-Type': 'application/json'
    },
    responseType: "json"
  }

  static transformHeaderData(data: string, separator: string) {
    return new Map(data.split(separator).map((item) => {
      const [key, val] = item.split("=")
      return [key.trim(), typeof val === 'string' ? val.trim() : true]
    }))
  }

  constructor(data) {
    this.register(data)
  }

  private register = (data) => {
    this.data = data
  }

  public use = (fn: (v: any) => any) => {
    this.data = fn(this.data)
  }

  get _data() {
    return this.data
  }
}

// 响应处理器
function respHandler(resp) {
  console.log("💬 ⋮ respHandler ⋮ resp => ", resp)
  const apiData = resp.data
  const respHeaders = resp.headers
  const responseType = resp.request?.responseType || 'json'
  // 二进制数据返回数据和文件信息
  if(['blob', 'arraybuffer'].includes(responseType)) {
    const contentMap = HttpHandler.transformHeaderData(respHeaders['content-disposition'], ';')
    return {
      data: apiData,
      info: {
        filename: contentMap.get('filename')
      }
    }
  }
  if(responseType === 'json') {
    return apiData.data
  }
  return resp
}

export {
  HttpHandler,
  respHandler
}

