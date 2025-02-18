<template>
  <div class="notes">
    <h2>hell app page</h2>
    <TestHello v-model="aa">aa</TestHello>
    <button @click="click">show</button>
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue'

const aa = ref({
  text:'hello',
  key:123,
})
function click(){
  console.log(aa.value)
}

import TestHello from '@/components/TestHello.vue'
</script>

<style scoped>

</style>
