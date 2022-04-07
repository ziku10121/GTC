import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Order from '../views/Order.vue'
import Report from '../views/Report.vue'
import loginfail from '../views/LoginFailPage.vue'
import loginpage from '../views/LoginPage.vue';
import DataLoadingPage from '../views/DataLoadingPage.vue';

const routes = [{
        path: '/',
        name: 'loginpage',
        component: loginpage,
    },
    {
        path: '/Home',
        name: 'Home',
        component: Home,
    },
    {
        path: '/Order',
        name: 'Order',
        component: Order,

    },
    {
        path: '/Report',
        name: 'Report',
        component: Report,
    },
    {
        path: '/loginfail',
        name: 'loginfail',
        component: loginfail
    },
    {
        path: '/DataLoadingPage',
        name: 'DataLoadingPage',
        component: DataLoadingPage
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router