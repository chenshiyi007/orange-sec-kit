<template>
  <div class="dashboard-container">
    <a-row :gutter="20" class="mb-20">
      <!-- 总扫描次数卡片 -->
      <a-col :span="6">
        <a-card hoverable class="stat-card">
          <a-statistic
            :value="total"
            :title="t('pages.task.dashboard.totalScans')"
            :precision="0"
            show-group-separator
            :suffix="t('pages.task.dashboard.times')"
            :value-style="{ color: '#165dff', fontWeight: '600' }"
            :title-style="{ color: 'var(--color-text-2)', fontSize: '14px' }"
          >
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable class="stat-card">
          <a-statistic
            :value="scanning"
            :title="t('pages.task.dashboard.scanning')"
            :precision="0"
            show-group-separator
            :suffix="t('pages.task.dashboard.times')"
            :value-style="{ color: '#165dff', fontWeight: '600' }"
            :title-style="{ color: 'var(--color-text-2)', fontSize: '14px' }"
          >
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable class="stat-card">
          <a-statistic
            :value="paused"
            :title="t('pages.task.dashboard.paused')"
            :precision="0"
            show-group-separator
            :suffix="t('pages.task.dashboard.times')"
            :value-style="{ color: '#165dff', fontWeight: '600' }"
            :title-style="{ color: 'var(--color-text-2)', fontSize: '14px' }"
          >
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable class="stat-card">
          <a-statistic
            :value="failed"
            :title="t('pages.task.dashboard.failed')"
            :precision="0"
            show-group-separator
            :suffix="t('pages.task.dashboard.times')"
            :value-style="{ color: '#f53f3f', fontWeight: '600' }"
            :title-style="{ color: 'var(--color-text-2)', fontSize: '14px' }"
          >
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { getTaskStatistics } from '@/api/task'
import { Notification } from '@arco-design/web-vue'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const total = ref(0)
const scanning = ref(0)
const paused = ref(0)
const failed = ref(0)

const fetchStatisticsData = async () => {
  try {
    const res = await getTaskStatistics()
    if (res.status !== 200) {
      return Notification.error(t('common.serviceError'))
    }
    if (res.data?.code !== 0) {
      let msg = t('common.serviceError')
      if (res.data?.message && res.data?.message !== '') {
        msg = res.data?.message
      }
      Notification.warning(msg)
      return
    }
    total.value = res.data?.data?.total
    scanning.value = res.data?.data?.scanning
    paused.value = res.data?.data?.paused
    failed.value = res.data?.data?.failed
  } catch (e) {
    void e
    Notification.error(t('common.serviceError'))
  } finally {
  }
}

onMounted(() => {
  fetchStatisticsData()
})

// 暴露刷新方法给父组件
defineExpose({
  refresh: fetchStatisticsData,
})
</script>

<style scoped>
.mb-20 {
  margin-bottom: 20px;
}

.dashboard-container {
  width: 100%;
}

.stat-card {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  background-color: var(--color-bg-2);
  border-radius: 4px;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

:deep(.arco-statistic-value) {
  font-size: 24px;
}

:deep(.arco-statistic-suffix) {
  font-size: 14px;
  margin-left: 4px;
}

/* 添加媒体查询，在小屏幕上优化表现 */
@media (max-width: 768px) {
  .mb-20 {
    margin-bottom: 10px;
  }

  :deep(.arco-statistic-value) {
    font-size: 20px !important;
  }
}
</style>
