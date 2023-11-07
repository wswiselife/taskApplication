// 检查是否需要身份验证，检查路由元信息
// if (to.matched.some((record) => record.meta.requiresAuth)) {
//     // 用户未登录，则跳转去登录
//     if (!token) {
//         next({ path: '/login', query: { redirect: to.query } });
//         // router.replace('/login');
//         return;
//     }

//     // 检查用户是否有访问该路由的权限，防止直接修改路由实现跳转
//     if (to.meta.authority && !authorityList.includes(to.meta.authority)) {
//         // 如果用户没有权限，导航回他们之前的页面
//         router.replace(from.path);
//         return;
//     }

//     // 若已经登录则直接审批
//     // console.log('authorityList.includes('WEB_TaskApplyAudit') ===', authorityList)
//     if (
//         token &&
//         to.query.taskId &&
//         authorityList.includes('WEB_TaskApplyAudit')
//     ) {
//         next({
//             path: '/dashboard/approval',
//             query: { redirect: to.query },
//         });
//         return;
//     }
// }

// // 如果用户登录成功后尝试返回登录页面
// if (from.path === '/login' && to.path !== '/login' && !token) {
//     router.replace('/login');
//     return;
// }

// 允许导航
// next();
