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
      <el-select v-model="filter.userType" placeholder="用户角色" clearable @change="handleSearch">
        <el-option v-for="type in userTypes" :key="type.value" :label="type.label" :value="type.value" />
      </el-select>

      <el-select v-model="filter.status" placeholder="用户状态" clearable @change="handleSearch">
        <el-option label="活跃" value="active" />
        <el-option label="禁用" value="inactive" />
      </el-select>

      <el-input v-model="filter.keyword" placeholder="用户名/姓名/邮箱" clearable @input="handleSearch" style="width: 240px" />

      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="handleAdd">新增用户</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="filteredTableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="username" label="用户名" sortable />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="role" label="角色" width="120">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : row.role === 'editor' ? 'warning' : 'info'">
            {{ row.role === 'admin' ? '管理员' : row.role === 'editor' ? '编辑者' : '访客' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '活跃' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastLogin" label="最后登录时间" width="160" sortable />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button :type="row.status === 'active' ? 'warning' : 'success'" size="small"
            @click="handleToggleStatus(row)">
            {{ row.status === 'active' ? '禁用' : '启用' }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
      :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px; justify-content: flex-end" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 模拟数据
const userTypes = ref([
  { value: 'admin', label: '管理员' },
  { value: 'editor', label: '编辑者' },
  { value: 'viewer', label: '访客' }
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
    role: 'admin',
    permissions: ['数据查看', '数据修改', '数据删除'],
    status: 'active',
    lastLogin: '2023-10-01 14:30:22',
    expireDate: '2024-12-31'
  },
  {
    username: 'editor1',
    name: '张三',
    email: 'user1@example.com',
    phone: '13800138001',
    role: 'editor',
    permissions: ['数据查看', '数据修改'],
    status: 'inactive',
    lastLogin: '2023-09-30 18:15:10',
    expireDate: '2024-12-31'
  }
])

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 20
})

// 新增一个响应式变量来存储筛选后的数据
const filteredTableData = ref([])

// 事件处理
const handleSearch = () => {
  const filteredData = tableData.value.filter(user => {
    // 按用户角色筛选
    if (filter.value.userType && user.role !== filter.value.userType) {
      return false
    }
    // 按用户状态筛选
    if (filter.value.status && user.status !== filter.value.status) {
      return false
    }
    // 按关键字筛选
    if (filter.value.keyword) {
      const keyword = filter.value.keyword.toLowerCase()
      return (
        user.username.toLowerCase().includes(keyword) ||
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      )
    }
    return true
  })

  // 更新筛选后的数据和分页信息
  filteredTableData.value = filteredData
  pagination.value.total = filteredData.length
}

const handleAdd = () => {
  console.log('新增用户')
}

const handleToggleStatus = (row) => {
  row.status = row.status === 'active' ? 'inactive' : 'active'
  console.log('状态切换:', row)
}

const handleEdit = (row) => {
  console.log('编辑:', row)
}

const handleDelete = (row) => {
  console.log('删除:', row)
}

onMounted(() => {
  filteredTableData.value = [...tableData.value]
})
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