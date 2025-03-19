<script setup>
import { ref, computed } from 'vue'

// 模拟Hadoop文件数据
const hadoopFiles = ref([
    { id: 1, name: 'file1.txt', size: '128MB', modified: '2023-10-01' },
    { id: 2, name: 'file2.log', size: '256MB', modified: '2023-10-02' },
    { id: 3, name: 'file3.csv', size: '512MB', modified: '2023-10-03' }
])

// 搜索功能
const searchQuery = ref('')
const filteredFiles = computed(() => {
    return hadoopFiles.value.filter(file =>
        file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

// 上传功能
const uploadDialogVisible = ref(false)
const handleUpload = () => {
    uploadDialogVisible.value = true
}

// 下载功能
const handleDownload = (file) => {
    console.log('Downloading:', file.name)
}

// 修改功能
const editDialogVisible = ref(false)
const currentFile = ref(null)
const handleEdit = (file) => {
    currentFile.value = file
    editDialogVisible.value = true
}
</script>

<template>
    <div class="upload-download-container">
        <!-- 操作栏 -->
        <div class="action-bar">
            <el-input v-model="searchQuery" placeholder="搜索文件" clearable style="width: 300px; margin-right: 16px;" />
            <el-button type="primary" @click="handleUpload">上传</el-button>
            <el-button type="success">下载</el-button>
        </div>

        <!-- 文件列表 -->
        <el-card class="mt-4">
            <el-table :data="filteredFiles" empty-text="暂无数据">
                <el-table-column prop="name" label="文件名" />
                <el-table-column prop="size" label="大小" width="120" />
                <el-table-column prop="modified" label="修改时间" width="150" />
                <el-table-column label="操作" width="120">
                    <template #default="{ row }">
                        <el-button type="text" @click="handleEdit(row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 上传弹窗 -->
        <el-dialog v-model="uploadDialogVisible" title="上传文件">
            <el-form>
                <el-form-item label="选择文件">
                    <el-upload action="https://jsonplaceholder.typicode.com/posts/">
                        <el-button type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="uploadDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="uploadDialogVisible = false">确认</el-button>
            </template>
        </el-dialog>

        <!-- 修改弹窗 -->
        <el-dialog v-model="editDialogVisible" title="修改文件">
            <el-form :model="currentFile">
                <el-form-item label="文件名">
                    <el-input v-model="currentFile.name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editDialogVisible = false">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.upload-download-container {
    padding: 20px;
}

.action-bar {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.mt-4 {
    margin-top: 16px;
}
</style>