/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-30 09:55:52
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-07 13:58:23
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
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/dashboard',
            component: () => import('../layout/index.vue'),
            children: [
                {
                    path: 'apply',
                    component: () => import('../views/applyTask/ApplyTask.vue'),
                },
                {
                    path: 'approval',
                    component: () =>
                        import('../views/approvalTask/ApprovalTask.vue'),
                },
            ],
        },
        {
            path: '/login',
            component: () => import('../views/login/Login.vue'),
        },
    ],
});

export default router;
