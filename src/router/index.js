/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-30 09:55:52
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-08-31 16:37:31
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
            path: '/layout',
            component: () => import('../layout/index.vue'),
            children: [
                {
                    path: 'pendingtask',
                    component: () =>
                        import('../views/PendingTask/PendingTask.vue'),
                },
                {
                    path: 'adminpendingtask',
                    component: () =>
                        import(
                            '../views/AdminPendingTask/AdminPendingTask.vue'
                        ),
                },
            ],
        },
        {
            path: '/login',
            component: () => import('../views/Login/Login.vue'),
        },
    ],
});

export default router;
