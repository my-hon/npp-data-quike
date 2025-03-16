import {
    createApp
} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
// 导入图标组件
import * as Icons from '@element-plus/icons-vue'


const app = createApp(App)
app.use(ElementPlus)
app.use(router)

// 全局注册所有图标
for (const [key, component] of Object.entries(Icons)) {
    app.component(key, component)
}

app.mount('#app')