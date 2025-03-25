<template>
  <div class="hdfs-history-container">
    <!-- 筛选区 -->
    <div class="filter-section">
      <el-form :inline="true" class="filter-form">
        <el-form-item label="时间范围">
          <el-date-picker v-model="filter.timeRange" type="datetimerange" range-separator="至" start-placeholder="开始时间"
            end-placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="filter.path" placeholder="输入路径" clearable />
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="filter.user" placeholder="输入用户" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作记录列表 -->
    <div class="history-list">
      <el-table :data="filteredRecords" style="width: 100%" stripe border @sort-change="handleSortChange">
        <el-table-column prop="fileName" label="文件名" sortable min-width="120" />
        <el-table-column prop="fullPath" label="全路径" sortable min-width="200">
          <template #default="{ row }">
            <el-tooltip :content="row.fullPath" placement="top">
              <span>{{ row.fullPath | truncatePath }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="operationType" label="操作类型" sortable min-width="100" />
        <el-table-column prop="user" label="操作用户" sortable min-width="100" />
        <el-table-column prop="clientIP" label="客户端IP" sortable min-width="120" />
        <el-table-column prop="timestamp" label="时间戳" sortable min-width="160" />
        <el-table-column prop="sizeChange" label="文件大小变化" sortable min-width="120" />
        <el-table-column prop="complianceTag" label="合规标签" sortable min-width="120" />
        <el-table-column label="操作详情" min-width="100">
          <template #default="{ row }">
            <el-button type="text" @click="showDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 统计面板 -->
    <div class="stats-panel">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="chart-container">
            <h4>24小时操作热力图</h4>
            <div ref="heatmapChart" style="height: 300px;"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="warning-container">
            <h4>高危操作预警</h4>
            <el-table :data="highRiskOperations" style="width: 100%">
              <el-table-column prop="type" label="操作类型" />
              <el-table-column prop="count" label="发生次数" />
              <el-table-column prop="lastTime" label="最近发生时间" />
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="操作详情" width="50%">
      <div v-if="currentDetail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="文件名">{{ currentDetail.fileName }}</el-descriptions-item>
          <el-descriptions-item label="全路径">{{ currentDetail.fullPath }}</el-descriptions-item>
          <el-descriptions-item label="元数据变更">
            <pre>{{ currentDetail.metadataChanges }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'

// 数据状态
const filter = ref({
  timeRange: [],
  path: '',
  user: ''
})
const records = ref([])
const currentDetail = ref(null)
const detailVisible = ref(false)

// 模拟数据
const mockData = [
  {
    fileName: 'sensitive_data.csv',
    fullPath: '/data/sensitive/sensitive_data.csv',
    operationType: 'DELETE',
    user: 'admin',
    clientIP: '192.168.1.101',
    timestamp: '2023-10-01 14:30:00',
    sizeChange: '-1.2MB',
    complianceTag: '高风险',
    metadataChanges: JSON.stringify({
      permissions: 'rw-r--r-- -> rw-rw-rw-',
      owner: 'admin -> root'
    }, null, 2)
  },
  {
    fileName: 'backup.tar.gz',
    fullPath: '/backups/daily/backup.tar.gz',
    operationType: 'MOVE',
    user: 'backup_user',
    clientIP: '192.168.1.102',
    timestamp: '2023-10-02 09:15:00',
    sizeChange: '0B',
    complianceTag: '中风险',
    metadataChanges: JSON.stringify({
      permissions: 'rw-r--r-- -> rw-rw-rw-',
      owner: 'backup_user -> root'
    }, null, 2)
  },
  {
    fileName: 'logfile.log',
    fullPath: '/var/log/app/logfile.log',
    operationType: 'MODIFY',
    user: 'app_user',
    clientIP: '192.168.1.103',
    timestamp: '2023-10-03 16:45:00',
    sizeChange: '+500KB',
    complianceTag: '低风险',
    metadataChanges: JSON.stringify({
      permissions: 'rw-r--r-- -> rw-rw-rw-',
      owner: 'app_user -> root'
    }, null, 2)
  },
  {
    fileName: 'config.yaml',
    fullPath: '/etc/app/config.yaml',
    operationType: 'COPY',
    user: 'sysadmin',
    clientIP: '192.168.1.104',
    timestamp: '2023-10-04 11:00:00',
    sizeChange: '+10KB',
    complianceTag: '高风险',
    metadataChanges: JSON.stringify({
      permissions: 'rw-r--r-- -> rw-rw-rw-',
      owner: 'sysadmin -> root'
    }, null, 2)
  },
  {
    fileName: 'temp_file.tmp',
    fullPath: '/tmp/temp_file.tmp',
    operationType: 'CREATE',
    user: 'temp_user',
    clientIP: '192.168.1.105',
    timestamp: '2023-10-05 08:30:00',
    sizeChange: '+1MB',
    complianceTag: '中风险',
    metadataChanges: JSON.stringify({
      permissions: 'rw-r--r-- -> rw-rw-rw-',
      owner: 'temp_user -> root'
    }, null, 2)
  },
  {
    fileName: 'audit.log',
    fullPath: '/var/log/audit/audit.log',
    operationType: 'MODIFY',
    user: 'audit_user',
    clientIP: '192.168.1.106',
    timestamp: '2023-10-06 10:45:00',
    sizeChange: '+200KB',
    complianceTag: '低风险',
    metadataChanges: JSON.stringify({
      permissions: 'rw-r--r-- -> rw-rw-rw-',
      owner: 'audit_user -> root'
    }, null, 2)
  },
  {
    fileName: 'database.sql',
    fullPath: '/data/db/database.sql',
    operationType: 'DELETE',
    user: 'db_admin',
    clientIP: '192.168.1.107',
    timestamp: '2023-10-07 13:20:00',
    sizeChange: '-500MB',
    complianceTag: '高风险',
    metadataChanges: JSON.stringify({
      permissions: 'rw-r--r-- -> rw-rw-rw-',
      owner: 'db_admin -> root'
    }, null, 2)
  }
]

// 新增高危操作预警数据
const highRiskOperations = ref([
  {
    type: 'DELETE',
    count: 12,
    lastTime: '2023-10-05 14:30:00'
  },
  {
    type: 'MOVE',
    count: 8,
    lastTime: '2023-10-04 09:15:00'
  },
  {
    type: 'MODIFY',
    count: 15,
    lastTime: '2023-10-03 16:45:00'
  },
  {
    type: 'COPY',
    count: 5,
    lastTime: '2023-10-02 11:00:00'
  }
])

// 修改 onMounted
onMounted(() => {
  records.value = mockData
  // 初始化热力图
  const chart = echarts.init(heatmapChart.value)
  const option = {
    title: {
      text: '24小时操作热力图',
      left: 'center'
    },
    tooltip: {
      position: 'top'
    },
    grid: {
      height: '80%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%'
    },
    series: [
      {
        name: '操作次数',
        type: 'heatmap',
        data: Array.from({ length: 7 * 24 }, () => [
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 7),
          Math.floor(Math.random() * 10)
        ]),
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  chart.setOption(option)
})

// 计算属性
const filteredRecords = computed(() => {
  const filtered = records.value.filter(record => {
    const timeCondition = !filter.value.timeRange || (
      new Date(record.timestamp) >= filter.value.timeRange[0] &&
      new Date(record.timestamp) <= filter.value.timeRange[1]
    )
    const pathCondition = !filter.value.path ||
      record.fullPath.includes(filter.value.path)
    const userCondition = !filter.value.user ||
      record.user.includes(filter.value.user)
    return timeCondition && pathCondition && userCondition
  })
  console.log('filteredRecords:', filtered) // 添加日志验证过滤结果
  return filtered
})

// 方法
const handleSearch = () => {
  // 实现搜索逻辑
}

const resetFilter = () => {
  filter.value = {
    timeRange: [],
    path: '',
    user: ''
  }
}

const showDetail = (record) => {
  currentDetail.value = record
  detailVisible.value = true
}

// 初始化图表
const heatmapChart = ref(null)
</script>

<style scoped>
.hdfs-history-container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.history-list {
  margin-bottom: 30px;
}

.stats-panel {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.chart-container,
.warning-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>