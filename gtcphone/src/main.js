import { createApp, VueElement } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//安裝的套件
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.esm'
import 'bootstrap-icons/font/bootstrap-icons.css'
//css
import './ColorStyle/css/SGTP.css'

const app = createApp(App);
app.use(store).use(router).mount('#app');
// 此專案使用的Node JS 版本:v14.17.1