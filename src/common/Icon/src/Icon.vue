<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { IconTypes } from './types.ts'
const { icon, color, size = 16, hoverColor, online = true, prefix = 'vi' } = defineProps<IconTypes>()

const isLocal = computed(() => icon.startsWith('svg-icon:'))

const symbolId = computed(() => {
  return unref(isLocal) ? `#icon-${icon.split('svg-icon:')[1]}` : icon
})

// 是否使用在线图标
const isUseOnline = computed(() => {
  return !unref(isLocal) && online
})

const getIconifyStyle = computed(() => {
  return {
    fontSize: `${size}px`,
    color
  }
})

const prefixCls = computed(() => {
  return [`${prefix}-icon`]
})

const getIconName = computed(() => {
  return icon.startsWith(prefix) ? icon.replace(prefix, '') : icon
})
</script>

<template>
  <ElIcon :class="prefixCls" :size="size" :color="color">
    <svg v-if="isLocal" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>

    <template v-else>
      <Icon v-if="isUseOnline" :icon="getIconName" :size="getIconifyStyle.fontSize" :color="getIconifyStyle.color" />
      <div v-else :class="`${icon} iconify`" :style="getIconifyStyle"></div>
    </template>
  </ElIcon>
</template>

<style lang="scss" scoped>
$prefix-cls: v-bind('prefixCls[0]');

.iconify {
  :deep(svg) {
    &:hover {
      // stylelint-disable-next-line
      color: v-bind(hoverColor) !important;
    }
  }
  &:hover {
    // stylelint-disable-next-line
    color: v-bind(hoverColor) !important;
  }
}
</style>
