<template>
    <!-- 开发任务卡片 -->
    <el-col :span="6">
        <el-card>
            <div class="stat-card">
                <el-icon class="custom-icon" style="color: #E6A23C;">
                    <Setting />
                </el-icon>
                <div class="stat-content">
                    <div class="stat-title">任务类型</div>
                    <div class="stat-numbers">
                        <span class="completed">已完成 {{ stats.taskType.completed }}</span> /
                        <span class="running">执行中 {{ stats.taskType.running }}</span> /
                        <span class="false">失败 {{ stats.taskType.false }}</span>
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
    apis: { internal: 15, external: 7 },
    taskType: { completed: 10, running: 8, false: 1 },
})
</script>

<style scoped></style>
