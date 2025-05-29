<script setup lang="ts">
import Children from './_components/children.vue'

import { judgeHandler } from '@/utils/handler'
import { TABLE_DATA } from "./_data/example.json"
import { usePagination } from '@/hooks/usePagiation'

// #region 图标
const dynamicIconName = ref('anchor-off')
// #endregion

// #region 判断处理器
const randomVal = ref(0)
judgeHandler<number>(randomVal.value, new Map<number | number[] | symbol, Function>([
  [
    1,
    () => {
      console.log('值是1')
    }
  ],
  [
    [2, 3],
    () => {
      console.log('值是2或3')
    }
  ],
  [
    Symbol("default"),
    () => {
      console.log('值是其他')
    }
  ]
]))
onMounted(() => {
  randomVal.value = Math.floor(Math.random() * 9 + 1)
})
// #endregion

// #region 分页器 hooks
const tableData = ref()
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination({ total: TABLE_DATA.length })

function getMockData(current: number, limit: number = 10) {
  return TABLE_DATA.slice((current - 1) * limit, current * limit)
}

watch(() => paginationData, (cur, _) => {
  tableData.value = getMockData(cur.currentPage!, cur.pageSize)
}, {
  immediate: true,
  deep: true
})
// #endregion
</script>

<template>
  <div class="page">

    <el-divider content-position="left">网络请求</el-divider>
    <Children #default="{ render }">
      {{ render.hitokoto }} - {{ render.from_who ?? '佚名' }}
    </Children>

    <el-divider content-position="left">自定义图标</el-divider>
    <div class="icon-item-area">
      <custom-icon is-local folder="icon" :name="dynamicIconName" :size="24" dynamic />
      <custom-icon is-local folder="icon" name="beer" fill-color="#ebeee8" hover-color="#d08635" :size="20" />
      <custom-icon prefix="ic" name="baseline-roundabout-left" fill-color="#b1d5c8" />
      <custom-icon prefix="proicons" name="apple" />
      <custom-icon name="flat-color-icons:alarm-clock" />
    </div>

    <el-divider content-position="left">表格 hooks 示例</el-divider>
    <div class="table-hooks-example">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" width="300" />
      </el-table>
      <el-pagination class="table-pagination" background v-model:current-page="paginationData.currentPage"
        v-model:page-size="paginationData.pageSize" :page-sizes="paginationData.pageSizes"
        :layout="paginationData.layout" :total="paginationData.total" @current-change="handleCurrentChange"
        @size-change="handleSizeChange"></el-pagination>
    </div>

    <el-divider content-position="left">Vue全局挂载 对话框、抽屉、消息提示、消息弹出框、通知，ts可以统一全局API去调用</el-divider>

  </div>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  width: 60vw;
  margin: 0 auto;
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
