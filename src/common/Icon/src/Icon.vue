<script setup lang="ts">
import { Icon, addIcon } from '@iconify/vue'
import type { IconTypes } from './types.ts'

const local = 'local'
const { icon, color, size = 16, hoverColor, prefix, isLocal = false  } = defineProps<IconTypes>()
// 添加自定义本地图标
const addReignIcon = async(iconNameparmas: string)=>{
    try {
        console.log('addReignIcon', iconNameparmas)
        // 动态加载指定的 SVG 文件
        const iconModule = await import(`@/assets/icon/${iconNameparmas}.svg?raw`);
        // 添加自定义图标
        addIcon(`${local}:${iconNameparmas}`, {
            body: iconModule.default,  // 将 SVG 内容作为 body
        });
    } catch (error) {
        console.error(`Error loading icon "${iconNameparmas}":`, error);
    }
}
const getIconifyStyle = computed(() => {
  return {
    fontSize: `${size}px`,
    color
  }
})

const prefixCls = computed(() => {
  if(isLocal) {
    addReignIcon(icon)
    return [`${local}-icon`]
  }
  return ['custom-icon']
})

const IconName = computed<string>(() => {
  // 情况1：本地，只指定icon
  // 情况2：线上，prefix + icon
  // 情况3：线上，只有icon，通常这个icon有":"分割，前一部分为prefix，后一部分为真实的icon
  if(isLocal) return local + ':' + icon
  if(prefix && icon) return prefix + ':' + icon
  if(!prefix && icon) {
    const spliIconArr = icon.split(':')
    console.log(spliIconArr)
    let _prefix = '', _icon = ''
    if(spliIconArr.length === 1) return icon
    _prefix = spliIconArr[0]
    _icon = spliIconArr.slice(1).reduce((pre, cur) => pre + cur, '')
    return _prefix + ':' + _icon
  }
  return ''
})
</script>

<template>
  <ElIcon :class="prefixCls" :size="size" :color="color">
    <Icon :icon="IconName" :size="getIconifyStyle.fontSize" :color="getIconifyStyle.color" />
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
