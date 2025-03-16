<template>
  <div class="access-permissions">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item>数据服务</el-breadcrumb-item>
      <el-breadcrumb-item>访问权限管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索和操作区域 -->
    <div class="search-actions">
      <el-select v-model="filter.user" placeholder="请选择用户" clearable>
        <el-option
          v-for="user in userList"
          :key="user.value"
          :label="user.label"
          :value="user.value"
        />
      </el-select>

      <el-select v-model="filter.api" placeholder="请选择接口" clearable>
        <el-option
          v-for="api in apiList"
          :key="api.value"
          :label="api.label"
          :value="api.value"
        />
      </el-select>

      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="handleAdd">新增权限</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="user" label="申请用户" />
      <el-table-column prop="api" label="请求接口" />
      <el-table-column prop="publicKey" label="公钥" />
      <el-table-column prop="expireDate" label="有效期" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="warning" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 模拟数据
const userList = ref([
  { value: 'user1', label: '用户1' },
  { value: 'user2', label: '用户2' }
])

const apiList = ref([
  { value: 'getLoginUserCount', label: '获取登录用户数' },
  { value: 'getSystemCount', label: '获取系统统计' }
])

const filter = ref({
  user: '',
  api: ''
})

const tableData = ref([
  {
    user: '用户1',
    api: 'getLoginUserCount',
    publicKey: '1234567890abcdef',
    expireDate: '2024-12-31',
    status: true,
    updateTime: '2024-07-01 10:00'
  },
  {
    user: '用户2',
    api: 'getSystemCount',
    publicKey: 'abcdef1234567890',
    expireDate: '2024-12-31',
    status: false,
    updateTime: '2024-07-01 11:00'
  }
])

// 事件处理
const handleSearch = () => {
  console.log('搜索条件:', filter.value)
}

const handleAdd = () => {
  console.log('新增权限')
}

const handleStatusChange = (row) => {
  console.log('状态变更:', row)
}

const handleEdit = (row) => {
  console.log('编辑:', row)
}

const handleDelete = (row) => {
  console.log('删除:', row)
}
</script>

<style scoped>
.access-permissions {
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