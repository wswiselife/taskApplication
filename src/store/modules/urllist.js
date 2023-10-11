import { defineStore } from 'pinia';
import {
    addURLListData,
    getURLListData,
    updateURLListData,
    deleteURLListData,
} from '@/api/modules/urllist';

// 获取urllist
export const useGetURLListStore = defineStore('getURLList', {
    state: () => {
        return {
            urllist: [],
        };
    },
    actions: {
        async fetchGetURLListAction() {
            const response = await getURLListData();
            this.urllist = response.result;
            // console.log('store中的this.urllist ===', this.urllist);
        },
    },
});

// 新增urllist
export const useAddURLListStore = defineStore('addURLList', {
    actions: {
        async fetchAddURLListAction(data) {
            return await addURLListData(data);
        },
    },
});

// 修改urllist
export const useUpdateURLListStore = defineStore('updateURLList', {
    actions: {
        async fetchUpdteURLListAction(data) {
            return await updateURLListData(data);
        },
    },
});

// 删除urllist
export const useDeleteURLListStore = defineStore('deleteURLList', {
    actions: {
        async fetchDeleteURLListAction(id) {
            return await deleteURLListData(id);
        },
    },
});
