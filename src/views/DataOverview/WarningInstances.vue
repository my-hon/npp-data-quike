<script setup>
import { ref } from 'vue'

// 模拟数据
const tableData = ref([{
    id: 1,
    alertType: '资源超限',
    event: 'CPU使用率超过90%',
    instanceId: 'TASK-20240701-001',
    notifyMethod: '短信+邮件',
    recipients: '张三、李四',
    notifyTime: '2024-07-01 14:30',
    status: '成功'
}, {
    id: 2,
    alertType: '任务超时',
    event: '数据处理超时30分钟',
    instanceId: 'TASK-20240701-002',
    notifyMethod: '企业微信',
    recipients: '运维组',
    notifyTime: '2024-07-01 15:15',
    status: '失败'
}])

// 表格列配置
const tableColumns = [
    { type: 'index', label: '序号', width: 60 },
    { prop: 'alertType', label: '告警类型', width: 120 },
    { prop: 'event', label: '告警事件', minWidth: 200 },
    { prop: 'instanceId', label: '任务实例ID', width: 180 },
    { prop: 'notifyMethod', label: '通知方式', width: 120 },
    { prop: 'recipients', label: '通知人', width: 150 },
    { prop: 'notifyTime', label: '通知时间', width: 160 },
    {
        prop: 'status',
        label: '通知状态',
        width: 100,
        cellRenderer: ({ row }) => ({
            component: 'el-tag',
            props: {
                type: row.status === '成功' ? 'success' : 'danger',
                size: 'small'
            },
            children: row.status
        })
    },
    {
        label: '操作',
        width: 180,  // 调整列宽
        fixed: 'right',
        cellRenderer: ({ row }) => ({
            component: 'div',
            class: 'operation-btns',
            children: [
                {
                    component: 'el-button',
                    props: {
                        type: 'primary',
                        link: true,
                        icon: View,  // 直接使用导入的图标组件
                        title: '查看详情'
                    },
                    on: { click: () => showDetail(row) }
                },
                {
                    component: 'el-button',
                    props: {
                        type: 'warning',
                        link: true,
                        icon: 'Refresh',
                        title: '重试通知'
                    },
                    on: { click: () => handleRetry(row) }
                },
                {
                    component: 'el-dropdown',
                    children: [
                        {
                            component: 'el-button',
                            props: {
                                type: 'danger',
                                link: true,
                                icon: 'More'
                            }
                        },
                        {
                            component: 'template',
                            slots: {
                                dropdown: () => ({
                                    component: 'el-dropdown-menu',
                                    children: [{
                                        component: 'el-dropdown-item',
                                        on: { click: () => handleDelete(row) },
                                        children: '删除记录'
                                    }]
                                })
                            }
                        }
                    ]
                }
            ]
        })
    }
]

// 分页配置
const pagination = ref({
    pageSize: 10,
    currentPage: 1,
    total: 20
})

const loading = ref(false)
const networkError = ref(false)

const showDetail = (row) => {
    console.log('查看详情', row)
}

const handleRetry = (row) => {
    console.log('重试通知', row)
}

const handleDelete = (row) => {
    console.log('删除记录', row)
}
</script>

<template>
    <div class="warning">
        <!-- 保留面包屑导航 -->
        <Breadcrumb :bread-crumb-list="breadCrumbList" />

        <div class="zqy-seach-table message-notification">
            <div class="zqy-table-top">
                <div class="zqy-seach">
                    <el-input v-model="keyword" placeholder="请输入搜索条件 回车进行搜索" clearable @keyup.enter="initData(false)"
                        style="width: 300px" />
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
    </div>
</template>

<style scoped lang="scss">
.warning {
    .operation-btns {
        display: flex;
        align-items: center;
        gap: 8px;

        .el-button {
            padding: 6px;

            .el-icon {
                font-size: 16px;
            }
        }

        :deep(.el-dropdown) {
            margin-left: 4px;
        }
    }

    :deep(.el-table) {
        --el-table-header-bg-color: #f8f9fa;
        --el-table-border-color: #e9ecef;
    }

    .pagination-wrapper {
        margin-top: 16px;
        justify-content: flex-end;
    }

    .zqy-seach {
        margin-bottom: 16px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
