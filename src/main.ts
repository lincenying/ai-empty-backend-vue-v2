import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import elementInstall from './config/element'
import router from './router'
import './assets/scss/global/animate.min.css'
import './assets/scss/global/global.scss'
import 'virtual:uno.css'
import './assets/scss/style.scss'

const app = createApp(App)

app.use(elementInstall)
app.use(createPinia())
app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue))
    app.component(key, component)

app.mount('#app')
