<script setup lang="ts">
import { Ofdview } from "ofdview-vue3"
import * as parser from "parser_x.js"

const fileData = ref<any>()

const downloadFile = () => {
  fetch('/api/v1/ofd-file', { method: "POST", body: JSON.stringify({ "name": "1" }), headers: { 'Content-Type': 'application/json' } })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error, http status: ${response.status}`)
      }
      return response.blob()
    })
    .then((blobData) => {
      const url = fileData.value = URL.createObjectURL(blobData)
      const aEl = document.createElement('a')
      aEl.href = url
      aEl.download = '1.ofd'
      aEl.click()
      document.body.removeChild(aEl)
      console.log("文件下载成功")
    })
    .catch(err => {
      console.error("下载失败：", err)
    })
}
</script>

<template>
  <div class="page">

    <el-button type="primary" @click="downloadFile">下载ofd文件</el-button>

    <ofdview style="height: 100vh" :file="fileData" :mem="parser" :can-close="true"></ofdview>
  </div>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  width: 60vw;
  margin: 10px auto 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  &-container {
    text-align: center;
  }
}

.table-pagination {
  margin-top: 10px;
  justify-content: center;
}
</style>
