<script setup lang="ts">
import Children from './components/children.vue'

const dynamicIconName = ref('anchor-off')

setTimeout(() => {
}, 1000)
</script>

<template>
  <div class="index-page">
    <custom-icon
      is-local
      folder="icon"
      :name="dynamicIconName"
      :size="36"
      dynamic
    />
    <custom-icon
      is-local
      folder="icon"
      name="beer"
      :size="20"
    />
    <custom-icon prefix="ic" name="baseline-roundabout-left" fill-color="#b1d5c8" />
    <custom-icon prefix="proicons" name="apple" />
    <custom-icon name="flat-color-icons:alarm-clock" />
    <Children #default="{ render }">
      {{ render.hitokoto }} - {{ render.from_who ?? '佚名' }}
    </Children>
  </div>
</template>

<style scoped lang="scss">
.index-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
