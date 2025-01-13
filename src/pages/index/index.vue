<script setup lang="ts">
import Children from './components/children.vue'
</script>

<template>
  <div class="index-page">
    <Icon is-local icon="beer" />
    <Icon prefix="ic" icon="baseline-roundabout-left" />
    <Icon prefix="proicons" icon="apple" color="red" />
    <Icon icon="flat-color-icons:alarm-clock" />
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
