<script setup>
import { ref } from 'vue'
import Sidebar from './views/Sidebar.vue'
import MainContent from './views/MainContent.vue'

const activeTab = ref('tab1')
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="header-content">
          <h1>NPP 数据管理系统</h1>
          <el-menu 
            :default-active="activeTab"
            mode="horizontal"
            @select="(key) => activeTab = key"
          >
            <el-menu-item index="tab1">数据概览</el-menu-item>
            <el-menu-item index="tab2">实时监控</el-menu-item>
            <el-menu-item index="tab3">历史数据</el-menu-item>
            <el-menu-item index="tab4">报表分析</el-menu-item>
            <el-menu-item index="tab5">系统设置</el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Sidebar :activeTab="activeTab" />
        </el-aside>
        <el-main>
          <MainContent :activeTab="activeTab" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.common-layout {
  height: 100vh;
  width: 100vw;
  min-width: 100vw;
  overflow: hidden;
}

.el-container {
  height: 100%;
  margin: 0;
  padding: 0;
}

.el-header {
  background-color: #409EFF;
  color: #fff;
  line-height: 60px;
}

.el-aside {
  background-color: #e9eef3;
}

/* .el-main {
  padding: 20px;
} */

.header-content {
  display: flex;
  align-items: center;
  height: 100%;
}

h1 {
  margin: 0;
  margin-right: 40px;
  font-size: 24px;
  color: #fff;
}

.el-menu {
  flex: 1;
  background-color: transparent;
}
</style>
