<script setup>
import { ref } from 'vue'
import AddDataSourceDialog from './components/DataSourceManagement/AddDataSourceDialog.vue'

const addDataSourceDialog = ref(null)

const addData = () => {
    addDataSourceDialog.value.open()
}
// 表格列配置（保持与WarningInstances一致的结构）
const tableColumns = ref([
    { type: 'index', label: '序号', width: 60 },
    { prop: 'name', label: '名称', minWidth: 120, showOverflowTooltip: true },
    { prop: 'type', label: '类型', width: 120 },
    { prop: 'connection', label: '连接信息', minWidth: 180, showOverflowTooltip: true },
    { prop: 'username', label: '用户名', width: 100 },
    {
        prop: 'status',
        label: '状态',
        width: 100,
        cellRenderer: ({ row }) => ({
            component: 'el-tag',
            props: {
                type: row.status === 'connected' ? 'success' : 'danger',
                size: 'small'
            },
            children: row.status === 'connected' ? '已连接' : '未连接'
        })
    },
    {
        prop: 'checkTime',
        label: '检测时间',
        width: 160,
        formatter: row => row.checkTime || '未检测'
    },
    { prop: 'remark', label: '备注', minWidth: 150, showOverflowTooltip: true },
    {
        label: '操作',
        width: 150,
        fixed: 'right',
        scopedSlots: {
            default: ({ row }) => ({
                component: 'div',
                class: 'operation-btns',
                children: [
                    {
                        component: 'el-button',
                        props: {
                            type: 'primary',
                            link: true,
                            icon: 'el-icon-refresh',
                            title: '立即检测',
                            loading: row.checkLoading
                        },
                        on: {
                            click: () => checkData(row)
                        }
                    },
                    {
                        component: 'el-dropdown',
                        children: [
                            {
                                component: 'el-button',
                                props: {
                                    type: 'info',
                                    link: true,
                                    icon: 'el-icon-more',
                                    title: '更多操作'
                                }
                            },
                            {
                                component: 'template',
                                slots: {
                                    dropdown: () => ({
                                        component: 'el-dropdown-menu',
                                        children: [
                                            {
                                                component: 'el-dropdown-item',
                                                on: {
                                                    click: () => showLog(row)
                                                },
                                                children: [
                                                    { component: 'i', class: 'el-icon-document' },
                                                    '日志'
                                                ]
                                            },
                                            {
                                                component: 'el-dropdown-item',
                                                on: {
                                                    click: () => editData(row)
                                                },
                                                children: [
                                                    { component: 'i', class: 'el-icon-edit' },
                                                    '编辑'
                                                ]
                                            },
                                            {
                                                component: 'el-dropdown-item',
                                                class: 'danger-item',
                                                on: {
                                                    click: () => deleteData(row)
                                                },
                                                children: [
                                                    { component: 'i', class: 'el-icon-delete' },
                                                    '删除'
                                                ]
                                            }
                                        ]
                                    })
                                }
                            }
                        ]
                    }
                ]
            })
        }
    }

])

// 模拟数据
const tableData = ref([{
    id: 1,
    name: '生产数据库',
    type: 'MySQL',
    connection: 'jdbc:mysql://10.0.0.1:3306/prod',
    username: 'admin',
    status: 'connected',
    checkTime: '2024-07-01 14:30',
    remark: '主数据库集群'
}])

// 分页配置
const pagination = ref({
    pageSize: 10,
    currentPage: 1,
    total: 0
})

const checkData = (row) => { /* 检测逻辑 */ }
const showLog = (row) => { /* 查看日志 */ }
const editData = (row) => { /* 编辑逻辑 */ }
const deleteData = (row) => { /* 删除逻辑 */ }
</script>

<template>
    <div class="data-source-management">
        <Breadcrumb :bread-crumb-list="breadCrumbList" />
        <div class="zqy-seach-table message-notification">
            <div class="zqy-table-top">
                <div class="header-actions">
                    <el-button type="primary" @click="addData">
                        添加数据源
                    </el-button>
                    <el-select v-model="datasourceType" placeholder="全部类型" class="type-selector" filterable clearable
                        @change="handleChnage">
                        <el-option v-for="item in datasourceTypeList" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <el-input v-model="keyword" placeholder="搜索名称/连接信息/备注" class="search-input" clearable
                        :maxlength="200" @input="inputEvent" @keyup.enter="initData(false)">
                        <template #suffix>
                            <el-icon class="search-icon">
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                </div>
            </div>

            <LoadingPage :visible="loading" :network-error="networkError">
                <el-table :data="tableData" stripe v-loading="loading" style="width: 100%">
                    <template v-for="col in tableColumns" :key="col.prop || col.label">
                        <el-table-column :type="col.type" :prop="col.prop" :label="col.label" :width="col.width"
                            :min-width="col.minWidth" :fixed="col.fixed">
                            <template #default="scope">
                                <!-- 自动生成序号 -->
                                <template v-if="col.type === 'index'">
                                    {{ scope.$index + 1 }}
                                </template>
                                <component :is="col.render" v-if="col.render" :scope="scope" />
                                <template v-else>
                                    {{ scope.row[col.prop] }}
                                </template>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>

                <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                    :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
                    class="pagination-wrapper" />
            </LoadingPage>
        </div>
        <AddDataSourceDialog ref="addDataSourceDialog" />
    </div>
</template>

<style scoped lang="scss">
.header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;

    .type-selector {
        width: 160px;
        margin-right: auto;
    }

    .search-input {
        width: 320px;

        :deep(.el-input__inner) {
            padding-right: 40px;
        }

        .search-icon {
            font-size: 16px;
            padding: 0 12px;
            color: var(--el-text-color-placeholder);
        }
    }
}

.operation-btns {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-button {
        padding: 6px;

        :deep(.el-icon) {
            font-size: 16px;
        }
    }

    .danger-item {
        color: var(--el-color-danger);

        &:hover {
            background-color: var(--el-color-danger-light-9);
        }
    }
}

.pagination-wrapper {
    margin-top: 16px;
    justify-content: flex-end;
}
</style>