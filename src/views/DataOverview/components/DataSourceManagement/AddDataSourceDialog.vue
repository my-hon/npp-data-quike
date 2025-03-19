<template>
    <el-dialog v-model="visible" title="添加数据源" width="600px" :before-close="handleClose">
        <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入数据源名称" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择数据源类型">
                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="驱动" prop="driver">
                <el-input v-model="form.driver" placeholder="请输入数据库驱动" />
            </el-form-item>
            <el-form-item label="连接信息" prop="connection">
                <el-input v-model="form.connection" placeholder="请输入连接信息" />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="testConnection" type="primary" :loading="testing">
                连接测试
            </el-button>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="submitting">
                确定
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const visible = ref(false)
const testing = ref(false)
const submitting = ref(false)
const formRef = ref(null)

const form = reactive({
    name: '',
    type: '',
    driver: '',
    connection: '',
    username: '',
    password: '',
    remark: ''
})

const typeOptions = [
    { value: 'mysql', label: 'MySQL' },
    { value: 'oracle', label: 'Oracle' },
    { value: 'sqlserver', label: 'SQL Server' },
    { value: 'postgresql', label: 'PostgreSQL' }
]

const rules = {
    name: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择数据源类型', trigger: 'change' }],
    connection: [
        { required: true, message: '请输入连接信息', trigger: 'blur' }
    ],
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
}

const open = () => {
    visible.value = true
}

const handleClose = () => {
    formRef.value?.resetFields()
    visible.value = false
}

const testConnection = async () => {
    try {
        testing.value = true
        // 这里添加连接测试逻辑
        ElMessage.success('连接测试成功')
    } catch (error) {
        ElMessage.error('连接测试失败')
    } finally {
        testing.value = false
    }
}

const handleSubmit = async () => {
    try {
        await formRef.value.validate()
        submitting.value = true
        // 这里添加提交逻辑
        ElMessage.success('添加成功')
        handleClose()
    } catch (error) {
        console.error('提交失败', error)
    } finally {
        submitting.value = false
    }
}

defineExpose({
    open
})
</script>

<style scoped>
.el-form-item {
    margin-bottom: 20px;
}
</style>