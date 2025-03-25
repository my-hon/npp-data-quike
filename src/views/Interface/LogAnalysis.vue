<template>
    <div class="log-analysis">
        <!-- 关键指标概览 -->
        <el-row :gutter="20" class="mb-4">
            <el-col :span="6">
                <el-card>
                    <div class="stat-card">
                        <el-icon class="custom-icon" style="color: #67C23A;">
                            <SuccessFilled />
                        </el-icon>
                        <div class="stat-content">
                            <div class="stat-title">调用成功率</div>
                            <div class="stat-numbers">{{ stats.successRate }}%</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="stat-card">
                        <el-icon class="custom-icon" style="color: #409EFF;">
                            <Timer />
                        </el-icon>
                        <div class="stat-content">
                            <div class="stat-title">平均响应时间</div>
                            <div class="stat-numbers">{{ stats.avgResponseTime }}ms</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="stat-card">
                        <el-icon class="custom-icon" style="color: #F56C6C;">
                            <WarningFilled />
                        </el-icon>
                        <div class="stat-content">
                            <div class="stat-title">错误率</div>
                            <div class="stat-numbers">{{ stats.errorRate }}%</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="stat-card">
                        <el-icon class="custom-icon" style="color: #909399;">
                            <Connection />
                        </el-icon>
                        <div class="stat-content">
                            <div class="stat-title">总调用量</div>
                            <div class="stat-numbers">{{ stats.totalCalls }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 日志筛选功能 -->
        <el-card class="mb-4">
            <div class="filter-section">
                <el-form :inline="true">
                    <el-form-item label="时间范围">
                        <el-date-picker v-model="filter.timeRange" type="datetimerange" range-separator="至"
                            start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>
                    <el-form-item label="接口名称">
                        <el-input v-model="filter.apiName" placeholder="请输入接口名称" clearable />
                    </el-form-item>
                    <el-form-item label="请求方法">
                        <el-select v-model="filter.method" placeholder="请求方法" clearable>
                            <el-option label="GET" value="GET" />
                            <el-option label="POST" value="POST" />
                            <el-option label="PUT" value="PUT" />
                            <el-option label="DELETE" value="DELETE" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="错误代码">
                        <el-select v-model="filter.errorCode" placeholder="错误代码" clearable>
                            <el-option label="400" value="400" />
                            <el-option label="404" value="404" />
                            <el-option label="500" value="500" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="调用来源IP">
                        <el-input v-model="filter.sourceIP" placeholder="请输入调用来源IP" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                        <el-button @click="resetFilter">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>

        <!-- 日志详情展示 -->
        <el-card>
            <div class="log-details">
                <div class="header">
                    <span>日志详情</span>
                    <div>
                        <el-button type="primary" @click="exportLogs('csv')">导出CSV</el-button>
                        <el-button type="success" @click="exportLogs('json')">导出JSON</el-button>
                    </div>
                </div>
                <el-table :data="filteredLogs" style="width: 100%">
                    <el-table-column prop="timestamp" label="时间戳" width="160" />
                    <el-table-column prop="apiPath" label="接口路径" width="200" />
                    <el-table-column prop="method" label="请求方法" width="100" />
                    <el-table-column prop="statusCode" label="响应状态码" width="120" />
                    <el-table-column prop="responseTime" label="耗时(ms)" width="100" />
                    <el-table-column prop="errorMessage" label="错误信息" />
                </el-table>
                <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                    :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
                    style="margin-top: 20px; justify-content: flex-end" />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 关键指标数据
const stats = ref({
    successRate: 98.5,
    avgResponseTime: 120,
    errorRate: 1.5,
    totalCalls: 1024
})

// 筛选条件
const filter = ref({
    timeRange: [],
    apiName: '',
    method: '',
    errorCode: '',
    sourceIP: ''
})

// 分页配置
const pagination = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0
})

// 模拟日志数据
const mockLogs = ref([
    {
        timestamp: '2023-10-01 10:00:00',
        apiPath: '/api/login',
        method: 'POST',
        statusCode: 200,
        responseTime: 120,
        errorMessage: '',
        sourceIP: '192.168.1.101' // 添加 sourceIP 字段
    },
    {
        timestamp: '2023-10-01 10:05:00',
        apiPath: '/api/orders',
        method: 'GET',
        statusCode: 404,
        responseTime: 50,
        errorMessage: '资源未找到',
        sourceIP: '192.168.1.102' // 添加 sourceIP 字段
    },
    {
        timestamp: '2023-10-01 10:10:00',
        apiPath: '/api/payment',
        method: 'POST',
        statusCode: 500,
        responseTime: 300,
        errorMessage: '服务器内部错误',
        sourceIP: '192.168.1.103' // 添加 sourceIP 字段
    }
])

// 过滤后的日志数据
const filteredLogs = computed(() => {
    console.log('filter:', filter.value) // 添加日志
    const filtered = mockLogs.value.filter(log => {
        const timeCondition = !filter.value.timeRange || (
            new Date(log.timestamp) >= filter.value.timeRange[0] &&
            new Date(log.timestamp) <= filter.value.timeRange[1]
        )
        const apiCondition = !filter.value.apiName || log.apiPath.includes(filter.value.apiName)
        const methodCondition = !filter.value.method || log.method === filter.value.method
        const errorCondition = !filter.value.errorCode || log.statusCode === parseInt(filter.value.errorCode)
        const ipCondition = !filter.value.sourceIP || log.sourceIP === filter.value.sourceIP
        return timeCondition && apiCondition && methodCondition && errorCondition && ipCondition
    })
    console.log('filteredLogs:', filtered) // 添加日志
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return filtered.slice(start, end)
})

// 查询处理
const handleSearch = () => {
    const filtered = mockLogs.value.filter(log => {
        const timeCondition = !filter.value.timeRange || (
            new Date(log.timestamp) >= filter.value.timeRange[0] &&
            new Date(log.timestamp) <= filter.value.timeRange[1]
        )
        const apiCondition = !filter.value.apiName || log.apiPath.includes(filter.value.apiName)
        const methodCondition = !filter.value.method || log.method === filter.value.method
        const errorCondition = !filter.value.errorCode || log.statusCode === parseInt(filter.value.errorCode)
        const ipCondition = !filter.value.sourceIP || log.sourceIP === filter.value.sourceIP
        return timeCondition && apiCondition && methodCondition && errorCondition && ipCondition
    })
    pagination.value.total = filtered.length // 使用过滤后的数据长度
    pagination.value.currentPage = 1
}

// 重置筛选条件
const resetFilter = () => {
    filter.value = {
        timeRange: [],
        apiName: '',
        method: '',
        errorCode: '',
        sourceIP: ''
    }
    handleSearch()
}

// 导出日志
const exportLogs = (format) => {
    const data = JSON.stringify(filteredLogs.value, null, 2)
    const blob = new Blob([data], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `logs.${format}`
    link.click()
    ElMessage.success(`日志已导出为${format.toUpperCase()}格式`)
}

// 在页面加载时自动查询数据
onMounted(() => {
    handleSearch()
})
</script>

<style scoped>
.log-analysis {
    padding: 20px;
}

.stat-card {
    display: flex;
    align-items: center;
}

.custom-icon {
    font-size: 24px;
    margin-right: 12px;
}

.stat-content {
    flex: 1;
}

.stat-title {
    font-size: 14px;
    color: #909399;
}

.stat-numbers {
    font-size: 24px;
    font-weight: bold;
    margin-top: 4px;
}

.filter-section {
    padding: 20px;
}

.log-details {
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
</style>