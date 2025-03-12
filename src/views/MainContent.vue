<script setup>
import { h } from 'vue'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

const contentMap = {
  tab1: '数据概览主内容',
  tab2: '实时监控主内容',
  tab3: '历史数据主内容',
  tab4: '报表分析主内容',
  tab5: '系统设置主内容'
}

const renderContent = () => {
  return h('div', contentMap[props.activeTab])
}
</script>

<template>
  <renderContent />
</template>