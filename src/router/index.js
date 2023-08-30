import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    // 路由模式
    history: createWebHashHistory(),
    // 路由
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/login',
            component: () => import('../views/login/index.vue'),
        },
        {
            path: '/home',
            component: () => import('@/views/home/index.vue'),
        },
    ],
});

export default router;
