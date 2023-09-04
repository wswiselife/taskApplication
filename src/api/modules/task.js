import { request } from '../index';

// 新建申请
export const createTask = (data) => {
    return request.post('TaskApply/AddTaskApply', {
        taskDescription: data.taskDescription,
        projectId: data.projectId,
        taskTypeId: data.taskTypeId,
        planFinishHour: data.planFinishHour,
        pianFinishData: data.pianFinishData,
        applyAuditId: data.applyAuditId,
    });
};

// 获取用户拥有权限的项目类型
export const getUserProjectList = () => {
    return request.get('/Project/GetProjectListByUserId');
};

// 获取所有任务类别数据
export const getTaskTypeList = () => {
    return request.get('/TaskType/GetTaskTypeList');
};

// 获取审批人ID
export const getAuditUserList = () => {
    return request.get('/Employee/GetTaskApplyAuditUserList');
};
