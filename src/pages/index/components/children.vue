<script setup lang="ts">
import { httpRequest } from '@/axios'

enum Api {
  Sentence = 'https://v1.hitokoto.cn/',
}

const data = reactive({
  from_who: '',
  hitokoto: '',
})

function getSentence({ c = undefined, encode = undefined }: { c?: 'b' | 'f', encode?: 'text' } = {}) {
  return httpRequest.request({
    method: 'GET',
    url: Api.Sentence,
    params: {
      c,
      encode,
    },
  }, {
    successMessageMode: 'notification',
  })
}

onMounted(async () => {
  const { hitokoto, from_who } = await getSentence()
  data.from_who = from_who
  data.hitokoto = hitokoto
})
</script>

<template>
  <div class="son-children">
    <slot :render="data" />
  </div>
</template>

<style scoped lang="scss"></style>
