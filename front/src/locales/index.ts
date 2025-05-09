import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

// Get language from local storage or use Chinese as default
const getLocale = () => {
  const cachedLocale = localStorage.getItem('locale')
  if (cachedLocale) {
    return cachedLocale
  }
  // Default to Chinese
  localStorage.setItem('locale', 'zh')
  return 'zh'
}

const i18n = createI18n({
  legacy: false, // use Composition API
  locale: getLocale(),
  fallbackLocale: 'zh',
  messages: {
    zh,
    en,
  },
})

export default i18n
