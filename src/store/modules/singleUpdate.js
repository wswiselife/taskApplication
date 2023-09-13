import {
    sUpdateAuditId,
    sUpdateProjectId,
    sUpdateTaskTypeId,
    sUpdateTaskDescription,
    sUpdatePlanFinishHour,
    sUpdatePlanFinishDate,
} from '@/api/modules/singleUpdate';
import { defineStore } from 'pinia';

// 单个修改项目名称
export const useSingleUpdateProjectIdStore = defineStore('useSPProjectId', {
    // state: () => {
    //     return {
    //         data: {
    //             pTaskApplyId: null,
    //             pProjectId: null,
    //         },
    //     };
    // },
    actions: {
        async fetchSUProjectIdAction(data) {
            return await sUpdateProjectId(data);
        },
    },
});

// 单元格修改类型
export const useSingleUpdateTaskTypeIdStore = defineStore('useSUTaskType', {
    actions: {
        async fetchSUTaskTypeIdAction(data) {
            return await sUpdateTaskTypeId(data);
        },
    },
});

// 单元格修改审批人
export const useSingleUpdateAuditIdStore = defineStore('useSUAudit', {
    actions: {
        async fetchSUAuditIdAction(data) {
            return await sUpdateAuditId(data);
        },
    },
});

// 单元格修改任务描述
export const useSingleUpdateDescriptionStore = defineStore('useSUDescription', {
    actions: {
        async fetchSUDescriptionAction(data) {
            return await sUpdateTaskDescription(data);
        },
    },
});

// 单元格修改计划完成小时数
export const useSingleUpdatePlanFinishHourStore = defineStore(
    'useSUPlanFinishHour',
    {
        actions: {
            async fetchSUPlanFinishHourAction(data) {
                return await sUpdatePlanFinishHour(data);
            },
        },
    },
);

// 单元格修改计划完成日期
export const useSingleUpdatePlanFinishDateStore = defineStore(
    'useSUPlanFinishDate',
    {
        actions: {
            async fetchSUPlanFinishDateAction(data) {
                return await sUpdatePlanFinishDate(data);
            },
        },
    },
);
