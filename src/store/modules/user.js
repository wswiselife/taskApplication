/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-01 15:06:11
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-01 16:17:49
 * @FilePath: \taskApplication\src\store\modules\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { userLogin } from '@/api/modules/user';
import { defineStore } from 'pinia';

/********************************\ 
 * actions 函数命名为 fetch(Name)Action
\********************************/

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useUserLoginStore = defineStore('userLogin', {
    state: () => {},
    getters: {},
    actions: {
        async fetchUserLoginAction(data) {
            const result = await userLogin(data);
            // console.log('user store仓库 result ===', result);
            return result;
        },
    },
});
