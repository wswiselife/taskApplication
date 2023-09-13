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
