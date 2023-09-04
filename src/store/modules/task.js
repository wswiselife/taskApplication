import {
    createTask,
    getTaskTypeList,
    getUserProjectList,
    getAuditUserList,
} from '@/api/modules/task';
import { defineStore } from 'pinia';

// 新建申请
export const useCreateTaskStore = defineStore('userCreate', {
    state: () => {},
    actions: {
        async fetchCreateTaskAction(data) {
            const result = await createTask(data);
            console.log('仓库 CreateTask ===', result);
            return result;
        },
    },
});

// 获取有权限的项目类型
export const useUserProjectListStore = defineStore('userProjectList', {
    state: () => {},
    actions: {
        async fetchUserProjectListAction() {
            const result = await getUserProjectList();
            return result;
        },
    },
});

// 获取所有任务类别数据
export const useTaskTypeListStore = defineStore('taskTypeList', {
    state: () => {},
    actions: {
        async fetchTaskTypeListAction() {
            const result = await getTaskTypeList();
            return result;
        },
    },
});

// 获取审批人ID
export const useAuditUserListStore = defineStore('auditUserList', {
    state: () => {},
    actions: {
        async fetchAuditUserListAction() {
            const result = await getAuditUserList();
            return result;
        },
    },
});
