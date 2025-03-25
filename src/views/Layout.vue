<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import Sidebar from './Sidebar.vue'
import { Fold, Expand } from '@element-plus/icons-vue' // 引入折叠图标

const router = useRouter();
const route = useRoute();

const userInfo = ref({
    name: localStorage.getItem('username') || '未登录'
})

const handleCommand = (command) => {
    if (command === 'logout') {
        localStorage.removeItem('token')
        window.location.href = '/login'
    }
}

const activeTab = ref('tab0')
const isCollapsed = ref(false)

const handleMenuClick = (menuId) => {
    const routeMap = {
        'tab0-0': '/home/overview',
        'tab0-1': '/home/intelligent-board',
        'tab0-3': '/home/interface-service',
        'tab1-0': '/data/statistics',
        'tab1-1': '/data/source-management',
        'tab1-2': '/data/warning-instances',
        'tab1-3': '/data/metadata',
        'tab1-4': '/data/uploadanddownload',
        'tab1-5': '/data/data-analyse',
        'tab2-0': '/interface/interface-governance',
        'tab5-0': '/setting/user-management',
        'tab5-1': '/setting/access-permissions',
        'tab5-2': '/setting/log-recording',
        'tab5-3': '/setting/menu-management',
        'tab5-4': '/setting/interface-service',
    };
    // 更新 activeTab
    activeTab.value = menuId.split('-')[0];

    // 如果 menuId 是顶级菜单，跳转到第一个二级菜单
    if (menuId.startsWith('tab') && !menuId.includes('-')) {
        const firstSubMenu = Object.keys(routeMap).find(key => key.startsWith(menuId));
        if (firstSubMenu) {
            router.push(routeMap[firstSubMenu]);
            return;
        }
    }

    // 正常处理二级菜单点击
    if (routeMap[menuId]) {
        router.push(routeMap[menuId]);
    }
};

onMounted(() => {
    const currentPath = route.path;
    const routeMap = {
        '/home/overview': 'tab0',
        '/home/intelligent-board': 'tab0',
        '/home/interface-service': 'tab0',
        '/data/statistics': 'tab1',
        '/data/source-management': 'tab1',
        '/data/warning-instances': 'tab1',
        '/data/metadata': 'tab1',
        '/data/uploadanddownload': 'tab1',
        '/data/data-analyse': 'tab1',
        '/interface/interface-governance': 'tab2',
        '/setting/user-management': 'tab5',
        '/setting/access-permissions': 'tab5',
        '/setting/log-recording': 'tab5',
        '/setting/menu-management': 'tab5',
        // '/setting/interface-service': 'tab5',

    };
    activeTab.value = routeMap[currentPath] || 'tab0';
});
</script>

<template>
    <el-container>
        <el-header>
            <div class="header-content">
                <el-button @click="isCollapsed = !isCollapsed" class="collapse-btn">
                    <el-icon>
                        <Fold v-if="!isCollapsed" />
                        <Expand v-else />
                    </el-icon>
                </el-button>
                <h1>NPP 数据管理系统</h1>
                <el-menu :default-active="activeTab" mode="horizontal" @select="handleMenuClick">
                    <el-menu-item index="tab0">
                        <el-icon>
                            <HomeFilled />
                        </el-icon>
                        <span>首页</span>
                    </el-menu-item>
                    <el-menu-item index="tab1">
                        <el-icon>
                            <DataAnalysis />
                        </el-icon>
                        <span>数据管理</span>
                    </el-menu-item>
                    <el-menu-item index="tab2">
                        <el-icon>
                            <Setting />
                        </el-icon>
                        <span>接口治理</span>
                    </el-menu-item>
                    <el-menu-item index="tab5">
                        <el-icon>
                            <Setting />
                        </el-icon>
                        <span>系统设置</span>
                    </el-menu-item>
                </el-menu>

                <div class="user-section">
                    <el-dropdown @command="handleCommand" v-if="userInfo.name !== '未登录'">
                        <div class="user-info">
                            <el-icon>
                                <UserFilled />
                            </el-icon>
                            <span>{{ userInfo.name }}</span>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="profile">个人设置</el-dropdown-item>
                                <el-dropdown-item command="logout" divided>
                                    <el-icon>
                                        <SwitchButton />
                                    </el-icon>
                                    退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-button v-else link @click="$router.push('/login')">登录/注册</el-button>
                </div>
            </div>
        </el-header>

        <el-container>
            <el-aside :width="isCollapsed ? '0px' : '200px'">
                <Sidebar :activeTab="activeTab" v-model:collapsed="isCollapsed" @menu-click="handleMenuClick" />
            </el-aside>

            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<!-- 保留原有样式 -->
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
    height: calc(100vh - 75px) !important;
    /* 减去顶部栏高度 */
    background-color: #f5f7fa !important;
    /* 浅灰色背景 */
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    /* 右侧阴影 */
    overflow-y: auto;
    /* 允许内容滚动 */
    transition: width 0.3s ease;
}

.el-menu-item span {
    font-weight: bold;
}

/* 固定侧边栏内容高度 */
:deep(.sidebar-container) {
    flex: 1;
    min-height: 0;
    /* 修复flex容器溢出 */
    overflow-y: auto;
    transition: opacity 0.3s ease;
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

/* 折叠按钮样式 */
.collapse-btn {
    margin-right: 20px;
    background-color: transparent;
    border: none;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.collapse-btn:hover {
    opacity: 0.8;
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
    height: 100% !important;
    overflow-y: auto;
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