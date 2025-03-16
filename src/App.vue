<script setup>

</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
html,
body,
#app {
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
  line-height: 7%;
  height: 7%;
}

.el-aside {
  background-color: #f0f8ff !important;
  /* 改为浅蓝色背景 */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  /* 添加右侧阴影 */
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

<style scoped>
.el-header {
  background-color: #409EFF !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 修改菜单项样式 */
:deep(.el-menu--horizontal) .el-menu-item {
  font-size: 16px;
  /* 调大字体 */
  height: 60px;
  transition: all 0.2s ease;
}

:deep(.el-menu--horizontal) .el-menu-item:hover {
  color: var(--el-color-primary) !important;
  transform: translateY(-2px);
}

:deep(.el-menu--horizontal) .el-menu-item.is-active {
  color: var(--el-color-primary) !important;
  border-bottom: 2px solid var(--el-color-primary);
}
</style>

<style scoped lang="scss">
:deep(.el-menu--horizontal) .el-menu-item.is-active {
  color: #337ecc !important;
  background-color: #fff !important;
  /* 使用Element Plus的深蓝色 */
  border-bottom: 2px solid var(--el-color-primary);
  font-weight: 600;
}

/* 新增全局样式 */
* {
  -webkit-user-select: none;
  /* Chrome/Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE10+ */
  user-select: none;
}

.el-main {
  background-color: #fff;
}

.user-section {
  margin-left: auto;
  display: flex;
  align-items: center;
  padding-right: 20px;

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }

    :deep(.el-icon) {
      font-size: 18px;
    }
  }

  :deep(.el-dropdown-menu__item) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>