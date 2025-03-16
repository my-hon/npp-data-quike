<script setup>
import { h, ref, onMounted, watch } from 'vue'
import { get } from '../utils/requests.js'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['menu-click'])
const menuItems = ref({})

// 新增图标映射和标题映射
const tabConfig = {
  tab0: { icon: 'message', title: '首页' },
  tab1: { icon: 'message', title: '数据管理' },
  tab2: { icon: 'monitor', title: '实时监控' },
  tab3: { icon: 'clock', title: '历史数据' },
  tab4: { icon: 'data-analysis', title: '报表分析' },
  tab5: { icon: 'setting', title: '系统设置' }
}

const getTabIcon = (tab) => tabConfig[tab]?.icon || 'setting'
const getTabTitle = (tab) => tabConfig[tab]?.title || '未知菜单'

// 获取所有tab的菜单项
const fetchMenuItems = async () => {
  try {
    const response = await get('/api/menu-items')
    menuItems.value = response.data
  } catch (error) {
    console.error('获取菜单项失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(fetchMenuItems)

// 新增响应式变量控制展开菜单
const openedMenus = ref([props.activeTab])

const activeMenu = ref(props.activeTab + '-0');
// 监听activeTab变化
watch(() => props.activeTab, (newVal) => {
  activeMenu.value = newVal + '-0'; // 更新为第一个二级菜单
})
</script>

<template>
  <div>
    <el-scrollbar class="sidebar-container">
      <!-- 原始菜单结构 -->
      <el-menu :default-openeds="openedMenus" :default-active="activeMenu" v-if="menuItems[activeTab]?.length">
        <el-sub-menu :index="activeTab">
          <template #title>
            <el-icon>
              <component :is="getTabIcon(activeTab)" />
            </el-icon>
            {{ getTabTitle(activeTab) }}
          </template>

          <el-menu-item v-for="(item, index) in menuItems[activeTab]" :key="index" :index="`${activeTab}-${index}`"
            @click="emit('menu-click', `${activeTab}-${index}`)">
            {{ item.name }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <!-- 加载状态提示 -->
      <div v-else class="loading-tip">
        菜单加载中...
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
/* 恢复原始样式 */

:deep(.el-menu) {
  background-color: transparent;
  --el-menu-text-color: #303133;
  --el-menu-active-color: #409eff;
  --el-menu-hover-bg-color: #e6f7ff;
}

:deep(.el-menu-item) {
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}
</style>