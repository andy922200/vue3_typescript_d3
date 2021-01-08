import {
    createRouter, createWebHistory, RouteRecordRaw
} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Index',
        component: () => import('../views/Home/Home.vue')
    },
    {
        path: '/bar-chart-view',
        name: 'BarChartView',
        component: () => import('../views/BarChartView/BarChartView.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About/About.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    linkExactActiveClass: 'active',
    routes
})

export default router
