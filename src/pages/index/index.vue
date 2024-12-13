<script setup lang="ts">
import Children from "./components/children.vue";
</script>

<template>
  <div class="index-page">
    <Icon prefix="material-symbols-light" icon="12mp-outline-rounded"></Icon>
    <Icon prefix="mdi-light" icon="home" color="red" />
    <Icon prefix="flat-color-icons" icon="about" />
    <Icon icon="qrcodescan" color="#91a8d0"/>
    <Icon icon="beer" color="#91a8d0"/>
    <Icon prefix="flat-color-icons:alarm-clock"/>
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
