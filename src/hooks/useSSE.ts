import { ref } from "vue"

// 创建一个SSE（服务器推送事件）接收函数
export function createSSE<T>(url: string, header: Record<string, string>) {
  const isCancelled = ref<boolean>(false)
  const data = ref<T[]>([])
  const controller = new AbortController()
  const conenct = async () => {
    try {
      const headers = new Headers()
      headers.append("Content-Type", "text/event-stream")
      headers.append("Cache-Control", "no-cache")
      headers.append("Connection", "keep-alive")
      for (const key in header) {
        headers.set(key, header[key])
      }
      const response = await fetch(url, {
        method: "GET",
        headers,
        signal: controller.signal
      })
      if (!response.ok) throw new Error("SSE 连接失败")

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      while (!isCancelled.value) {
        const { done, value } = await reader.read()
        if (done) break
        // 处理流数据
        const chunk = decoder.decode(value)
        if (chunk.startsWith("data:")) {
          data.value = JSON.parse(chunk.replace("data:", "").trim())?.data
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
  return {
    data,
    conenct,
    close: () => {
      isCancelled.value = true
      controller.abort()
    }
  }
}
