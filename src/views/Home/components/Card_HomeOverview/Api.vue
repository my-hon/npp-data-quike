<template>
    <!-- API接口卡片 -->
    <el-col :span="6">
        <el-card>
            <div class="stat-card">
                <el-icon class="custom-icon" style="color: #F56C6C;">
                    <Link />
                </el-icon>
                <div class="stat-content">
                    <div class="stat-title">API接口数量</div>
                    <div class="stat-numbers">
                        <span class="internal">内部 {{ stats.apis.internal }}</span> /
                        <span class="external">外部 {{ stats.apis.external }}</span>
                    </div>
                </div>
            </div>
        </el-card>
    </el-col>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
const stats = ref({
    dataSources: { connected: 12, offline: 3 },
    integrationTasks: { running: 5, stopped: 2 },
    devTasks: { running: 8, stopped: 1 },
    apis: { internal: 15, external: 7 }
})
</script>

<style scoped></style>
