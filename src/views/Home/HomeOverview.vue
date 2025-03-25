<script setup>
import { ref, onMounted } from 'vue'
import { ElCard, ElRow, ElCol, ElTable, ElTableColumn } from 'element-plus'
import * as echarts from 'echarts'
import DataSourceCard from './components/Card_HomeOverview/DataSource.vue'
import Hadoop from './components/Card_HomeOverview/Hadoop.vue'
import API from './components/Card_HomeOverview/Api.vue'
import Task from './components/Card_HomeOverview/Task.vue'
const stats = ref({
    dataSources: { connected: 12, offline: 3 },
    integrationTasks: { running: 5, stopped: 2 },
    devTasks: { running: 8, stopped: 1 },
    apis: { internal: 15, external: 7 }
})

const hadoopNodes = ref([
    {
        name: 'hadoop-node-01',
        status: '运行中',
        cpuUsage: '45%',
        lastHeartbeat: '2023-10-01 14:30:22'
    },
    {
        name: 'hadoop-node-02',
        status: '已停止',
        cpuUsage: '0%',
        lastHeartbeat: '2023-09-30 18:15:10'
    },
    {
        name: 'hadoop-node-03',
        status: '运行中',
        cpuUsage: '78%',
        lastHeartbeat: '2023-10-01 14:28:45'
    }
])

const hadoopTasks = ref([
    {
        id: 'task-001',
        type: 'MapReduce',
        status: '进行中',
        progress: '65%'
    },
    {
        id: 'task-002',
        type: 'HDFS 维护',
        status: '已完成',
        progress: '100%'
    },
    {
        id: 'task-003',
        type: 'YARN 调度',
        status: '等待中',
        progress: '0%'
    }
])

// 图表数据
// 修改图表数据
const chartData = ref({
    sourceTypes: [
        { value: 1048, name: 'MySQL' },
        { value: 735, name: 'Oracle' },
        { value: 580, name: 'MongoDB' },
        { value: 484, name: 'Redis' }
    ],
    storageTrend: {
        dates: Array.from({ length: 60 }, (_, i) => {
            const now = new Date()
            const time = new Date(now.getTime() - (60 - i) * 60000)
            return `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`
        }),
        sources: [
            {
                name: 'MySQL',
                data: Array.from({ length: 60 }, (_, i) => {
                    const base = 200
                    const trend = i * 2
                    const noise = Math.sin(i / 5) * 10
                    return Math.round(base + trend + noise)
                }),
                maxCapacity: 500
            },
            {
                name: 'Oracle',
                data: Array.from({ length: 60 }, (_, i) => {
                    const base = 400
                    const trend = i * 3
                    const noise = Math.cos(i / 4) * 15
                    return Math.round(base + trend + noise)
                }),
                maxCapacity: 800
            },
            {
                name: 'MongoDB',
                data: Array.from({ length: 60 }, (_, i) => {
                    const base = 300
                    const trend = i * 1.5
                    const noise = Math.sin(i / 6) * 8
                    return Math.round(base + trend + noise)
                }),
                maxCapacity: 600
            }
        ]
    },
    taskTypes: {
        types: ['Hadoop', 'Spark', '关系型数据库', 'NoSQL', '流处理'],
        counts: [120, 200, 150, 80, 60]
    }
})

// 修改初始化图表函数
const initCharts = () => {
    const pieChart = echarts.init(document.getElementById('pie-chart'))
    pieChart.setOption({
        tooltip: { trigger: 'item' },
        series: [{ type: 'pie', data: chartData.value.sourceTypes }]
    })

    // 修改存储变化图表
    const storageChart = echarts.init(document.getElementById('storage-chart'))
    storageChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: chartData.value.storageTrend.dates },
        yAxis: { type: 'value' },
        series: [
            ...chartData.value.storageTrend.sources.map(source => ({
                name: source.name,
                data: source.data,
                type: 'line',
                smooth: true
            })),
            ...chartData.value.storageTrend.sources.map(source => ({
                name: `${source.name} 最大容量`,
                data: Array(60).fill(source.maxCapacity),
                type: 'line',
                lineStyle: { type: 'dashed' },
                itemStyle: { opacity: 0 }
            }))
        ]
    })

    // 修改任务统计图表
    const barChart = echarts.init(document.getElementById('bar-chart'))
    barChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: chartData.value.taskTypes.types },
        yAxis: { type: 'value' },
        series: [{
            data: chartData.value.taskTypes.counts,
            type: 'bar',
            itemStyle: {
                color: params => {
                    const colors = ['#5470C6', '#91CC75', '#EE6666', '#FAC858', '#73C0DE']
                    return colors[params.dataIndex % colors.length]
                }
            }
        }]
    })
}


onMounted(() => {
    initCharts()
})
</script>



<template>
    <div class="overview-container">
        <!-- 第一行：统计卡片 -->
        <el-row :gutter="20" class="mb-4">
            <DataSourceCard />
            <Hadoop />
            <API />
            <Task />
        </el-row>

        <!-- 第二行：Hadoop 系统信息 -->
        <el-row :gutter="20" class="mb-4">
            <el-col :span="12">
                <el-card>
                    <div class="table-header">Hadoop 节点状态</div>
                    <el-table :data="hadoopNodes" style="width: 100%; height: 300px;">
                        <el-table-column prop="name" label="节点名称" />
                        <el-table-column prop="status" label="节点状态">
                            <template #default="{ row }">
                                <el-tag :type="row.status === '运行中' ? 'success' : 'danger'">
                                    {{ row.status }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cpuUsage" label="CPU 使用率" />
                        <el-table-column prop="lastHeartbeat" label="最后心跳时间" />
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <div class="table-header">Hadoop 任务状态</div>
                    <el-table :data="hadoopTasks" style="width: 100%; height: 300px;">
                        <el-table-column prop="id" label="任务 ID" />
                        <el-table-column prop="type" label="任务类型" />
                        <el-table-column prop="status" label="任务状态">
                            <template #default="{ row }">
                                <el-tag
                                    :type="row.status === '已完成' ? 'success' : row.status === '进行中' ? 'warning' : 'info'">
                                    {{ row.status }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="progress" label="进度百分比" />
                    </el-table>
                </el-card>
            </el-col>
        </el-row>

        <!-- 第三行：图表卡片 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card>
                    <div class="chart-header">数据源类型分布</div>
                    <div id="pie-chart" style="height: 300px"></div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <div class="chart-header">存储变化趋势</div>
                    <div id="storage-chart" style="height: 300px"></div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <div class="chart-header">任务类型统计</div>
                    <div id="bar-chart" style="height: 300px"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style>
.overview-container {
    padding: 20px;
}

.stat-card {
    display: flex;
    align-items: center;
}

.stat-content {
    margin-left: 20px;
}

.stat-title {
    font-size: 16px;
    color: #666;
    font-weight: 600;
    /* 加粗标题字体 */
    margin-bottom: 8px;
}

.chart-header {
    font-size: 18px;
    font-weight: 600;
    /* 加粗图表标题字体 */
    color: #333;
    margin-bottom: 16px;
    padding: 0 16px;
    padding-top: 16px;
}

.table-header {
    font-size: 18px;
    font-weight: 2500;
    /* 加粗表格标题字体 */
    color: #333;
    margin-bottom: 16px;
    padding: 0 16px;
    padding-top: 16px;
}

.stat-numbers {
    font-size: 18px;
    /* 减小数字字体 */
    font-weight: bold;
}

.connected {
    color: #67c23a;
}

.offline {
    color: #f56c6c;
}

.completed {
    color: #67c23a;
}

.running {
    color: #c2a23a;
}

.stopped,
.false {
    color: #f56c6c;
}

.internal {
    color: #409eff;
}

.external {
    color: #e6a23c;
}

.mb-4 {
    margin-bottom: 20px;
}

.custom-icon {
    font-size: 28px;
    /* 减小图标大小 */
    font-weight: bold;
    transition: all 0.3s ease;
    color: inherit;
    /* 继承父元素颜色 */
}

.stat-card:hover .custom-icon {
    transform: scale(1.05);
    /* 减小放大比例 */
    opacity: 0.9;
}

.chart-header {
    font-size: 18px;
    font-weight: 800;
    color: #666;
    margin-bottom: 16px;
    padding: 0 16px;
    padding-top: 16px;
}

.table-header {
    font-size: 18px;
    font-weight: 800;
    color: #666;
    margin-bottom: 16px;
    padding: 0 16px;
    padding-top: 16px;
}

/* 修改样式 */
.node-table {
    overflow-y: auto;
    height: 100%;
}

.node-table .el-table__body-wrapper {
    overflow-y: auto !important;
    height: 100%;
}

.node-table .el-table__body {
    min-height: 100px;
}

/* 确保滚动条样式统一 */
.node-table::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.node-table::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.node-table::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.node-table::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
