<template>
    <div class="interface-service">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
            <el-breadcrumb-item>接口治理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 监控面板 -->
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

        <!-- 搜索区域 -->
        <div class="search-actions">
            <el-input v-model="filter.keyword" placeholder="请输入接口名称或路径" clearable @input="handleSearch"
                style="width: 240px" />

            <el-select v-model="filter.method" placeholder="请求方法" clearable @change="handleSearch">
                <el-option label="GET" value="GET" />
                <el-option label="POST" value="POST" />
                <el-option label="PUT" value="PUT" />
                <el-option label="DELETE" value="DELETE" />
            </el-select>

            <el-select v-model="filter.status" placeholder="状态" clearable @change="handleSearch">
                <el-option label="在线" value="online" />
                <el-option label="离线" value="offline" />
                <el-option label="异常" value="error" />
            </el-select>

            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="success" @click="handleAdd">新增接口</el-button>
        </div>

        <!-- 接口列表 -->
        <el-card class="mb-4">
            <el-table :data="currentPageData" style="width: 100%">
                <el-table-column prop="name" label="接口名称" width="150" sortable />
                <el-table-column prop="url" label="接口路径" width="200" />
                <el-table-column prop="method" label="请求方法" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag
                            :type="row.status === 'online' ? 'success' : row.status === 'offline' ? 'info' : 'danger'">
                            {{ row.status === 'online' ? '在线' : row.status === 'offline' ? '离线' : '异常' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="permission" label="权限范围" width="120">
                    <template #default="{ row }">
                        <el-tag :type="row.permission === '内部专用' ? 'warning' : 'success'">
                            {{ row.permission }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="creator" label="创建人" width="120" />
                <el-table-column prop="createTime" label="创建时间" width="150" />
                <el-table-column label="操作" width="260">
                    <template #default="{ row }">
                        <el-button type="text" size="small" @click="handleOnline(row)">上线</el-button>
                        <el-button type="text" size="small" @click="handleOffline(row)">下线</el-button>
                        <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
                        <el-button type="text" size="small" @click="handleTest(row)">测试</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
                style="margin-top: 20px; justify-content: flex-end" />
        </el-card>

        <!-- 接口测试 -->
        <el-card class="mb-4">
            <div class="api-test-container">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-select v-model="testApi" placeholder="选择测试接口" style="width: 100%">
                            <el-option v-for="api in tableData" :key="api.url" :label="api.name" :value="api.url" />
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="testMethod" placeholder="请求方法" style="width: 100%">
                            <el-option label="GET" value="GET" />
                            <el-option label="POST" value="POST" />
                            <el-option label="PUT" value="PUT" />
                            <el-option label="DELETE" value="DELETE" />
                        </el-select>
                    </el-col>
                    <el-col :span="14">
                        <el-input v-model="testUrl" placeholder="请求URL" />
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="mt-4">
                    <el-col :span="24">
                        <el-button type="primary" @click="handleTest">发送请求</el-button>
                        <el-button @click="clearTest">清空</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { get } from '../../utils/requests.js'
import * as echarts from 'echarts'
const currentPageData = computed(() => {
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return filteredTableData.value.slice(start, end)
})

// 接口服务概览数据
const stats = ref({
    successRate: 98.5,
    avgResponseTime: 120,
    errorRate: 1.5,
    totalCalls: 1024
})

// 接口服务列表数据
const tableData = ref([])
const filteredTableData = ref([])

// 分页配置
const pagination = ref({
    pageSize: 5,
    currentPage: 1,
    total: 0
})

// 搜索条件
const filter = ref({
    keyword: '',
    method: '',
    status: ''
})

// 接口测试相关
const testApi = ref('')
const testMethod = ref('GET')
const testUrl = ref('')

// // 获取接口服务数据
// const fetchInterfaceData = async () => {
//   try {
//     const response = await get('/api/interface-services')
//     tableData.value = response.data.list
//     filteredTableData.value = response.data.list
//     pagination.value.total = response.data.total
//     initCharts(response.data.chartData)
//   } catch (error) {
//     console.error('获取接口服务数据失败:', error)
//   }
// }

// 生成模拟数据
const generateMockData = () => {
    const mockStats = {
        successRate: 98.5,
        avgResponseTime: 120,
        errorRate: 1.5,
        totalCalls: 1024
    }

    const mockList = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `接口服务 ${index + 1}`,
        method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
        url: `/api/v1/service/${index + 1}`,
        status: ['online', 'offline', 'error'][Math.floor(Math.random() * 3)],
        permission: ['内部专用', '外部开放'][Math.floor(Math.random() * 2)],
        creator: `用户${Math.floor(Math.random() * 10)}`,
        createTime: new Date(Date.now() - Math.random() * 86400000 * 30).toLocaleString(),
        remark: `备注信息 ${index + 1}`,
        successRate: Math.floor(Math.random() * 100),
        avgResponseTime: Math.floor(Math.random() * 1000),
        errorRate: Math.floor(Math.random() * 100),
        totalCalls: Math.floor(Math.random() * 1000)
    }))

    const mockChartData = {
        trend: {
            xAxis: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            yAxis: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
        },
        status: [
            { value: 40, name: '在线' },
            { value: 5, name: '离线' },
            { value: 5, name: '异常' }
        ]
    }

    return {
        stats: mockStats,
        list: mockList,
        total: mockList.length,
        chartData: mockChartData
    }
}

// 修改 fetchInterfaceData 方法
const fetchInterfaceData = async () => {
    try {
        // 使用模拟数据
        const mockData = generateMockData()
        tableData.value = mockData.list
        filteredTableData.value = mockData.list
        pagination.value.total = mockData.total
        stats.value = mockData.stats
        initCharts(mockData.chartData)
    } catch (error) {
        console.error('获取接口服务数据失败:', error)
    }
}

// 初始化图表
const initCharts = (chartData) => {
    const trendChart = echarts.init(document.getElementById('trend-chart'))
    trendChart.setOption({
        title: { text: '接口调用趋势（24小时）', left: 'center' },
        xAxis: { type: 'category', data: chartData.trend.xAxis },
        yAxis: { type: 'value' },
        series: [{ data: chartData.trend.yAxis, type: 'line' }]
    })

    const statusChart = echarts.init(document.getElementById('status-chart'))
    statusChart.setOption({
        title: { text: '接口状态分布', left: 'center' },
        series: [{ data: chartData.status, type: 'pie' }]
    })
}

// 搜索处理
const handleSearch = () => {
    filteredTableData.value = tableData.value.filter(api => {
        const keyword = filter.value.keyword.toLowerCase()
        return (
            (api.name.toLowerCase().includes(keyword) ||
                api.url.toLowerCase().includes(keyword)) &&
            (!filter.value.method || api.method === filter.value.method) &&
            (!filter.value.status || api.status === filter.value.status)
        )
    })
    pagination.value.total = filteredTableData.value.length
    pagination.value.currentPage = 1 // 搜索后重置到第一页
}

// 新增接口
const handleAdd = () => {
    console.log('新增接口')
}

// 接口操作处理
const handleOnline = (row) => {
    console.log('上线:', row)
}

const handleOffline = (row) => {
    console.log('下线:', row)
}

const handleEdit = (row) => {
    console.log('编辑:', row)
}

const handleTest = () => {
    console.log('测试接口:', testUrl.value)
}

const clearTest = () => {
    testApi.value = ''
    testMethod.value = 'GET'
    testUrl.value = ''
}

onMounted(fetchInterfaceData)
</script>

<style scoped>
.interface-service {
    padding: 20px;
    background-color: #fff;
}

/* 新增面包屑导航样式 */
.el-breadcrumb {
    margin-bottom: 30px;
    /* 增加下边距 */
}

.search-actions {
    margin: 20px 0;
    display: flex;
    gap: 10px;
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

.api-test-container {
    padding: 20px;
}
</style>