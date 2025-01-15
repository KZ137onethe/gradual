<script setup lang="ts">
import type { IconTypes } from './types.ts'
import { eventBus } from '@/utils/eventBus.ts'
import { Icon } from '@iconify/vue'
import IconOpt, { color } from './opt.ts'

const { name, fillColor = color.fill, size = 16, hoverColor = color.hover, prefix, isLocal = false, dynamic = false, folder } = defineProps<IconTypes>()

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const instance = ref<IconOpt>(new IconOpt(name, { isLocal, prefix, size, fillColor, hoverColor, folder }))
const { pause } = watch(() => name, (cur, pre) => {
  if (cur && cur !== pre && dynamic) {
    instance.value = new IconOpt(cur, { isLocal, prefix, size, fillColor, hoverColor, folder })
  }
})

// 两种情况
// 静态 触发triggerRef，获取最新的instance，不触发副效应
// 触发triggerRef，获取最新的instance，新的name和旧的name不同时触发副效应

eventBus.on('iconLoaded', () => {
  triggerRef(instance)
})

onMounted(() => {
  if (!dynamic) {
    pause()
  }
})
</script>

<template>
  <div v-if="instance.iconName && instance.iconCSS" :class="instance.iconCSS!.className">
    <Icon
      :icon="instance.iconName"
      :width="instance.iconCSS.style.width"
      :height="instance.iconCSS.style.height"
      :color="instance.iconCSS.style.fill"
    />
  </div>
  <div v-else>
    <Icon icon="line-md:loading-alt-loop" :size="size" />
  </div>
</template>

<style lang="scss" scoped>
.iconify {
  :deep(svg) {
    width: inherit !important;
    height: inherit !important;

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
