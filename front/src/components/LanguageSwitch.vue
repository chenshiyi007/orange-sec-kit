<template>
  <div class="language-switch">
    <div class="language-switch-container">
      <a-select v-model="currentLanguage" :style="{ width: '100px' }" @change="changeLanguage">
        <a-option value="zh">{{ t('common.chinese') }}</a-option>
        <a-option value="en">{{ t('common.english') }}</a-option>
      </a-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const { locale, t } = useI18n()
const { getItem, setItem } = useLocalStorage()
const currentLanguage = ref(locale.value)

onMounted(() => {
  const savedLocale = getItem('locale')
  if (savedLocale) {
    currentLanguage.value = savedLocale
    locale.value = savedLocale
  }
})

const changeLanguage = (
  value:
    | string
    | number
    | boolean
    | Record<string, any>
    | (string | number | boolean | Record<string, any>)[],
) => {
  const lang = value as string
  locale.value = lang
  setItem('locale', lang)
}
</script>

<style scoped>
.language-switch {
  margin-left: 16px;
}

.language-switch-container {
  display: flex;
  align-items: center;
}
</style>
