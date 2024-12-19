<script setup lang="ts">
import Children from "./components/children.vue";
</script>

<template>
  <div class="index-page">
    <Icon isLocal icon="beer" ></Icon>
    <Icon prefix="ic" icon="baseline-roundabout-left"></Icon>
    <Icon prefix="proicons" icon="apple" color="red" />
    <Icon icon="flat-color-icons:alarm-clock"/>
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
