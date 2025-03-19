<template>
    <div class="data-analyse-container">
        <!-- 切换按钮 -->
        <el-button-group class="switch-buttons">
            <el-button type="primary" :class="{ active: activeTab === 'sql' }" @click="activeTab = 'sql'">
                SQL查询
            </el-button>
            <el-button type="primary" :class="{ active: activeTab === 'analyze' }" @click="activeTab = 'analyze'">
                分析
            </el-button>
        </el-button-group>
        <!-- SQL查询布局 -->
        <div v-if="activeTab === 'sql'" class="sql-layout">
            <!-- 左侧文件区 -->
            <div class="file-section">
                <div class="search-area">
                    <el-input v-model="searchQuery" placeholder="输入关键字搜索SQL文件" clearable />
                    <el-button type="primary" @click="searchFiles">查询</el-button>
                </div>
                <div class="file-list">
                    <div v-if="filteredFiles.length === 0" class="empty-tip">
                        暂无文件
                    </div>
                    <div v-else>
                        <div v-for="file in filteredFiles" :key="file.name" class="file-item"
                            :class="{ active: activeFile === file.name }" @click="loadFile(file)">
                            {{ file.name }}
                            <span class="delete-btn" @click.stop="deleteFile(file.name)">×</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧编辑区 -->
            <div class="editor-section">
                <div class="toolbar">
                    <el-button type="primary" @click="newFile">新建</el-button>
                    <el-button type="primary" @click="formatSQL">格式化SQL</el-button>
                    <el-button type="primary" @click="validateSQL">验证SQL</el-button>
                    <el-button type="primary" @click="saveFile">保存</el-button>
                </div>
                <el-input v-model="currentSQL" type="textarea" :rows="20" placeholder="在此编写SQL语句" class="code-editor" />
            </div>
        </div>

        <!-- 分析布局 -->
        <div v-if="activeTab === 'analyze'" class="analyze-layout">
            <div class="analyze-toolbar">
                <el-button type="primary" @click="calculateXXX1">计算XXX1</el-button>
                <el-button type="primary" @click="calculateXXX2">计算XXX2</el-button>
                <el-button type="primary" @click="calculateXXX3">计算XXX3</el-button>
            </div>
            <div class="analyze-content">
                <div v-if="analyzeResult">
                    {{ analyzeResult }}
                </div>
                <div v-else class="analyze-placeholder">
                    请点击上方按钮进行计算
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// import sqlFormatter from 'sql-formatter'
import { format } from 'sql-formatter' // 修改引入方式
import { ElMessage } from 'element-plus' // 添加消息提示组件

// 状态管理
const activeTab = ref('sql')
const searchQuery = ref('')
const currentSQL = ref('')
const activeFile = ref('')
const analyzeResult = ref('')
const files = ref([
    { name: 'query1.sql', content: 'SELECT * FROM table1' },
    { name: 'query2.sql', content: 'SELECT * FROM table2' }
])

// 过滤文件列表
const filteredFiles = computed(() => {
    return files.value.filter(file =>
        file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

// 删除文件
const deleteFile = (fileName) => {
    files.value = files.value.filter(file => file.name !== fileName)
    if (activeFile.value === fileName) {
        currentSQL.value = ''
        activeFile.value = ''
    }
    ElMessage.success('文件删除成功')
}

// 新建文件
const newFile = () => {
    currentSQL.value = ''
    activeFile.value = ''
}

// 加载文件
const loadFile = (file) => {
    currentSQL.value = file.content
    activeFile.value = file.name
}

// 保存文件
const saveFile = () => {
    const fileName = prompt('请输入文件名')
    if (fileName) {
        const fullName = fileName.endsWith('.sql') ? fileName : `${fileName}.sql`
        files.value.push({
            name: fullName,
            content: currentSQL.value
        })
        activeFile.value = fullName
    }
}

// 格式化SQL
const formatSQL = () => {
    // try {
    //     currentSQL.value = sqlFormatter.format(currentSQL.value, {
    //         language: 'sql', // 默认使用标准SQL
    //         indent: '  ',    // 使用2个空格缩进
    //         uppercase: true, // 将关键字转为大写
    //     })
    // } catch (error) {
    //     console.error('SQL格式化失败:', error)
    //     ElMessage.error('SQL格式化失败，请检查SQL语法')
    // }
    try {
        currentSQL.value = format(currentSQL.value, {
            language: 'sql', // 默认使用标准SQL
            indent: '  ',    // 使用2个空格缩进
            uppercase: true, // 将关键字转为大写
        })
    } catch (error) {
        console.error('SQL格式化失败:', error)
        ElMessage.error('SQL格式化失败，请检查SQL语法')
    }
}

// 验证SQL
const validateSQL = () => {
    // 这里可以添加SQL验证逻辑
    console.log('验证SQL')
}

// 分析功能
const calculateXXX1 = () => {
    analyzeResult.value = 'XXX1计算结果'
}

const calculateXXX2 = () => {
    analyzeResult.value = 'XXX2计算结果'
}

const calculateXXX3 = () => {
    analyzeResult.value = 'XXX3计算结果'
}
</script>

<style scoped>
.data-analyse-container {
    padding: 20px;
    height: 100%;
    background-color: #f8f9fa;
}

.switch-buttons {
    margin-bottom: 20px;
    background-color: transparent;
    box-shadow: none;
}

.switch-buttons .el-button {
    margin-right: 0;
    border-radius: 0;
    background-color: #e9ecef;
    color: #495057;
    border: 1px solid #dee2e6;
}

.switch-buttons .el-button.active {
    background-color: #409eff;
    color: white;
    border-color: #409eff;
}

.switch-buttons .el-button:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
}

.switch-buttons .el-button:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
}

.delete-btn {
    cursor: pointer;
    color: #999;
    font-size: 18px;
    padding: 0 4px;
    transition: all 0.2s ease;
}

.delete-btn:hover {
    color: #ff4d4f;
    transform: scale(1.2);
}

.file-section {
    width: 300px;
    border-right: 1px solid #e9ecef;
    padding-right: 20px;
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.code-editor {
    font-family: Consolas, monospace;
    font-size: 14px;
    height: calc(100% - 50px);
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #e9ecef;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    cursor: pointer;
    border-radius: 6px;
    margin-bottom: 5px;
    transition: all 0.2s ease;
}

.file-name {
    flex: 1;
    margin-right: 10px;
}

.file-item:hover {
    background-color: #f8f9fa;
}

.file-item.active {
    background-color: #409eff;
    color: white;
}

.analyze-content {
    padding: 20px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    height: calc(100% - 80px);
    background-color: white;
}

.search-area {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.code-editor {
    font-family: Consolas, monospace;
    font-size: 14px;
    height: calc(100% - 50px);
    background-color: #fafafa;
    border-radius: 4px;
    padding: 10px;
}

.sql-layout {
    display: flex;
    gap: 20px;
    height: calc(100vh - 100px);
}

.file-section {
    width: 300px;
    border-right: 1px solid #ebeef5;
    padding-right: 20px;
}

.search-area {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.file-list {
    height: calc(100% - 60px);
    overflow-y: auto;
}

.file-item {
    padding: 8px;
    cursor: pointer;
    border-radius: 4px;
    margin-bottom: 5px;
}

.file-item:hover {
    background-color: #f5f7fa;
}

.file-item.active {
    background-color: #409eff;
    color: white;
}

.editor-section {
    flex: 1;
}

.toolbar {
    margin-bottom: 10px;
}

.code-editor {
    font-family: Consolas, monospace;
    font-size: 14px;
    height: calc(100% - 50px);
}

.analyze-layout {
    height: calc(100vh - 100px);
}

.analyze-toolbar {
    margin-bottom: 20px;
}

.analyze-content {
    padding: 20px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    height: calc(100% - 80px);
}

.analyze-placeholder {
    color: #999;
    text-align: center;
    margin-top: 20px;
}
</style>