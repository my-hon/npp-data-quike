<script setup>
import { ref, onMounted } from 'vue'
import { get } from '../../utils/requests.js'
import * as echarts from 'echarts'

// 接口服务概览数据
const stats = ref({
    total: 0,
    online: 0,
    offline: 0,
    error: 0
})

// 接口服务列表数据
const tableData = ref([])

// 分页配置
const pagination = ref({
    pageSize: 10,
    currentPage: 1,
    total: 0
})

// 伪造数据生成函数
const generateMockData = () => {
    const mockStats = {
        total: 50,
        online: 40,
        offline: 5,
        error: 5
    }

    const mockList = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `接口服务 ${index + 1}`,
        method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
        url: `/api/v1/service/${index + 1}`,
        status: index % 10 === 0 ? 'offline' : 'online',
        creator: `用户${Math.floor(Math.random() * 10)}`,
        createTime: new Date(Date.now() - Math.random() * 86400000 * 30).toLocaleString(),
        remark: `备注信息 ${index + 1}`
    }))

    const mockChartData = {
        trend: {
            xAxis: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            yAxis: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
        },
        status: [
            { value: mockStats.online, name: '在线' },
            { value: mockStats.offline, name: '离线' },
            { value: mockStats.error, name: '异常' }
        ]
    }

    return {
        stats: mockStats,
        list: mockList,
        total: mockList.length,
        chartData: mockChartData
    }
}

// 获取接口服务数据
const fetchInterfaceData = async () => {
    try {
        //const response = await get('/api/interface-services')
        // stats.value = response.data.stats
        // tableData.value = response.data.list
        // pagination.value.total = response.data.total
        // initCharts(response.data.chartData)
        // 使用伪造数据
        const mockData = generateMockData()
        stats.value = mockData.stats
        tableData.value = mockData.list
        pagination.value.total = mockData.total
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

onMounted(fetchInterfaceData)

// 添加操作处理方法
const handleOnline = (row) => {
    console.log('上线:', row)
}

const handleOffline = (row) => {
    console.log('下线:', row)
}

const handleEdit = (row) => {
    console.log('编辑:', row)
}

const handleTest = (row) => {
    console.log('测试:', row)
}
</script>

<template>
    <div class="interface-service">
        <!-- 接口服务概览 -->
        <el-row :gutter="20" class="mb-4">
            <el-col :span="6">
                <el-card>
                    <div class="stat-card">
                        <el-icon class="custom-icon" style="color: #67C23A;">
                            <Connection />
                        </el-icon>
                        <div class="stat-content">
                            <div class="stat-title">接口总数</div>
                            <div class="stat-numbers">{{ stats.total }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="stat-card">
                        <el-icon class="custom-icon" style="color: #409EFF;">
                            <SuccessFilled />
                        </el-icon>
                        <div class="stat-content">
                            <div class="stat-title">在线接口</div>
                            <div class="stat-numbers">{{ stats.online }}</div>
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
                            <div class="stat-title">异常接口</div>
                            <div class="stat-numbers">{{ stats.error }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="stat-card">
                        <el-icon class="custom-icon" style="color: #909399;">
                            <CloseBold />
                        </el-icon>
                        <div class="stat-content">
                            <div class="stat-title">离线接口</div>
                            <div class="stat-numbers">{{ stats.offline }}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!-- 接口服务列表 -->
        <el-card class="mb-4">
            <el-table
                :data="tableData.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize)"
                style="width: 100%">
                <el-table-column prop="name" label="接口名称" width="150" />
                <el-table-column prop="method" label="请求方式" width="100" />
                <el-table-column prop="url" label="访问地址" width="200" />
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'online' ? 'success' : 'danger'">
                            {{ row.status === 'online' ? '在线' : '离线' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="creator" label="创建人" width="120" />
                <el-table-column prop="createTime" label="创建时间" width="150" />
                <el-table-column prop="remark" label="备注" width="200" />
                <el-table-column label="操作" width="260">
                    <template #default="{ row }">
                        <el-button type="text" size="small" @click="handleOnline(row)">上线</el-button>
                        <el-button type="text" size="small" @click="handleOffline(row)">下线</el-button>
                        <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
                        <el-button type="text" size="small" @click="handleTest(row)">测试</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" class="pagination-wrapper" />
        </el-card>

        <!-- 接口调用趋势图 -->
        <el-row :gutter="20" class="mb-4">
            <el-col :span="12">
                <el-card>
                    <div id="trend-chart" style="height: 300px"></div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <div id="status-chart" style="height: 300px"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.interface-service {
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
    color: var(--el-text-color-secondary);
}

.stat-numbers {
    font-size: 18px;
    font-weight: bold;
}

.pagination-wrapper {
    margin-top: 20px;
    text-align: right;
}
</style>
