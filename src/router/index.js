/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-30 09:55:52
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-13 09:42:59
 * @FilePath: \taskApplication\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-30 09:55:52
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-06 11:23:44
 * @FilePath: \taskApplication\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-30 09:55:52
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-08-31 16:36:54
 * @FilePath: \taskApplication\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    // 路由模式
    history: createWebHashHistory(),
    // 路由
    // todo 不同权限的时候的路由守卫
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/dashboard',
            component: () => import('../layout/index.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'apply',
                    component: () => import('../views/applyTask/ApplyTask.vue'),
                    meta: { requiresAuth: true },
                },
                {
                    path: 'approval',
                    component: () =>
                        import('../views/approvalTask/ApprovalTask.vue'),
                    meta: { authority: 'WEB_TaskApplyAudit' },
                },
                {
                    path: 'urllist',
                    component: () => import('../views/urllist/URLList.vue'),
                    meta: { authority: 'WEB_URLList' },
                },
            ],
        },
        {
            path: '/login',
            component: () => import('../views/login/Login.vue'),
        },
    ],
});

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const authorityList = JSON.parse(
        localStorage.getItem('authorityList') || '[]',
    );

    // 检查是否需要身份验证
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        // 用户未登录
        if (!token) {
            next('/login');
            return;
        }

        // 检查用户是否有访问该路由的权限
        if (to.meta.authority && !authorityList.includes(to.meta.authority)) {
            // 如果用户没有权限，导航回他们之前的页面
            next(from.path);
            return;
        }
    }

    // 允许导航
    next();
});

export default router;
