import { request } from '../index';

// 钉钉创建实例成功，和任务申请系统创建成功之后，将二者结合
// 得到一个taskid对应一个instanceid
/**
 *
 * @param {string|number} taskApplyId -任务申请id
 * @param {string|number} dingInstanceId
 * @returns
 */
export const taskApplyIdCombineDingInstanceId = (
    taskApplyId,
    dingInstanceId,
) => {
    // console.log('taskApplyId ===', taskApplyId);
    // console.log('dingInstanceId ===', dingInstanceId);
    const url = `/jsy/TaskApply/UpdateTaskApplyByInstanceId`;
    return request.post(url, null, {
        params: {
            pTaskApplyId: taskApplyId,
            pInstanceId: dingInstanceId,
        },
    });
};

// 任务申请中文名结合钉钉的用户名
// 根据中文名和钉钉的userid,将数据传递给服务器存储
// 方便后续我们根据中文名找到对应的userid
// 这里就应该让后端去做，而不是前端去做
export const taskApplyNameCombineDingUserId = (data) => {
    const url = `/jsy/Employee/UpdateDingtalkUserIdByEmployeeNameCN`;
    return request.post(url, {
        nameCN: data.nameCN,
        dingtalkUserId: data.dingtalkUserId,
    });
};

// 根据用户的名字，返回钉钉的userid，这样就知道，是谁发起的钉钉的请求
// export const getDingUserId = () => {
//     const chineseName = localStorage.getItem('chineseName');
//     console.log('chineseName ===', chineseName);
//     const url = `/jsy/Employee/GetDingtalkUserIdByNameCN`;
//     return request.get(url, null, {
//         params: {
//             pNameCN: chineseName,
//         },
//     });
// };

// 根据用户的名字，返回钉钉的userid，这样就知道，
// 是谁发起的钉钉的请求，和审批的userid, 知道发给谁，让谁审批
export const getDingUserId = (payload) => {
    const url = `/jsy/Employee/GetDingtalkUserIdByNameCN?pNameCN=${payload}`;
    // 打印最终的请求URL以进行检查
    // console.log('Request URL:', url);
    // 发起GET请求
    return request.get(url);
};
