<template>
    <!-- 数据源卡片 -->
    <el-col :span="6">
        <el-card>
            <div class="stat-card">
                <el-icon class="custom-icon" style="color: #409EFF;">
                    <DataBoard />
                </el-icon>
                <div class="stat-content">
                    <div class="stat-title">数据源</div>
                    <div class="stat-numbers">
                        <span class="connected">连通 {{ stats.dataSources.connected }}</span> /
                        <span class="offline">离线 {{ stats.dataSources.offline }}</span>
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
