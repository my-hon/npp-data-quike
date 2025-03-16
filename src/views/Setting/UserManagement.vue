<template>
  <div class="user-management">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索和操作区域 -->
    <div class="search-actions">
      <el-select v-model="filter.userType" placeholder="请选择用户类型" clearable>
        <el-option
          v-for="type in userTypes"
          :key="type.value"
          :label="type.label"
          :value="type.value"
        />
      </el-select>

      <el-input
        v-model="filter.keyword"
        placeholder="请输入用户名或邮箱"
        clearable
        style="width: 240px"
      />

      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="handleAdd">新增用户</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column label="功能权限">
        <template #default="{ row }">
          <el-tag
            v-for="permission in row.permissions"
            :key="permission"
            type="info"
            size="small"
            style="margin-right: 4px"
          >
            {{ permission }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="expireDate" label="有效期" />
      <el-table-column label="操作" width="150">
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
const userTypes = ref([
  { value: 'admin', label: '管理员' },
  { value: 'user', label: '普通用户' }
])

const filter = ref({
  userType: '',
  keyword: ''
})

const tableData = ref([
  {
    username: 'admin',
    name: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    permissions: ['数据查看', '数据修改', '数据删除'],
    status: true,
    expireDate: '2024-12-31'
  },
  {
    username: 'user1',
    name: '张三',
    email: 'user1@example.com',
    phone: '13800138001',
    permissions: ['数据查看'],
    status: false,
    expireDate: '2024-12-31'
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

const handleAdd = () => {
  console.log('新增用户')
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
.user-management {
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