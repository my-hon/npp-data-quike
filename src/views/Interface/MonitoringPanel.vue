<template>
    <div class="monitoring-panel">
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

        <!-- 趋势图表分析 -->
        <el-row :gutter="20" class="mb-4">
            <el-col :span="12">
                <el-card>
                    <div class="chart-container">
                        <div class="chart-header">
                            <span>调用趋势</span>
                            <el-select v-model="timeRange" placeholder="时间范围" @change="updateCharts">
                                <el-option label="近1小时" value="1h" />
                                <el-option label="近24小时" value="24h" />
                                <el-option label="近7天" value="7d" />
                            </el-select>
                        </div>
                        <div id="trend-chart" style="height: 300px;"></div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <div class="chart-container">
                        <div class="chart-header">
                            <span>调用热力图</span>
                        </div>
                        <div id="heatmap-chart" style="height: 300px;"></div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 接口健康状态监控 -->
        <el-card>
            <div class="health-status">
                <div class="header">
                    <span>接口健康状态</span>
                </div>
                <el-table :data="healthStatusData" style="width: 100%">
                    <el-table-column prop="name" label="接口名称" width="150" />
                    <el-table-column prop="url" label="接口路径" width="200" />
                    <el-table-column prop="status" label="状态" width="100">
                        <template #default="{ row }">
                            <el-tag
                                :type="row.status === 'normal' ? 'success' : row.status === 'warning' ? 'warning' : 'danger'">
                                {{ row.status === 'normal' ? '正常' : row.status === 'warning' ? '警告' : '异常' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="successRate" label="成功率" width="100" />
                    <el-table-column prop="responseTime" label="响应时间" width="100" />
                    <el-table-column label="操作" width="120">
                        <template #default="{ row }">
                            <el-button type="text" size="small" @click="viewDetails(row)">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 关键指标数据
const stats = ref({
    successRate: 98.5,
    avgResponseTime: 120,
    errorRate: 1.5,
    totalCalls: 1024
})

// 时间范围选择
const timeRange = ref('24h')

// 接口健康状态数据
const healthStatusData = ref([
    { name: '用户登录', url: '/api/login', status: 'normal', successRate: '99%', responseTime: '120ms' },
    { name: '订单查询', url: '/api/orders', status: 'warning', successRate: '95%', responseTime: '200ms' },
    { name: '支付接口', url: '/api/payment', status: 'error', successRate: '85%', responseTime: '300ms' }
])

// 初始化图表
const initCharts = () => {
    const trendChart = echarts.init(document.getElementById('trend-chart'))
    trendChart.setOption({
        title: { text: '调用趋势', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: Array.from({ length: 24 }, (_, i) => `${i}:00`) },
        yAxis: { type: 'value' },
        series: [{ data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)), type: 'line' }]
    })

    const heatmapChart = echarts.init(document.getElementById('heatmap-chart'))
    heatmapChart.setOption({
        title: { text: '调用热力图', left: 'center' },
        tooltip: { position: 'top' },
        xAxis: { type: 'category', data: Array.from({ length: 24 }, (_, i) => `${i}:00`) },
        yAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        visualMap: { min: 0, max: 10, calculable: true, orient: 'horizontal', left: 'center', bottom: '15%' },
        series: [{
            type: 'heatmap',
            data: Array.from({ length: 7 * 24 }, () => [
                Math.floor(Math.random() * 24),
                Math.floor(Math.random() * 7),
                Math.floor(Math.random() * 10)
            ]),
            label: { show: false }
        }]
    })
}

// 更新图表数据
const updateCharts = () => {
    initCharts()
}

// 查看接口详情
const viewDetails = (row) => {
    console.log('查看详情:', row)
}

onMounted(() => {
    initCharts()
})
</script>

<style scoped>
.monitoring-panel {
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

.chart-container {
    padding: 20px;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.health-status {
    padding: 20px;
}

.header {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: bold;
}
</style>