import { request } from '../index';

// 单独修改项目名称
export const sUpdateProjectId = (data) => {
    // 传数据的时候的格式解构要注意 // todo
    // console.log('axios的data ===', data);
    return request.post('/TaskApply/UpdateTaskApplyByProjectId', null, {
        params: {
            pProjectId: data.pProjectId,
            pTaskApplyId: data.pTaskApplyId,
        },
    });
};

// 单独修改任务类型
export const sUpdateTaskTypeId = (data) => {
    // 传数据的时候的格式解构要注意 // todo
    // console.log('axios的data ===', data);
    return request.post('/TaskApply/UpdateTaskApplyByTaskTypeId', null, {
        params: {
            pTaskTypeId: data.pTaskTypeId,
            pTaskApplyId: data.pTaskApplyId,
        },
    });
};

// 单独修改审批人
export const sUpdateAuditId = (data) => {
    // 传数据的时候的格式解构要注意 // todo
    // console.log('axios的data ===', data);
    return request.post('/TaskApply/UpdateTaskApplyByApplyAuditId', null, {
        params: {
            pApplyAuditId: data.pApplyAuditId,
            pTaskApplyId: data.pTaskApplyId,
        },
    });
};

// 单独修改任务描述
export const sUpdateTaskDescription = (data) => {
    // 传数据的时候的格式解构要注意 // todo
    // console.log('axios的data ===', data);
    return request.post('/TaskApply/UpdateTaskApplyByTaskDescription', null, {
        params: {
            pTaskDescription: data.pTaskDescription,
            pTaskApplyId: data.pTaskApplyId,
        },
    });
};

// 单独修改完成小时数
export const sUpdatePlanFinishHour = (data) => {
    // 传数据的时候的格式解构要注意 // todo
    // console.log('axios的data ===', data);
    return request.post('/TaskApply/UpdateTaskApplyByPlanFinishHour', null, {
        params: {
            pPlanFinishHour: data.pPlanFinishHour,
            pTaskApplyId: data.pTaskApplyId,
        },
    });
};

// 单独修改完成日期
export const sUpdatePlanFinishDate = (data) => {
    // 传数据的时候的格式解构要注意 // todo
    // console.log('axios的data ===', data);
    return request.post('/TaskApply/UpdateTaskApplyByPlanFinishDate', null, {
        params: {
            pPlanFinishDate: data.pPlanFinishDate,
            pTaskApplyId: data.pTaskApplyId,
        },
    });
};
