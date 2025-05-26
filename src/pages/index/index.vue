<script setup lang="ts">
import Children from './components/children.vue'

import { judgeHandler } from '@/utils/handler'
import useDomControl from '@/hooks/useDomControl'

// #region 图标
const dynamicIconName = ref('anchor-off')
// #endregion

// #region 判断处理器
const randomVal = ref(0)
judgeHandler<number>(randomVal.value, new Map<number | number[] | symbol, Function>([
  [
    1,
    () => {
      console.log('值是1')
    }
  ],
  [
    [2, 3],
    () => {
      console.log('值是2或3')
    }
  ],
  [
    Symbol("default"),
    () => {
      console.log('值是其他')
    }
  ]
]))
onMounted(() => {
  randomVal.value = Math.floor(Math.random() * 9 + 1)
})
// #endregion

// #region 是否禁用、是否可见、是否必须 hooks
const SELECT_OPTIONS = [
  {
    label: "身份证",
    value: 1
  },
  {
    label: "护照",
    value: 2
  },
  {
    label: "驾驶证",
    value: 3
  },
  {
    label: "港澳通行证",
    value: 4
  }
]
const RADIO_OPTIONS = [
  {
    label: "差点意思",
    value: 1
  },
  {
    label: "还行",
    value: 2
  },
  {
    label: "不错",
    value: 3
  },
  {
    label: "非常好",
    value: 4
  }
]

const val1 = ref('')
const val2 = ref('')
const digit1 = ref(1)
const vouncher1 = ref('')
const datePicker1 = ref(new Date())
const datePicker2 = ref()
const radio1 = ref()
const switch1 = ref(false)

function toggleDisableClick() {}

function toggleRequiredClick() {}

function toggleVisibleClick() {}
// #endregion
</script>

<template>
  <div class="page">

    <el-divider content-position="left">网络请求</el-divider>
    <Children #default="{ render }">
      {{ render.hitokoto }} - {{ render.from_who ?? '佚名' }}
    </Children>

    <el-divider content-position="left">自定义图标</el-divider>
    <div class="icon-item-area">
      <custom-icon is-local folder="icon" :name="dynamicIconName" :size="24" dynamic />
      <custom-icon is-local folder="icon" name="beer" fill-color="#ebeee8" hover-color="#d08635" :size="20" />
      <custom-icon prefix="ic" name="baseline-roundabout-left" fill-color="#b1d5c8" />
      <custom-icon prefix="proicons" name="apple" />
      <custom-icon name="flat-color-icons:alarm-clock" />
    </div>

    <el-divider content-position="left">批量是否禁用、是否可见、是否必须（如：输入框、选择器、开关）</el-divider>
    <el-row style="width: 100%">
      <el-col :span="10" :offset="1">
        <el-input ref="input-val1" v-model="val1"></el-input>
      </el-col>
      <el-col :span="10" :offset="1">
        <el-input ref="input-val2" v-model="val2"></el-input>
      </el-col>
    </el-row>
    <el-row style="width: 100%">
      <el-col :span="10" :offset="1">
        <el-input-number ref="inputNumber-num1" v-model="digit1" :min="1" :max="10" />
      </el-col>
      <el-col :span="10" :offset="1">
        <el-select ref="select-select1" v-model="vouncher1">
          <el-option v-for="opt in SELECT_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row style="width: 100%">
      <el-col :span="10" :offset="1">
        <el-date-picker v-model="datePicker1" type="date" placeholder="请选择时间"></el-date-picker>
      </el-col>
      <el-col :span="10" :offset="1">
        <el-date-picker v-model="datePicker2" type="datetime" placeholder="请选择时间范围"></el-date-picker>
      </el-col>
    </el-row>
    <el-row style="width: 100%">
      <el-col :span="10" :offset="1">
        <el-radio-group v-model="radio1">
          <el-radio v-for="opt in RADIO_OPTIONS" :value="opt.value">{{ opt.label }}</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="10" :offset="1">
        <el-switch v-model="switch1"></el-switch>
      </el-col>
    </el-row>

    <el-divider content-position="left">Vue全局挂载 对话框、抽屉、消息提示、消息弹出框、通知，ts可以统一路径调用</el-divider>

  </div>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  width: 60vw;
  margin: 0 auto;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  &-container {
    text-align: center;
  }
}
</style>
