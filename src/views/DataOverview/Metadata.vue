<script setup>
import { ref } from 'vue'

// 模拟MySQL元数据
const mysqlMetadata = ref([
    { field: 'id', type: 'INT', nullable: 'NO', key: 'PRI', default: null, extra: 'auto_increment' },
    { field: 'name', type: 'VARCHAR(255)', nullable: 'NO', key: '', default: null, extra: '' },
    { field: 'created_at', type: 'TIMESTAMP', nullable: 'NO', key: '', default: 'CURRENT_TIMESTAMP', extra: '' }
])

// 模拟Have列表数据
const haveList = ref([
    { id: 1, name: 'Table1', status: 'Active' },
    { id: 2, name: 'Table2', status: 'Inactive' },
    { id: 3, name: 'Table3', status: 'Active' }
])
</script>

<template>
    <div class="metadata-container">
        <!-- MySQL元数据表格 -->
        <div class="section-header">MySQL Metadata</div>
        <el-card class="mb-4">
            <el-table :data="mysqlMetadata" style="width: 100%" empty-text="暂无数据">
                <el-table-column prop="field" label="Field" />
                <el-table-column prop="type" label="Type" />
                <el-table-column prop="nullable" label="Nullable" />
                <el-table-column prop="key" label="Key" />
                <el-table-column prop="default" label="Default" />
                <el-table-column prop="extra" label="Extra" />
            </el-table>
        </el-card>

        <!-- Have列表 -->
        <div class="section-header">Have List</div>
        <el-card>
            <el-table :data="haveList" style="width: 100%" empty-text="暂无数据">
                <el-table-column prop="id" label="ID" width="100" />
                <el-table-column prop="name" label="Name" />
                <el-table-column prop="status" label="Status">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'Active' ? 'success' : 'danger'">
                            {{ row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<style scoped>
.metadata-container {
    padding: 20px;
}

.section-header {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
}

.mb-4 {
    margin-bottom: 16px;
}
</style>
