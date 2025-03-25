<template>
  <div class="access-permissions">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item>数据服务</el-breadcrumb-item>
      <el-breadcrumb-item>访问权限管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 修改搜索区域 -->
    <div class="search-actions">
      <el-input v-model="filter.keyword" placeholder="角色名称" clearable style="width: 200px" @input="handleSearch" />

      <el-select v-model="filter.status" placeholder="角色状态" clearable @change="handleSearch">
        <el-option label="启用" value="active" />
        <el-option label="停用" value="inactive" />
      </el-select>

      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="handleAdd">新增角色</el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="filteredTableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="roleName" label="角色名称" sortable />
      <el-table-column label="权限范围">
        <template #default="{ row }">
          <el-tag v-for="permission in row.permissions" :key="permission" style="margin-right: 5px;">
            {{ permission }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="关联用户">
        <template #default="{ row }">
          <el-tag v-for="user in row.users" :key="user" type="info" style="margin-right: 5px;">
            {{ user }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="160" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button :type="row.status === 'active' ? 'warning' : 'success'" size="small"
            @click="handleToggleStatus(row)">
            {{ row.status === 'active' ? '停用' : '启用' }}
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
import { ref, onMounted } from 'vue'

// 模拟数据
// 修改模拟数据
const roleList = ref([
  {
    roleName: '管理员',
    permissions: ['用户管理', '数据访问', '接口调用'],
    users: ['用户1', '用户2'],
    status: 'active'
  },
  {
    roleName: '编辑者',
    permissions: ['数据访问', '接口调用'],
    users: ['用户3'],
    status: 'inactive'
  }
])

const filter = ref({
  roleName: '',
  status: '',
  keyword: ''
})

// 修改表格数据
const tableData = ref([
  {
    roleName: '管理员',
    permissions: ['用户管理', '数据访问', '接口调用'],
    users: ['用户1', '用户2'],
    status: 'active',
    updateTime: '2024-07-01 10:00'
  },
  {
    roleName: '编辑者',
    permissions: ['数据访问', '接口调用'],
    users: ['用户3'],
    status: 'inactive',
    updateTime: '2024-07-01 11:00'
  }
])

// 事件处理

// 新增事件处理
const handleToggleStatus = (row) => {
  row.status = row.status === 'active' ? 'inactive' : 'active'
  console.log('状态切换:', row)
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

// 新增一个响应式变量来存储筛选后的数据
const filteredTableData = ref([])

// 修改事件处理
const handleSearch = () => {
  filteredTableData.value = tableData.value.filter(role => {
    // 按角色名称筛选
    if (filter.value.keyword && !role.roleName.includes(filter.value.keyword)) {
      return false
    }
    // 按角色状态筛选
    if (filter.value.status && role.status !== filter.value.status) {
      return false
    }
    return true
  })
}

onMounted(() => {
  filteredTableData.value = [...tableData.value]
})
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