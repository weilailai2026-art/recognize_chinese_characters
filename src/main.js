import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initAuth } from './utils/auth'

const app = createApp(App)
app.use(router)

// 初始化认证状态后再挂载
initAuth().then(() => {
  app.mount('#app')
})
