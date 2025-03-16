<template>
  <div class="log-recording">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>日志记录</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索和操作区域 -->
    <div class="search-actions">
      <el-select v-model="filter.logType" placeholder="请选择日志类型" clearable>
        <el-option
          v-for="type in logTypes"
          :key="type.value"
          :label="type.label"
          :value="type.value"
        />
      </el-select>

      <el-date-picker
        v-model="filter.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
      />

      <el-input
        v-model="filter.keyword"
        placeholder="请输入用户或接口名称"
        clearable
        style="width: 240px"
      />

      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="danger" @click="handleClear">清空日志</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="username" label="用户标识" />
      <el-table-column prop="operation" label="操作类型" />
      <el-table-column prop="target" label="操作对象" />
      <el-table-column prop="timestamp" label="操作时间" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '成功' ? 'success' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="详细信息">
        <template #default="{ row }">
          <el-button type="text" @click="handleDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px; justify-content: flex-end"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 模拟数据
const logTypes = ref([
  { value: 'user', label: '用户操作日志' },
  { value: 'system', label: '系统运行日志' },
  { value: 'data', label: '数据处理日志' },
  { value: 'api', label: '接口调用日志' }
])

const filter = ref({
  logType: '',
  dateRange: [],
  keyword: ''
})

const tableData = ref([
  {
    username: 'admin',
    operation: '编辑',
    target: 'API接口权限',
    timestamp: '2024-07-01 10:00',
    status: '成功',
    detail: '修改了接口getLoginUserCount的访问权限'
  },
  {
    username: 'user1',
    operation: '删除',
    target: '用户权限记录',
    timestamp: '2024-07-01 11:00',
    status: '失败',
    detail: '删除用户权限记录时发生错误'
  }
])

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 20
})

// 事件处理
const handleSearch = () => {
  console.log('搜索条件:', filter.value)
}

const handleClear = () => {
  console.log('清空日志')
}

const handleDetail = (row) => {
  console.log('查看详情:', row)
}
</script>

<style scoped>
.log-recording {
  padding: 20px;
  background-color: #fff;
}

.search-actions {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.el-select {
  width: 200px;
}
</style>