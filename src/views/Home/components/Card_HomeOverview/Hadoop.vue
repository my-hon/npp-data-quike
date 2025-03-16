<template>
    <!-- Hadoop存活卡片 -->
    <el-col :span="6">
        <el-card>
            <div class="stat-card">
                <el-icon class="custom-icon" style="color: #67C23A;">
                    <Connection />
                </el-icon>
                <div class="stat-content">
                    <div class="stat-title">Hadoop存活</div>
                    <div class="stat-numbers">
                        <span class="running">执行中 {{ stats.integrationTasks.running }}</span> /
                        <span class="stopped">已停止 {{ stats.integrationTasks.stopped }}</span>
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
