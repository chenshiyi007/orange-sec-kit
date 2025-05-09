<template>
  <a-page-header
    :style="{ background: 'var(--color-bg-2)' }"
    :title="props.title"
    :subtitle="props.subtitle"
    @back="back"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const back = () => {
  router.go(-1)
}
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
})
</script>
<style scoped></style>
