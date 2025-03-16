<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { GaugeChart, PieChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 初始化ECharts
echarts.use([GaugeChart, PieChart, LineChart, TitleComponent,
    TooltipComponent, LegendComponent, GridComponent, CanvasRenderer])

// 图表实例引用
const clusterGauge = ref(null)
const dataSourceGauge = ref(null)
const taskPie = ref(null)
const trendLine = ref(null)

// 响应式数据
const statsData = ref({
    clusterUsage: 72,
    dataSources: 28,
    successTasks: 1560,
    failedTasks: 42,
    timeSeries: Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        value: Math.floor(Math.random() * 200)
    }))
})

// 图表初始化
const initCharts = () => {
    // 集群使用率仪表盘
    initGaugeChart(clusterGauge.value, statsData.value.clusterUsage, '#ED7B09')

    // 数据源仪表盘
    initGaugeChart(dataSourceGauge.value, statsData.value.dataSources, '#1967BF')

    // 任务状态饼图
    initPieChart()

    // 趋势折线图
    initLineChart()
}

const initGaugeChart = (dom, value, color) => {
    const chart = echarts.init(dom)
    chart.setOption({
        series: [{
            type: 'gauge',
            radius: '90%',
            progress: { show: true, width: 12 },
            axisLine: { lineStyle: { color: [[1, color]], width: 12 } },
            detail: {
                valueAnimation: true,
                fontSize: 24,
                offsetCenter: [0, '60%'],
                formatter: '{value}%'
            },
            data: [{ value }]
        }]
    })
}

const initPieChart = () => {
    const chart = echarts.init(taskPie.value)
    chart.setOption({
        tooltip: { trigger: 'item' },
        legend: { bottom: 0 },
        series: [{
            type: 'pie',
            radius: ['35%', '65%'],
            label: { show: false },
            data: [
                { value: statsData.value.successTasks, name: '成功' },
                { value: statsData.value.failedTasks, name: '失败' }
            ]
        }]
    })
}

const initLineChart = () => {
    const chart = echarts.init(trendLine.value)
    chart.setOption({
        xAxis: {
            type: 'category',
            data: statsData.value.timeSeries.map(v => v.hour)
        },
        yAxis: { type: 'value' },
        tooltip: { trigger: 'axis' },
        series: [{
            type: 'line',
            smooth: true,
            areaStyle: { color: 'rgba(66, 165, 245, 0.1)' },
            lineStyle: { color: '#42a5f5', width: 2 },
            data: statsData.value.timeSeries.map(v => v.value)
        }]
    })
}

onMounted(async () => {
    // 这里可以添加真实数据请求
    await nextTick()
    initCharts()
})
</script>

<template>
    <div class="dashboard-container">
        <!-- 顶部指标行 -->
        <div class="metric-row">
            <div class="metric-card">
                <h3>集群使用率</h3>
                <div ref="clusterGauge" class="chart-gauge"></div>
            </div>
            <div class="metric-card">
                <h3>活跃数据源</h3>
                <div ref="dataSourceGauge" class="chart-gauge"></div>
            </div>
        </div>

        <!-- 主内容区 -->
        <div class="content-row">
            <div class="main-chart">
                <h3>任务执行趋势（24小时）</h3>
                <div ref="trendLine" class="chart-line"></div>
            </div>
            <div class="side-chart">
                <h3>任务状态分布</h3>
                <div ref="taskPie" class="chart-pie"></div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.dashboard-container {
    padding: 5px 5px;
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 16px;
}

.metric-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    height: 240px;
}

.content-row {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 16px;
    height: calc(100vh - 280px);
}

.metric-card,
.main-chart,
.side-chart {
    background: var(--el-bg-color);
    border-radius: 8px;
    padding: 16px;
    box-shadow: var(--el-box-shadow-light);
    display: flex;
    flex-direction: column;

    h3 {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: var(--el-text-color-primary);
        height: 32px;
    }
}

// 优化图表容器尺寸
.chart-gauge {
    flex: 1;
    min-height: 180px;
}

.chart-pie {
    flex: 1;
    min-height: 280px;
}

.chart-line {
    flex: 1;
    min-height: 300px;
}

// 添加响应式适配
@media (max-width: 1280px) {
    .content-row {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 320px;
    }

    .metric-row {
        grid-template-columns: 1fr 1fr;
        height: auto;
    }
}

@media (max-width: 768px) {
    .metric-row {
        grid-template-columns: 1fr;
    }

    .content-row {
        grid-template-rows: 400px 300px;
    }
}
</style>
