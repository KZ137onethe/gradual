<script setup lang="ts">
import { Icon, addIcon } from '@iconify/vue'
import type { IconTypes } from './types.ts'
const local = 'local'

const { icon = '', color, size = 16, hoverColor, prefix = local  } = defineProps<IconTypes>()
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
  return [`${prefix}-icon`]
})


const IconName = computed(() => {
  let preName = ''
  let preIcon = icon
  if (preIcon === ''){
    preName = prefix.split(':')[0]
    preIcon = prefix.split(':')[1]
  }else {
    preName = prefix
  }
  return preName + ":" + preIcon
})
// 判断是否是自定义图标
if (prefix === local){
  addReignIcon(icon)
}

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
