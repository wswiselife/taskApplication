/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-13 16:44:33
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-18 12:43:09
 * @FilePath: \taskApplication\src\store\public.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia';

// 创建后判断是否更新列表
export const useIsCreatedStore = defineStore('isCreated', {
    state: () => {
        return {
            isCreated: false,
        };
    },
    actions: {
        setIsCreated(payload) {
            this.isCreated = payload;
            // console.log('this.isCteated ===', this.isCreated);
        },
    },
});

// 存储登录后的userId
export const useUserIdStore = defineStore('userId', {
    state: () => {
        return {
            userId: localStorage.getItem('userId') || '',
        };
    },
    actions: {
        saveUserId(payload) {
            this.userId = payload;
            // 当 userId 被更新时，将其保存到 localStorage
            localStorage.setItem('userId', payload);
        },
    },
});
