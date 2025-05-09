import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户状态存储
export const useUserStore = defineStore('user', () => {
  // 用户状态
  const userInfo = ref<any>(null)
  const isAgreeTerms = ref(false)

  // 设置用户同意条款状态
  function setAgreeTerms(agree: boolean) {
    isAgreeTerms.value = agree
  }

  // 设置用户信息
  function setUserInfo(info: any) {
    userInfo.value = info
  }

  // 清除用户信息
  function clearUserInfo() {
    userInfo.value = null
    isAgreeTerms.value = false
  }

  return {
    userInfo,
    isAgreeTerms,
    setAgreeTerms,
    setUserInfo,
    clearUserInfo
  }
})
