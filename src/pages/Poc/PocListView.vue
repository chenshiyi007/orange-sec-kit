<template>
  <div class="notes">
    <a-row class="title" align="center">
      <a-col :span="6">
        <a-statistic
          title="poc数量"
          :value="total"
          :value-from="0"
          :start="true"
          :animation-duration="1000"
          animation
        >
          <template #suffix>
            <IconArrowRise />
          </template>
        </a-statistic>
      </a-col>
    </a-row>
    <div class="search">
    <a-row :gutter="8">
      <a-col :span="6">
        <a-input placeholder="漏洞名称模糊搜索" allow-clear v-model="searchName" />
      </a-col>
      <a-col :span="6">
        <a-select
          v-model="searchVulLevel"
          :options="VulLevel"
          :field-names="{ value: 'key', label: 'label' }"
          placeholder="选择漏洞等级"
          multiple
          allow-clear
        />
      </a-col>
      <a-col :span="6">
        <a-select
          v-model="searchVulType"
          :options="VulTypes"
          allow-clear
          :field-names="{ value: 'key', label: 'label' }"
          placeholder="选择漏洞类型"
          multiple
        />
      </a-col>
    </a-row>
    <a-row :gutter="8" style="margin-top: 8px">
      <a-col :span="6">
        <a-input v-model="searchPath" placeholder="漏洞路径模糊搜索" allow-clear />
      </a-col>
      <a-col :span="4">
        <a-input v-model="searchParam" placeholder="漏洞参数模糊搜索" allow-clear />
      </a-col>
      <a-col :span="4">
        <a-date-picker
          v-model="searchStartTime"
          placeholder="更新时间大于"
          :disabledDate="(current) => dayjs(current).isAfter(dayjs())"
        />
      </a-col>
      <a-col :span="4">
        <a-date-picker
          v-model="searchEndTime"
          placeholder="更新时间小于"
          :disabledDate="(current) => dayjs(current).isAfter(dayjs())"
        />
      </a-col>
      <a-col :span="2">
        <a-button type="primary" @click="handlerSearch" :loading="searchLoading">
          <template #icon>
            <IconSearch />
          </template>
          搜索
        </a-button>
      </a-col>
      <a-col :span="2">
        <a-button type="text" @click="refreshData" shape="circle" :loading="loading">
          <template #icon>
            <IconRefresh />
          </template>
        </a-button>
      </a-col>
      <a-col :span="2" v-if="props.isShowAdd">
        <a-button type="primary" @click="pocAddClick">
          <template #icon>
            <IconPlus />
          </template>
          新增
        </a-button>
      </a-col>
    </a-row>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data="data"
        :pagination="false"
        size="medium"
        bordered
        stripe
        :row-selection="rowSelection"
        row-key="instance_id"
        v-model:selectedKeys="selectedKeys"
      >
        <template #optional="{ record }">
          <div class="table-item">
            <a-button type="text" shape="circle" @click="pocDetailClick(record?.instance_id || '')">
              <IconEye />
            </a-button>
            <a-tooltip content="快速检测" position="top" mini>
              <a-button
                type="text"
                shape="circle"
                status="danger"
                @click="$modal.info({ title: 'Name', content: record.fofa_finger })"
              >
                <IconBug />
              </a-button>
            </a-tooltip>
          </div>
        </template>
        <template #level="{ record }">
          <a-tag :color="getColor(record.level)"> {{ getLevel(record.level) }}</a-tag>
        </template>
        <template #vul_type="{ record }">
          {{ getVulType(record.vul_type) }}
        </template>
      </a-table>
      <a-row :gutter="8" style="margin-top: 8px">
        <a-col :span="2" v-if="selectedKeys.length > 0">
          <a-popover  trigger="click" title="确认删除POC吗?" position="bottom"  v-model:popup-visible="popoverVisible">
            <a-button  type="primary" status="danger">批量删除
              <template #icon>
                <IconDelete />
              </template>
            </a-button>
            <template #content>
              <a-row :gutter="8" class="popover-content">
                <a-col :span="12">
                  <a-button @click="handlerCancelDelete">取消</a-button>
                </a-col>
                <a-col :span="12">
                  <a-button @click="handlerDelete"  type="primary" status="danger" :loading="deleteLoading">确认</a-button>
                </a-col>
              </a-row>
            </template>
          </a-popover>
        </a-col>
        <a-col :span="24">
          <a-pagination
            class="pagination"
            :total="total"
            :current="currentPage"
            :page-size="pageSize"
            show-jumper
            show-page-size
            @change="handlePageChange"
            :page-size-options="[10, 20, 50, 100]"
            @page-size-change="handlePageSizeChange"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconArrowRise,
  IconPlus,
  IconRefresh,
  IconEye,
  IconBug,
  IconSearch,
  IconDelete,
} from '@arco-design/web-vue/es/icon'
import {  onMounted, ref,reactive } from 'vue'
import { deletePocs, listPocs } from '@/api/poc.ts'
import { Notification, type TableColumnData, type TableRowSelection } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import { VulLevel, VulTypes } from '@/enums/enums.ts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

const props = defineProps({
  app_id:{
    type:String,
    default:'',
  },
  isShowAdd:{
    type:Boolean,
    default:false,
  }
})

dayjs.extend(utc)
const searchLoading = ref(false)
const searchName = ref('')
const searchVulType = ref([])
const searchVulLevel = ref([])
const searchPath = ref('')
const searchParam = ref('')
const searchStartTime = ref()
const searchEndTime = ref()
const selectedKeys = ref([])
const popoverVisible = ref(false)
const deleteLoading = ref(false)
const columns = [
  {
    title: 'ID',
    dataIndex: 'instance_id',
    ellipsis: true,
    tooltip: true,
    width: 100,
  },
  {
    title: '漏洞名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '漏洞类型',
    dataIndex: 'vul_type',
    slotName: 'vul_type',
    width: 150,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '漏洞等级',
    dataIndex: 'level',
    slotName: 'level',
    width: 100,
  },
  {
    title: '漏洞路径',
    dataIndex: 'vul_path',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '漏洞参数',
    dataIndex: 'vul_param',
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    align: 'center',
  },
  {
    title: '操作',
    slotName: 'optional',
    width: 100,
    align: 'center',
  },
] as TableColumnData[]
const router = useRouter()
const data = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
}) as TableRowSelection;


const fetchData = async () => {
  try {
    const res = await listPocs({
      app_instance_id:props.app_id,
      size: pageSize.value,
      page: currentPage.value,
      name: searchName.value,
      vul_param: searchParam.value,
      vul_type: searchVulType.value,
      vul_path: searchPath.value,
      level: searchVulLevel.value,
      start_time: searchStartTime.value ? dayjs.utc(searchStartTime.value).valueOf() : -1,
      end_time: searchEndTime.value
        ? dayjs.utc(searchEndTime.value).valueOf()
        : dayjs.utc(Date.now()).valueOf(),
    })
    if (res.status !== 200) {
      return Notification.error('服务错误')
    }
    if (res.data?.code !== 0) {
      let msg = '服务错误'
      if (res.data?.message && res.data?.message !== '') {
        msg = res.data?.message
      }
      Notification.warning(msg)
      return
    }
    total.value = res.data?.data?.total
    data.value = res.data?.data?.items
  } catch (e) {
    void e
    Notification.error('服务错误')
  } finally {
  }
}

const deleteData = async () => {
  deleteLoading.value = true
  try {
    const res = await deletePocs({
      instance_id: selectedKeys.value,
    })
    if (res.status !== 200) {
      Notification.error("服务错误")
      return
    }
    if (res.data?.code !== 0) {
      Notification.error(res.data?.message || "服务错误")
    }
    Notification.success("删除成功")
  }catch (e) {
    void e
    Notification.error("服务错误")
  }finally {
    deleteLoading.value = false
  }
}

onMounted(() => {
   fetchData()
})

function refreshData() {
  loading.value = true
  setTimeout(async () => {
    await fetchData()
    loading.value = false
  }, 300)
}

function handlerSearch() {
  searchLoading.value = true
  setTimeout(() => {
    fetchData()
    searchLoading.value = false
  }, 300)
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchData()
}

function handlePageSizeChange(size: number) {
  pageSize.value = size
  fetchData()
}

const getColor = (level: string) => {
  const levelConfig = VulLevel.find((item) => item.key === level)
  return levelConfig ? levelConfig.color : 'gray'
}

const getLevel = (level: string) => {
  const levelConfig = VulLevel.find((item) => item.key === level)
  return levelConfig ? levelConfig.label : '未知等级'
}

const getVulType = (type: string) => {
  const TypeConfig = VulTypes.find((item) => item.key === type)
  return TypeConfig ? TypeConfig.label : '未知类型'
}

const pocDetailClick = (poc: string) => {
  if (poc && poc !== '') {
    router.push(`/wiki/poc/detail/${poc}`)
  } else {
    router.push(`/wiki/poc/add/${props.app_id}`)
  }
}

function pocAddClick() {
  router.push(`/wiki/poc/add/${props.app_id}`)
}

async function handlerDelete() {
  try {
    await deleteData();
    popoverVisible.value = false;
    await fetchData();
    selectedKeys.value = []
  } catch (error) {
    console.error('删除操作出错:', error);
  }
}

function handlerCancelDelete() {
  popoverVisible.value = false
}
</script>

<style scoped>
.table {
  margin-top: 10px;
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.table-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search {
  margin-top: 10px;
}
.popover-content{
  margin-top: 10px;
}
</style>
