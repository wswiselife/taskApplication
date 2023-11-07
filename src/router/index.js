import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    // 路由模式
    history: createWebHashHistory(),
    // 路由
    // todo 不同权限的时候的路由守卫
    routes: [
        {
            path: '/',
            // redirect: '/dashboard/apply',
            // redirect: '/login',
        },
        {
            path: '/dashboard',
            component: () => import('../layout/index.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'apply',
                    component: () => import('../views/applyTask/ApplyTask.vue'),
                    // 这里检查是否需要 authority: 'WEB_TaskApply' 权限，这里是需要的，如果没有则不允许登录
                    meta: {
                        requiresAuth: true,
                        // 这里有处理，没有权限的时候可以进入，但是不可以操作
                        // authority: 'WEB_TaskApply',
                    },
                },
                {
                    path: 'approval',
                    component: () =>
                        import('../views/approvalTask/ApprovalTask.vue'),
                    meta: {
                        requiresAuth: true,
                        authority: 'WEB_TaskApplyAudit',
                    },
                },
                {
                    path: 'urllist',
                    component: () => import('../views/urllist/URLList.vue'),
                    meta: {
                        requiresAuth: true,
                        authority: 'WEB_URLList',
                    },
                },
            ],
        },
        {
            path: '/login',
            component: () => import('../views/login/Login.vue'),
        },
        {
            path: '/mobileexplore',
            component: () => import('../views/mobileExplore/MobileExplore.vue'),
            meta: { requiresAuth: true, isShowNav: false },
        },
        {
            path: '/nopermission',
            component: () => import('../views/no-permission/NoPermission.vue'),
        },
    ],
});

router.beforeEach((to, from, next) => {
    // 获取token,判断是否已经登录
    const token = localStorage.getItem('token');
    // 获取用户权限列表
    const authorityList = JSON.parse(
        localStorage.getItem('authorityList') || '[]',
    );
    // 假设你有一个函数来检查用户是否有管理员权限
    const hasAdminAuthority = authorityList.includes('WEB_TaskApplyAudit');
    // 从URL中获取taskId
    const taskId = to.query.taskId;

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (to.meta.authority && !authorityList.includes(to.meta.authority)) {
            // 如果用户没有权限，导航回他们之前的页面
            router.replace(from.path);
            return;
        }
    }

    // 根据已有信息进行重定向
    if (to.path === '/') {
        if (!token) {
            // 用户未登录
            if (taskId) {
                // 如果有taskId，重定向到登录页面，并附带taskId和原始路径
                next({
                    path: '/login',
                    query: { taskId: taskId },
                });
            } else {
                // 如果没有taskId，直接重定向到登录页面，正常用户登录
                next('/login');
            }
        } else if (token && !taskId) {
            // 用户已登录，但没有提供taskId，就是平常的登录行为，重定向到默认页面，结合登录逻辑，跳转
            // 检查用户是否有访问该路由的权限，防止直接修改路由实现跳转
            if (hasAdminAuthority) {
                next('/dashboard/approval');
            } else {
                next('/dashboard/apply');
            }
            // next();
        } else if (token && taskId) {
            // 用户已登录并提供了taskId
            if (hasAdminAuthority) {
                // 用户有管理员权限，重定向到审批页面，并带上taskId
                next({
                    path: '/dashboard/approval',
                    query: { taskId: taskId },
                });
            } else {
                // 用户没有管理员权限，重定向到无权限页面
                next('/nopermission');
            }
        }
    } else {
        // 对于非根路径，保持默认行为
        next();
    }
});
// 路由守卫
// router.beforeEach((to, from, next) => {
//     // 获取token,判断是否已经登录
//     const token = localStorage.getItem('token');
//     // 获取权限
//     const authorityList = JSON.parse(
//         localStorage.getItem('authorityList') || '[]',
//     );

//     // 1.0 是否已经登录
//     if (!token) {
//         // 1.1 单独审批时，没登陆也要携带对应的taskid
//         if (to.query.taskId) {
//             // 将taskId保存在路由中，并重定向到登录页面
//             next({ path: '/login', query: { taskId: to.query.taskId } });
//         } else {
//             next('/login');
//         }
//     } else {
//         // 2.0 已经登录的情况
//         // 2.1 如果存在taskid，即是如果是没登录的单独审批
//         if (to.query.taskId) {
//             console.log('判断存在taskid');
//             // 3.0如果有审批的权限，直接跳转审批页面
//             if (authorityList.includes('WEB_TaskApplyAudit')) {
//                 // 4.0 跳转到审批页面，路由中存在taskId参数
//                 next({
//                     path: '/dashboard/approval',
//                     query: { taskId: to.query.taskId },
//                 });
//             } else {
//                 // 3.1 没有权限则跳转到无权限提示页面
//                 console.log('这里是审批权限错误提示页面');
//             }
//         } else {
//             // 2.2 没有taskid则说明是平常的登录，执行登录的逻辑
//             if (
//                 to.meta.requiresAuth &&
//                 to.meta.authority &&
//                 !authorityList.includes(to.meta.authority)
//             ) {
//                 // 需要权限但用户没有权限，处理无权限情况
//                 console.log('这里是普通权限错误提示页面');
//                 next(); // 假设你有一个显示无权限提示的路由
//             } else {
//                 // 不需要权限或者用户有权限，允许访问
//                 next();
//             }
//         }
//     }
// });

export default router;
