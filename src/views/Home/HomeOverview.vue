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

// 图表数据
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
            const time = new Date(now.getTime() - (60 - i) * 60000) // 从当前时间往前推1小时
            return `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}` // 24小时制，分钟补零
        }),
        counts: Array.from({ length: 60 }, () => Math.floor(Math.random() * 1000)) // 随机生成存储变化数据
    },
    taskTypes: {
        types: ['数据管理', '数据分析', '权限管理'],
        counts: [120, 200, 150,]
    }
})

// 节点管理数据
const nodeList = ref([
    {
        hostname: 'node-01',
        ips: ['192.168.1.101', '192.168.1.102'],
        type: '计算节点',
        isAlive: true
    },
    {
        hostname: 'node-02',
        ips: ['192.168.1.103'],
        type: '存储节点',
        isAlive: false
    },
    {
        hostname: 'node-03',
        ips: ['192.168.1.104', '192.168.1.105', '192.168.1.106'],
        type: '计算节点',
        isAlive: true
    },
    {
        hostname: 'node-04',
        ips: ['192.168.1.107'],
        type: '存储节点',
        isAlive: true
    },
    {
        hostname: 'node-05',
        ips: ['192.168.1.108', '192.168.1.109'],
        type: '计算节点',
        isAlive: false
    },
    {
        hostname: 'node-06',
        ips: ['192.168.1.110'],
        type: '存储节点',
        isAlive: true
    },
    {
        hostname: 'node-07',
        ips: ['192.168.1.111', '192.168.1.112'],
        type: '计算节点',
        isAlive: false
    },
    {
        hostname: 'node-08',
        ips: ['192.168.1.113'],
        type: '存储节点',
        isAlive: true
    },
    {
        hostname: 'node-09',
        ips: ['192.168.1.114', '192.168.1.115'],
        type: '计算节点',
        isAlive: true
    },
    {
        hostname: 'node-10',
        ips: ['192.168.1.116'],
        type: '存储节点',
        isAlive: false
    }
])

// 初始化图表
const initCharts = () => {
    const pieChart = echarts.init(document.getElementById('pie-chart'))
    pieChart.setOption({
        tooltip: { trigger: 'item' },
        series: [{ type: 'pie', data: chartData.value.sourceTypes }]
    })

    const storageChart = echarts.init(document.getElementById('storage-chart'))
    storageChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: chartData.value.storageTrend.dates },
        yAxis: { type: 'value' },
        series: [{
            data: chartData.value.storageTrend.counts,
            type: 'line',
            areaStyle: { color: '#409EFF' }, // 设置面积图颜色
            smooth: true // 平滑曲线
        }]
    })

    const barChart = echarts.init(document.getElementById('bar-chart'))
    barChart.setOption({
        xAxis: { type: 'category', data: chartData.value.taskTypes.types },
        yAxis: { type: 'value' },
        series: [{ data: chartData.value.taskTypes.counts, type: 'bar' }]
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

        <!-- 第二行：节点管理表格 -->
        <el-row :gutter="20" class="mb-4 nodeList">
            <el-col :span="24">
                <el-card style="height: 350px;">
                    <div class="table-header">节点管理</div>
                    <el-table :data="nodeList" style="width: 100%;height: calc(100% - 50px);overflow-y: auto;">
                        <el-table-column prop="hostname" label="主机名" :span-method="({ row, $index }) => {
            const prevRow = nodeList.value[$index - 1]
            if (prevRow && prevRow.hostname === row.hostname) {
                return { rowspan: 0, colspan: 0 }
            }
            let rowspan = 1
            for (let i = $index + 1; i < nodeList.value.length; i++) {
                if (nodeList.value[i].hostname === row.hostname) {
                    rowspan++
                } else {
                    break
                }
            }
            return { rowspan, colspan: 1 }
        }" />
                        <el-table-column prop="ips" label="主机IP">
                            <template #default="{ row }">
                                <div v-for="ip in row.ips" :key="ip">{{ ip }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" label="节点类型" />
                        <el-table-column prop="isAlive" label="是否存活">
                            <template #default="{ row }">
                                <el-icon v-if="row.isAlive" color="#67C23A">
                                    <SuccessFilled />
                                </el-icon>
                                <el-icon v-else color="#F56C6C">
                                    <CloseBold />
                                </el-icon>
                            </template>
                        </el-table-column>
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
</style>
