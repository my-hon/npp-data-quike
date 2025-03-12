<script setup>
import { h, ref, onMounted } from 'vue'
import { get } from '@/utils/requests'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

const menuItems = ref({})

// 获取所有tab的菜单项
const fetchMenuItems = async () => {
  try {
    const response = await get('/menu-items')
    menuItems.value = response.data
  } catch (error) {
    console.error('获取菜单项失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(fetchMenuItems)

const sidebarMap = {
  tab1: () => h('div', { mode: 'vertical' }, [
    h('h3', '数据概览'),
    h('el-menu', { 
      mode: 'vertical',
      style: 'display: flex; flex-direction: column;'
    }, 
    menuItems.value.tab1?.map(item => 
      h('el-menu-item', { style: 'margin-bottom: 10px;' }, item.name)
    ))
  ]),
  tab2: () => h('div', { mode: 'vertical' }, [
    h('h3', '实时监控'),
    h('el-menu', { 
      mode: 'vertical',
      style: 'display: flex; flex-direction: column;'
    }, 
    menuItems.value.tab2?.map(item => 
      h('el-menu-item', { style: 'margin-bottom: 10px;' }, item.name)
    ))
  ]),
  tab3: () => h('div', { mode: 'vertical' }, [
    h('h3', '历史数据'),
    h('el-menu', { 
      mode: 'vertical',
      style: 'display: flex; flex-direction: column;'
    }, 
    menuItems.value.tab3?.map(item => 
      h('el-menu-item', { style: 'margin-bottom: 10px;' }, item.name)
    ))
  ]),
  tab4: () => h('div', { mode: 'vertical' }, [
    h('h3', '报表分析'),
    h('el-menu', { 
      mode: 'vertical',
      style: 'display: flex; flex-direction: column;'
    }, 
    menuItems.value.tab4?.map(item => 
      h('el-menu-item', { style: 'margin-bottom: 10px;' }, item.name)
    ))
  ]),
  tab5: () => h('div', { mode: 'vertical' }, [
    h('h3', '系统设置'),
    h('el-menu', { 
      mode: 'vertical',
      style: 'display: flex; flex-direction: column;'
    }, 
    menuItems.value.tab5?.map(item => 
      h('el-menu-item', { style: 'margin-bottom: 10px;' }, item.name)
    ))
  ])
}

const renderSidebar = () => {
  return sidebarMap[props.activeTab]()
}
</script>

<template>
  <renderSidebar />
</template>