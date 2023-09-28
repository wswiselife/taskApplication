/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-01 10:00:28
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-15 16:39:46
 * @FilePath: \taskApplication\src\api\modules\task.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { request } from '../index';

/********************************\
 * 新建申请
\********************************/
// 新建任务
export const createTask = (data) => {
    // console.log('data ===', data);
    return request.post('/jsy/TaskApply/AddTaskApply', {
        taskDescription: data.taskDescription,
        projectId: data.projectId,
        taskTypeId: data.taskTypeId,
        planFinishHour: data.planFinishHour,
        planFinishDate: data.planFinishDate,
        applyAuditId: data.applyAuditId,
    });
};

// 获取用户拥有权限的项目类型
export const getUserProjectList = () => {
    return request.get('/jsy/Project/GetProjectListByUserId');
};

// 获取所有任务类别数据
export const getTaskTypeList = () => {
    return request.get('/jsy/TaskType/GetTaskTypeList');
};

// 获取审批人ID
export const getAuditUserList = () => {
    return request.get('/jsy/Employee/GetTaskApplyAuditUserList');
};

/********************************\
 * 获取任务列表
\********************************/
// 获取待审批列表（申请人）
export const getEmployeeTaskData = () => {
    return request.get('/jsy/TaskApply/GetNewTaskApplyByEmployeeId');
};

// 获取待审批列表（审批人）
export const getAuditTaskData = () => {
    return request.get('/jsy/TaskApply/GetNewTaskApplyByApplyAuditId');
};

/********************************\
 * 修改申请
\********************************/
export const getUpdateTaskData = (data) => {
    return request.post('/jsy/TaskApply/UpdateTaskApply', data);
};

/********************************\
 * 假删除申请
\********************************/
export const deleteTaskData = (currentId) => {
    return request.post('/jsy/TaskApply/DeleteTaskApply', null, {
        params: {
            pId: currentId,
        },
    });
};

/********************************\
 * (审批人)同意申请
\********************************/

export const agreeTaskData = (data) => {
    return request.post('/jsy/TaskApply/TaskApplyAudit', {
        taskApplyId: data.chooseAgreeId,
        taskPoints: data.point,
        planFinishDate: data.finishDate,
        planFinishHour: data.finishHour,
    });
};
