import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePocTableStore = defineStore('pocTableStore', () => {
  const page = ref(0)
  const size = ref(10)

  function setParams(p: number, s: number) {
    page.value = p
    size.value = s
  }
  return { page, size, setParams }
})
