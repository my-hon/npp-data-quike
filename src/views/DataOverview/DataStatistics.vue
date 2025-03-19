<script setup>
import { ref } from 'vue'
import { ElCard, ElRow, ElCol, ElProgress } from 'element-plus'

// 核心业务健康度指标
const healthIndicators = ref([
  {
    title: '数据质量评分',
    value: 89,
    max: 100,
    color: '#67C23A',
    desc: '基于字段空值率、重复率、一致性规则计算'
  },
  {
    title: '用户活跃渗透率',
    value: 75,
    trend: '↑5%',
    desc: '统计有操作行为的用户占比'
  },
  {
    title: '存储成本效率',
    value: '¥120/TB/天',
    waste: 'HDFS冷数据占比：35%',
    desc: '计算每TB存储的日均查询价值'
  },
  {
    title: '合规风险指数',
    value: '低风险',
    pending: '3项待处理',
    desc: '根据高危操作、权限越界事件动态计算'
  }
])

// 数据血缘依赖图数据
const dataLineage = ref({
  nodes: [
    { id: 'source1', type: 'source', label: 'MySQL' },
    { id: 'table1', type: 'table', label: '订单表' },
    { id: 'table2', type: 'table', label: '用户表' },
    { id: 'consumer1', type: 'consumer', label: '报表系统' }
  ],
  links: [
    { source: 'source1', target: 'table1' },
    { source: 'table1', target: 'table2' },
    { source: 'table2', target: 'consumer1' }
  ]
})

// 字段质量分布数据
const fieldQuality = ref({
  xAxis: ['表A', '表B', '表C', '表D'],
  yAxis: [15, 30, 45, 60],
  size: [10, 20, 30, 40]
})

// 用户操作密度数据
const userActivity = ref({
  hours: Array.from({ length: 24 }, (_, i) => i),
  modules: ['数据上传', 'SQL查询', '数据删除'],
  data: [
    [10, 20, 5],
    [15, 25, 8],
    // ... 其他小时数据
  ]
})

// 资源消耗TOP10数据
const resourceUsage = ref({
  cpuTasks: [
    { name: 'Spark任务X', value: 80 },
    { name: 'Flink任务Y', value: 70 }
  ],
  storageTables: [
    { name: '日志表A', value: 500 },
    { name: '用户表B', value: 300 }
  ]
})

// 权限过载预警数据
const permissionWarning = ref({
  roles: ['运维A', '运维B', '开发A'],
  permissions: [50, 60, 40],
  users: [10, 15, 20]
})

// 冷热数据分层数据
const dataTemperature = ref({
  hot: 40,
  warm: 30,
  cold: 30
})

// 故障根因预测数据
const failureAnalysis = ref({
  stages: ['超时', '网络抖动', '配置错误'],
  values: [60, 30, 15]
})

// 容量预警数据
const capacityWarning = ref({
  months: ['7月', '8月', '9月'],
  storage: [100, 150, 200],
  compute: [80, 120, 160]
})

// 新增 ECharts 导入
import * as echarts from 'echarts'
import { onMounted } from 'vue'

// 初始化图表
const initCharts = () => {
  // 数据血缘图
  const lineageChart = echarts.init(document.querySelector('.lineage-chart'))
  lineageChart.setOption({
    series: [{
      type: 'graph',
      layout: 'force',
      data: dataLineage.value.nodes,
      links: dataLineage.value.links,
      roam: true,
      label: {
        show: true,
        position: 'right'
      },
      force: {
        repulsion: 100
      }
    }]
  })

  // 字段质量分布图
  const qualityChart = echarts.init(document.querySelector('.quality-chart'))
  qualityChart.setOption({
    xAxis: {
      data: fieldQuality.value.xAxis
    },
    yAxis: {},
    series: [{
      type: 'scatter',
      data: fieldQuality.value.yAxis.map((y, i) => ({
        value: [i, y],
        symbolSize: fieldQuality.value.size[i]
      }))
    }]
  })

  // 用户操作密度热力图
  const activityChart = echarts.init(document.querySelector('.activity-heatmap'))
  activityChart.setOption({
    xAxis: {
      type: 'category',
      data: userActivity.value.hours
    },
    yAxis: {
      type: 'category',
      data: userActivity.value.modules
    },
    visualMap: {
      min: 0,
      max: 50,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%'
    },
    series: [{
      type: 'heatmap',
      data: userActivity.value.data.flatMap((row, hour) => 
        row.map((value, moduleIndex) => [hour, moduleIndex, value])
      )
    }]
  })

  // 资源消耗TOP10
  const resourceChart = echarts.init(document.querySelector('.resource-usage'))
  resourceChart.setOption({
    tooltip: {},
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: resourceUsage.value.cpuTasks.map(t => t.name)
    },
    series: [
      {
        name: 'CPU',
        type: 'bar',
        data: resourceUsage.value.cpuTasks.map(t => t.value)
      },
      {
        name: '存储',
        type: 'bar',
        data: resourceUsage.value.storageTables.map(t => t.value)
      }
    ]
  })

  // 权限过载预警
  const permissionChart = echarts.init(document.querySelector('.permission-warning'))
  permissionChart.setOption({
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      type: 'scatter',
      data: permissionWarning.value.roles.map((role, i) => ({
        value: [permissionWarning.value.permissions[i], permissionWarning.value.users[i]],
        name: role
      })),
      symbolSize: (val) => val[1] * 2
    }]
  })

  // 冷热数据分层
  const temperatureChart = echarts.init(document.querySelector('.data-temperature'))
  temperatureChart.setOption({
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: dataTemperature.value.hot, name: '热数据' },
        { value: dataTemperature.value.warm, name: '温数据' },
        { value: dataTemperature.value.cold, name: '冷数据' }
      ]
    }]
  })

  // 故障根因预测
  const failureChart = echarts.init(document.querySelector('.failure-analysis'))
  failureChart.setOption({
    series: [{
      type: 'funnel',
      data: failureAnalysis.value.stages.map((stage, i) => ({
        value: failureAnalysis.value.values[i],
        name: stage
      }))
    }]
  })

  // 容量预警时序图
  const capacityChart = echarts.init(document.querySelector('.capacity-warning'))
  capacityChart.setOption({
    xAxis: {
      type: 'category',
      data: capacityWarning.value.months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '存储',
        type: 'line',
        data: capacityWarning.value.storage
      },
      {
        name: '计算',
        type: 'line',
        data: capacityWarning.value.compute
      }
    ]
  })
}

onMounted(() => {
  initCharts()
})
</script>

<template>
  <div class="data-statistics">
    <!-- 顶部健康度指标 -->
    <el-row :gutter="20" class="health-indicators">
      <el-col v-for="(item, index) in healthIndicators" :key="index" :span="6">
        <el-card>
          <h3>{{ item.title }}</h3>
          <div v-if="item.max" class="progress-container">
            <el-progress 
              :percentage="item.value" 
              :color="item.color"
              :show-text="false"
            />
            <span class="value">{{ item.value }}/{{ item.max }}</span>
          </div>
          <div v-else class="value">{{ item.value }}</div>
          <div class="desc">{{ item.desc }}</div>
          <div v-if="item.trend" class="trend">{{ item.trend }}</div>
          <div v-if="item.waste" class="waste">{{ item.waste }}</div>
          <div v-if="item.pending" class="pending">{{ item.pending }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 中部区域 -->
    <el-row :gutter="20" class="middle-section">
      <!-- 左侧：数据质量与血缘分析 -->
      <el-col :span="12">
        <el-card>
          <h3>数据血缘依赖图</h3>
          <!-- 血缘图组件 -->
          <div class="lineage-chart">
            <!-- 这里放置血缘图实现 -->
          </div>

          <h3>字段质量分布</h3>
          <div class="quality-chart">
            <!-- 这里放置散点图实现 -->
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：用户行为与资源消耗 -->
      <el-col :span="12">
        <el-card>
          <h3>用户操作密度热力图</h3>
          <div class="activity-heatmap">
            <!-- 这里放置热力图实现 -->
          </div>

          <h3>资源消耗TOP10</h3>
          <div class="resource-usage">
            <!-- 这里放置双向条形图实现 -->
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部区域 -->
    <el-row :gutter="20" class="bottom-section">
      <!-- 左侧：安全与成本优化 -->
      <el-col :span="12">
        <el-card>
          <h3>权限过载预警</h3>
          <div class="permission-warning">
            <!-- 这里放置矩阵气泡图实现 -->
          </div>

          <h3>冷热数据分层</h3>
          <div class="data-temperature">
            <!-- 这里放置环形图实现 -->
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：系统性风险预测 -->
      <el-col :span="12">
        <el-card>
          <h3>故障根因预测</h3>
          <div class="failure-analysis">
            <!-- 这里放置漏斗图实现 -->
          </div>

          <h3>容量预警时序图</h3>
          <div class="capacity-warning">
            <!-- 这里放置时序图实现 -->
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.data-statistics {
  padding: 20px;
}

.health-indicators {
  margin-bottom: 20px;
}

.progress-container {
  display: flex;
  align-items: center;
}

.value {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
}

.desc {
  color: #999;
  font-size: 12px;
}

.trend {
  color: #67C23A;
}

.waste {
  color: #E6A23C;
}

.pending {
  color: #F56C6C;
}

.middle-section,
.bottom-section {
  margin-top: 20px;
}

.el-card {
  height: 100%;
}

h3 {
  margin-bottom: 15px;
}

/* 新增样式 */
.lineage-chart,
.quality-chart,
.activity-heatmap,
.resource-usage,
.permission-warning,
.data-temperature,
.failure-analysis,
.capacity-warning {
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
}
</style>