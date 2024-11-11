<script setup lang="ts">
import Children from "./components/children.vue";
</script>

<template>
  <div class="index-page">
    <Icon icon="material-symbols-light:12mp-outline-rounded"></Icon>
    <children v-slot="{ render }">
      {{ render.hitokoto }} - {{ render.from_who ?? '佚名' }}
    </children>
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
