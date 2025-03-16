<template>
    <div class="login-container">
        <div class="login-box">
            <!-- 添加logo区域 -->
            <div class="logo-area">
                <img src="../../../src/assets/logo.png" alt="系统logo" class="logo">
                <h2>NPP 数据管理系统</h2>
            </div>

            <el-form :model="form" @submit.prevent="handleLogin">
                <!-- 调整表单标签样式 -->
                <el-form-item label="用户名" class="form-item">
                    <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User" size="large"
                        @focus="focusAnimation" />
                </el-form-item>

                <el-form-item label="密码" class="form-item">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock"
                        show-password size="large" @focus="focusAnimation" />
                </el-form-item>

                <!-- 美化登录按钮 -->
                <el-button type="primary" native-type="submit" class="login-btn" :loading="loading">
                    <span class="btn-text">登 录</span>
                </el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

export default {
    setup() {
        const router = useRouter()
        const form = reactive({
            username: '',
            password: ''
        })

        const handleLogin = async () => {
            try {
                // 测试账号：admin/admin
                if (form.username === 'admin' && form.password === 'admin') {
                    localStorage.setItem('token', 'mock-token')
                    localStorage.setItem('username', form.username)
                    ElMessage({
                        message: '登录成功',
                        type: 'success',
                        showClose: true,
                        center: true,
                        offset: 80
                    })
                    router.push('/home/overview')
                } else {
                    ElMessage({
                        message: '用户名或密码错误',
                        type: 'error',
                        showClose: true,
                        center: true,
                        offset: 80
                    })
                }
            } catch (error) {
                ElMessage({
                    message: '登录失败，请重试',
                    type: 'error',
                    showClose: true,
                    center: true,
                    offset: 80
                })
            }
        }

        return {
            form,
            handleLogin,
            // 暴露图标到模板
            User,
            Lock
        }
    }
}
</script>

<style scoped>
.login-container {

    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #409EFF 0%, #3375ca 100%);
    position: relative;
    overflow: hidden;
}

.login-box {
    width: 100%;
    max-width: 480px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transform: translateY(0);
    transition: transform 0.3s ease;
    position: relative;
    z-index: 1;
}

.logo-area {
    text-align: center;
    margin-bottom: 40px;
}

.logo {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

h2 {
    font-size: 24px;
    color: #303133;
    letter-spacing: 1px;
    margin: 0;
}

.form-item {
    margin-bottom: 28px;
}

:deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266 !important;
    font-size: 14px;
    margin-bottom: 8px;
    display: block;
}

:deep(.el-input__wrapper) {
    border-radius: 8px;
    padding: 12px 16px;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
}

.login-btn {
    width: 100%;
    height: 48px;
    border-radius: 8px;
    font-size: 16px;
    letter-spacing: 2px;
    background: linear-gradient(135deg, #409EFF 0%, #3375ca 100%);
    border: none;
    transition: all 0.3s ease;
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.btn-text {
    font-weight: 500;
}

/* 添加背景装饰元素 */
.login-container::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    top: -20%;
    left: -10%;
}

.login-container::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 30% 70% 67% 33% / 30% 30% 70% 70%;
    bottom: -10%;
    right: -5%;
}

/* 添加消息提示定位修正 */
:deep(.el-message) {
    top: 80px !important;
    bottom: auto !important;
}
</style>
