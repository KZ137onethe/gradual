<script setup lang="ts">
import { judgeHandler } from '@/utils/handler'
import Children from './components/children.vue'

const dynamicIconName = ref('anchor-off')
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
</script>

<template>
  <div class="page">
    <div class="page-container">
      <custom-icon
        is-local
        folder="icon"
        :name="dynamicIconName"
        :size="24"
        dynamic
      />
      <Children #default="{ render }">
        {{ render.hitokoto }} - {{ render.from_who ?? '佚名' }}
      </Children>
    </div>

    <div class="icon-item-area">
      <custom-icon
        is-local
        folder="icon"
        name="beer"
        fill-color="#ebeee8"
        hover-color="#d08635"
        :size="20"
      />
      <custom-icon prefix="ic" name="baseline-roundabout-left" fill-color="#b1d5c8" />
      <custom-icon prefix="proicons" name="apple" />
      <custom-icon name="flat-color-icons:alarm-clock" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  &-container {
    text-align: center;
  }
}
</style>
