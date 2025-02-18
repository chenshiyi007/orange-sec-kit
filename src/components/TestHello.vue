<template>
  <div id="testHello">
    <a-input @change="handleChange">{{props.modelValue}}</a-input>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Object,
    default: undefined,
  },
})

const emit = defineEmits(['update:modelValue'])

function handleChange() {
  emit('update:modelValue', {text:"aaa",value: "xxx"})
}
</script>

<style scoped></style>
