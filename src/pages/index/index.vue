<script setup lang="ts">
import Children from './components/children.vue'

const dynamicIconName = ref('anchor-off')

setTimeout(() => {
}, 1000)
</script>

<template>
  <div class="page">
    <div class="page__container">
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
  &__container {
    text-align: center;
  }
  .item-item-area {
  }
}
</style>
