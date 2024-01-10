/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-04 10:52:44
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-13 10:18:14
 * @FilePath: \taskApplication\src\store\modules\task.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-04 10:52:44
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-12 14:34:02
 * @FilePath: \taskApplication\src\store\modules\task.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    createTask,
    getTaskTypeList,
    getUserProjectList,
    getAuditUserList,
    getEmployeeTaskData,
    getAuditTaskData,
    getUpdateTaskData,
    deleteTaskData,
    agreeTaskData,
    getPlanFinishHourData,
} from '@/api/modules/task';
import { defineStore } from 'pinia';

/********************************\
 * 公共组件引入
\********************************/

/********************************\
 * 新建任务
\********************************/
export const useCreateTaskStore = defineStore('userCreate', {
    state: () => {},
    actions: {
        async fetchCreateTaskAction(data) {
            const result = await createTask(data);
            // console.log('仓库 CreateTask ===', result);
            return result;
        },
    },
});

// 获取有权限的项目类型
export const useUserProjectListStore = defineStore('userProjectList', {
    state: () => {},
    actions: {
        async fetchUserProjectListAction(userId) {
            const result = await getUserProjectList(userId);
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

/********************************\
* 获取审批列表
\********************************/
// 获取待审批列表（申请人）
export const useEmployeeTaskStore = defineStore('employeeTask', {
    state: () => {
        return {
            employeeTaskList: [],
        };
    },
    actions: {
        async fetchEmployeeTaskAction() {
            const response = await getEmployeeTaskData();
            this.employeeTaskList = response.result;
            return response;
        },
    },
});

// 获取待审批列表（审批人）
export const useAuditTaskStore = defineStore('auditTask', {
    state: () => ({
        // 响应式处理
        auditTaskList: [],
    }),
    actions: {
        async fetchAuditTaskAction() {
            const response = await getAuditTaskData();
            this.auditTaskList = response.result;
            return response;
        },
    },
});

/********************************\
* 修改申请
\********************************/
export const useUpdateTaskStore = defineStore('useUpdate', {
    state: () => {},
    actions: {
        async fetchUpdateTaskAction(data) {
            const result = await getUpdateTaskData(data);
            return result;
        },
    },
});

/********************************\
* 假删除申请
\********************************/
export const useDeleteTaskStore = defineStore('useDelete', {
    // state: () => {
    //     return {
    //         // 需要接收数据的时候才使用
    //         currentId:null
    //     }
    // },
    actions: {
        async fetchDeleteTaskAction(data) {
            const response = await deleteTaskData(data);
            return response;
        },
    },
});

/********************************\
* (审批人)同意申请
\********************************/
export const useAgreeTaskStore = defineStore('useAgree', {
    // state: () => {
    //     return {
    //         currentId: null,
    //         point:null
    //     }
    // },
    actions: {
        async fetchAgreeTaskAction(data) {
            const response = await agreeTaskData(data);
            return response;
        },
    },
});

export const usePlanFinishHourStore = defineStore('planHour', {
    actions: {
        async fetchPlanFinishHourAction() {
            const result = await getPlanFinishHourData();
            return result;
        },
    },
});
