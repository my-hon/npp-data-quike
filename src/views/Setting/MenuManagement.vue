<template>
    <div class="menu-management">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 搜索和操作区域 -->
        <div class="search-actions">
            <el-input v-model="filter.keyword" placeholder="请输入菜单名称或英文名称" clearable @input="handleSearch"
                style="width: 240px" />

            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="success" @click="handleAdd">新增菜单</el-button>
        </div>

        <!-- 数据表格 -->
        <el-table :data="filteredTableData" style="width: 100%">
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="name" label="菜单名称" sortable />
            <el-table-column prop="enName" label="英文名称" />
            <el-table-column prop="path" label="访问路径" />
            <el-table-column prop="type" label="类型" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.type === '目录' ? 'primary' : 'success'">
                        {{ row.type }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="关联角色" width="200">
                <template #default="{ row }">
                    <el-tag v-for="role in row.roles" :key="role" type="info" style="margin-right: 5px;">
                        {{ role }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.visible ? 'success' : 'danger'">
                        {{ row.visible ? '启用' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="handleEdit(row)">
                        编辑
                    </el-button>
                    <el-button :type="row.visible ? 'warning' : 'success'" size="small"
                        @click="handleToggleStatus(row)">
                        {{ row.visible ? '禁用' : '启用' }}
                    </el-button>
                    <el-button type="danger" size="small" @click="handleDelete(row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
            :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
            style="margin-top: 20px; justify-content: flex-end" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 模拟数据
const filter = ref({
    keyword: ''
})

const tableData = ref([
    {
        name: '首页',
        enName: 'dashboard',
        type: '目录',
        path: '/dashboard/index',
        sort: 1,
        visible: true,
        roles: ['管理员', '编辑者']
    },
    {
        name: '数据概览',
        enName: 'data-overview',
        type: '目录',
        path: '/data/overview',
        sort: 2,
        visible: true,
        roles: ['管理员']
    },
    {
        name: '实时监控',
        enName: 'monitor',
        type: '菜单',
        path: '/monitor/index',
        sort: 3,
        visible: true,
        roles: ['管理员', '查看者']
    },
    {
        name: '系统设置',
        enName: 'setting',
        type: '目录',
        path: '/setting/index',
        sort: 4,
        visible: true,
        roles: ['管理员']
    }
])

const filteredTableData = ref([])


const pagination = ref({
    currentPage: 1,
    pageSize: 10,
    total: 20
})

// 事件处理
const handleSearch = () => {
    filteredTableData.value = tableData.value.filter(menu => {
        const keyword = filter.value.keyword.toLowerCase()
        return (
            menu.name.toLowerCase().includes(keyword) ||
            menu.enName.toLowerCase().includes(keyword)
        )
    })
}

const handleAdd = () => {
    console.log('新增菜单')
}

const handleVisibleChange = (row) => {
    console.log('可见性变更:', row)
    // 更新顶部菜单状态
    const menuItem = router.options.routes.find(route => route.path === row.path)
    if (menuItem) {
        menuItem.meta = menuItem.meta || {}
        menuItem.meta.hidden = !row.visible
    }
}

const handleEdit = (row) => {
    console.log('编辑:', row)
}

const handleDelete = (row) => {
    console.log('删除:', row)
}

const handleToggleStatus = (row) => {
    row.visible = !row.visible
    console.log('状态切换:', row)
}

onMounted(() => {
    filteredTableData.value = [...tableData.value]
})
</script>

<style scoped>
.menu-management {
    padding: 20px;
    background-color: #fff;
}

.search-actions {
    margin: 20px 0;
    display: flex;
    gap: 10px;
}
</style>