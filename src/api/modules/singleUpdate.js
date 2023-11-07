/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-13 10:14:04
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-15 15:52:41
 * @FilePath: \taskApplication\src\api\modules\singleUpdate.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { request } from '../index';

// 单独修改项目名称
export const sUpdateProjectId = (data) => {
    // 传数据的时候的格式解构要注意 // todo
    // console.log('axios的data ===', data);
    return request.post('/jsy/TaskApply/UpdateTaskApplyByProjectId', null, {
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
    return request.post('/jsy/TaskApply/UpdateTaskApplyByTaskTypeId', null, {
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
    return request.post('/jsy/TaskApply/UpdateTaskApplyByApplyAuditId', null, {
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
    return request.post(
        '/jsy/TaskApply/UpdateTaskApplyByTaskDescription',
        null,
        {
            params: {
                pTaskDescription: data.pTaskDescription,
                pTaskApplyId: data.pTaskApplyId,
            },
        },
    );
};

// 单独修改完成小时数
export const sUpdatePlanFinishHour = (data) => {
    // 传数据的时候的格式解构要注意 // todo
    // console.log('axios的data ===', data);
    return request.post(
        '/jsy/TaskApply/UpdateTaskApplyByPlanFinishHour',
        null,
        {
            params: {
                pPlanFinishHour: data.pPlanFinishHour,
                pTaskApplyId: data.pTaskApplyId,
            },
        },
    );
};

// 单独修改完成日期
export const sUpdatePlanFinishDate = (data) => {
    // 传数据的时候的格式解构要注意 // todo
    // console.log('axios的data ===', data);
    return request.post(
        '/jsy/TaskApply/UpdateTaskApplyByPlanFinishDate',
        null,
        {
            params: {
                pPlanFinishDate: data.pPlanFinishDate,
                pTaskApplyId: data.pTaskApplyId,
            },
        },
    );
};
