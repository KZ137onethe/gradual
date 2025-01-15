declare module 'vue' {
  export interface GlobalComponents {
    CustomIcon: (typeof import('../src/common/CustomIcon/index.vue'))['default']
  }
}

export { }
