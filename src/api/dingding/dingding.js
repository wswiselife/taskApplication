import { APPKEY, APPSECRET, PROCESSCODE } from '@/assets/dingding/constant';
import { ElMessage } from 'element-plus';
import { agreeTaskData, deleteTaskData } from '@/api/modules/task';
import {
    taskApplyNameCombineDingUserId,
    getDingUserId,
} from '@/api/dingding/combine';
import {
    showFailMessage,
    showSuccessMessage,
} from '@/utils/show-message/showSFmessage';

import { useIsCreatedStore } from '@/store/public';
import { isMobileDevice } from '@/utils/device/isMobile';
import { showFailToast } from 'vant';

const isCreatedStore = useIsCreatedStore();

/********************************\
 * 根据开发者后台查看应用的AppKey和AppSecret
 * 获取企业内部应用的accessToken【第一步】
\********************************/
export const getAccessTokenData = async () => {
    await fetch('/api/v1.0/oauth2/accessToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            appKey: APPKEY,
            appSecret: APPSECRET,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            // console.log('第一步：AccessToken:', data.accessToken);
            // 先存储在本地
            localStorage.setItem('accessToken', data.accessToken);
        })
        .catch((error) => {
            // showFailMessage(`获取企业accessToken失败，${error}`);
            console.error('Error:', error);
        });
};
/**
 *
 */
/********************************\
 * 根据部门用户获取用户userid
 * 根据部门列表，获取部门用户[第二步]
\********************************/
// 获取部门列表需要企业AccessToken
export const getDeptIdData = async () => {
    // 先获取accessToken
    try {
        await getAccessTokenData();
    } catch (error) {
        // showFailMessage(`获取企业accessToken失败，${error}`);
        console.log('error:', error);
    }

    const accessToken = localStorage.getItem('accessToken'); // 从localStorage获取AccessToken
    const url = `/oapi/topapi/v2/department/listsub?access_token=${accessToken}`;

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            // 如果API需要在请求体中包含特定参数，请在这里添加
            dept_id: 1,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            // console.log('第二步：dept:', data);
            // console.log(
            //     '第二步：部门（任务申请部门）dept_id:',
            //     data.result[0].dept_id,
            // );
            // todo 部门信息改变 20231214
            localStorage.setItem('deptId', data.result[0].dept_id);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

/********************************\
 * 获取部门下人员列表[第三步]
\********************************/
export const getUserListData = async (data) => {
    // 先获取accessToken
    try {
        await getDeptIdData();
    } catch (error) {
        // showFailMessage(`获取企业accessToken失败，${error}`);
        console.log('error:', error);
    }
    const accessToken = localStorage.getItem('accessToken');
    const url = `/oapi/topapi/v2/user/list?access_token=${accessToken}`;
    const deptId = localStorage.getItem('deptId');
    let approverName = data;
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dept_id: deptId,
            cursor: 0,
            size: 50,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            // console.log('第三步：中文名匹配userid：', data);

            // 根据【申请人】中文名，找出钉钉的userid，并传递给后端
            const chineseName = localStorage.getItem('chineseName');
            let foundUser = data.result.list.find(
                (user) => user.name == chineseName,
            );
            if (foundUser) {
                // console.log('找到的用户ID：', foundUser.userid);
                let payload = {
                    nameCN: foundUser.name,
                    dingtalkUserId: foundUser.userid,
                };
                // console.log('payload ===', payload);
                // 钉钉中文名和钉钉userid传递给后端
                taskApplyNameCombineDingUserIdFun(payload);
            } else {
                // showFailMessage('没有找到与钉钉匹配的用户。');
                console.log('在钉钉中没有找到与任务申请系统中文名匹配的用户。');
            }

            // console.log('approverName ===', approverName);
            // 根据【审批人】中文名，找出钉钉的userid，并传递给后端
            let foundApprover = data.result.list.find(
                (user) => user.name == approverName,
            );
            if (foundApprover) {
                // console.log('找到的用户ID：', foundUser.userid);
                let payload = {
                    nameCN: foundApprover.name,
                    dingtalkUserId: foundApprover.userid,
                };
                // console.log('payload ===', payload);
                // 钉钉中文名和钉钉userid传递给后端
                taskApplyNameCombineDingUserIdFun(payload);
            } else {
                // showFailMessage('没有找到与钉钉匹配的用户。');
                console.log('在钉钉中没有找到与任务申请系统中文名匹配的用户。');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};
/********************************\
 * 发起审批
\********************************/
export const getApplyData = async (data) => {
    try {
        // await getUserIdData();
        // console.log('发起审批时的data ===', data.applyAuditName);
        // 首先根据表单信息获取审批人是谁，后续根据本地存储的信息获取申请人是谁
        await getUserListData(data.applyAuditName);
    } catch (error) {
        // showFailMessage(`获取用户userId出错，${error}`);
        console.log('error:', error);
    }
    // console.log('钉钉任务申请的data ===', data);
    // 判断是谁发起的请求，获取钉钉的经过我们自己后端处理的userid
    await getDingUserIdFun();

    // 获取指定的审批人，特定推送审批
    await getDingApproverIdFun(data.applyAuditName);

    // 调用该接口的访问凭证
    const accessToken = localStorage.getItem('accessToken');
    // 申请人的userId
    const myUserId = localStorage.getItem('myUserId');
    // 审批人的userid
    const approverUserId = localStorage.getItem('approverUserId');
    // url地址
    const url = `/api/v1.0/workflow/processInstances`;

    // 指定的审批人
    // const approverDing = [
    //     {
    //         actionType: 'NONE',
    //         userIds: [approverUserId],
    //     },
    // ];

    let formComponentValues = [
        // 包含其他固定的表单组件值
        {
            name: '任务申请ID',
            value: data.applyId.toString(),
        },
        {
            name: '项目名称',
            value: data.projectName,
        },
        {
            name: '任务类型',
            value: data.taskTypeName,
        },
        {
            name: '申请人',
            value: data.applyName,
        },
        {
            name: '审批人',
            value: `["${approverUserId}"]`,
        },
        {
            name: '计划完成小时数',
            value: data.planFinishHour.toString(),
        },
        {
            name: '任务说明',
            value: data.taskDescription,
        },
        // {
        //     name: '联系人',
        //     value: `["${approverUserId}"]`,
        //     // value: '["' + approverUserId + '"]',
        // },
    ];

    // 如果用户已经选择了计划完成日期，则添加到表单值数组中
    if (data.planFinishDate !== null && data.planFinishDate !== undefined) {
        formComponentValues.push({
            name: '计划完成日期',
            value: data.planFinishDate, // 假设这是一个字符串
        });
    }

    // console.log('formComponentValues ===', formComponentValues);

    const response = await fetch(url, {
        // mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-acs-dingtalk-access-token': accessToken,
        },
        body: JSON.stringify({
            // 任务申请人
            originatorUserId: myUserId,
            processCode: PROCESSCODE,
            formComponentValues,
            // 要是没有指定审批人，deptid为必填
            deptId: '1',

            // 指定审批人
            // approvers: [approverUserId],
        }),
    });

    return response.json();
};

/********************************\
 * 查询实例的状态
\********************************/
export const getDingApprovalResultData = async (instanceId, applyId) => {
    try {
        await getAccessTokenData();
    } catch (error) {
        // showFailMessage(`获取企业accessToken失败，${error}`);
        console.log('error:', error);
    }
    const accessToken = localStorage.getItem('accessToken');
    // const instanceId = localStorage.getItem('instanceId');
    const url = `/api/v1.0/workflow/processInstances?processInstanceId=${instanceId}`;

    // console.log('instanceId, applyId ===', instanceId, applyId);
    await fetch(url, {
        method: 'GET',
        headers: {
            'x-acs-dingtalk-access-token': accessToken,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            // console.log('任务申请data：', data);
            // localStorage.setItem('instanceId', data.instanceId);
            // 判断状态

            if (
                data &&
                data.result.result == 'agree' &&
                data.result.status == 'COMPLETED'
            ) {
                // 拒绝也是走COMPLETED
                // 在任务申请系统请求审批成功,重新获取列表
                dingdingApproval(data.result.formComponentValues);
            } else if (
                // 如果拒绝，现在是决定删除数据
                data.result.result == 'refuse' &&
                data.result.status == 'COMPLETED'
            ) {
                // 拒绝也是走COMPLETED
                //拒绝审批的，则传管理员删除的接口
                let payload = {
                    currentId: applyId,
                    type: 1,
                };
                dingDeleteTask(payload);
                // 重新获取列表
            } else {
                if (isMobileDevice) {
                    showFailToast({
                        icon: 'warning-o',
                        message: '钉钉任务申请审批中，请等待审批人进行审批。',
                    });
                } else {
                    ElMessage({
                        message: `钉钉任务申请审批中，请等待审批人进行审批。`,
                        type: 'warning',
                    });
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            // 要进行细节判断 20231207
            showFailMessage(
                '任务申请未在钉钉进行同步，无法获取钉钉任务申请状态，请联系审批人在任务申请审批列表中进行审批。',
            );
        });
};

/********************************\
 * 调系统审批的接口，传递数据
\********************************/
const dingdingApproval = async (payload) => {
    // console.log('钉钉返回数据的payload ===', payload);
    // console.log('任务id ===', payload[0].value);
    // console.log('计划完成小时数 ===', payload[4].value);
    // console.log('计划完成日期 ===', payload[5].value);
    // console.log('任务说明 ===', payload[6].value);
    // console.log('任务点数 ===', payload[7].value);
    const data = {
        chooseAgreeId: payload[0].value,
        finishHour: payload[6].value,
        finishDate: payload[7].value,
        taskDescription: payload[8].value,
        point: payload[5].value,
    };
    // 对返回的数据进行校验，后端不做校验
    if (!data.chooseAgreeId) {
        showFailMessage('钉钉同步失败，任务id缺失。');
        return;
    }
    if (!data.finishHour) {
        showFailMessage('钉钉同步失败，计划完成小时数不能为空。');
        return;
    }
    if (!data.taskDescription) {
        showFailMessage('钉钉同步失败，任务说明不能为空。');
        return;
    }
    if (!data.point) {
        showFailMessage('钉钉同步失败，任务点数不能为空。');
        return;
    }
    try {
        const response = await agreeTaskData(data);
        // console.log('response ===', response);
        if (response && response.code == 200) {
            showSuccessMessage(
                `任务申请审批成功，任务编号为${response.result.code}。`,
            );
            //成功则直接刷新列表
            isCreatedStore.setIsCreated(true);
        } else {
            showFailMessage(response.message);
        }
    } catch (error) {
        showFailMessage('任务申请审批失败，' + error);
        // console.log('钉钉审批-error ===', error);
        //
    }
};

/********************************\
 * 审批失败后删除任务
\********************************/
const dingDeleteTask = async (payload) => {
    try {
        const response = await deleteTaskData(payload);
        if (response.code == 200) {
            // 刷新列表数据
            showFailMessage(
                '任务申请审批不通过，已拒绝任务申请，三秒后将删除任务申请。',
            );
            setTimeout(() => {
                isCreatedStore.setIsCreated(true);
            }, 3000);
        }
    } catch (error) {
        showFailMessage(`任务申请删除失败，接口出现问题，${error}`);
        console.log('error：', error);
    }
};

// 名字结合
const taskApplyNameCombineDingUserIdFun = async (data) => {
    try {
        // console.log('名字结合data ===', data);
        await taskApplyNameCombineDingUserId(data);
    } catch (error) {
        console.log('error:', error);
    }
};

/********************************\
 * 获取钉钉的申请人userid
\********************************/
const getDingUserIdFun = async () => {
    try {
        const chineseName = localStorage.getItem('chineseName');
        // console.log('chineseName ===', chineseName);
        // 使用 encodeURIComponent 确保中文字符被正确编码
        const encodedChineseName = encodeURIComponent(chineseName);
        const response = await getDingUserId(encodedChineseName);
        // console.log('我们自己经过处理的(申请人)userid ===', response);
        if (response && response.code == 200) {
            localStorage.setItem('myUserId', response.result.dingtalkUserId);
        }
    } catch (error) {
        console.log('error:', error);
    }
};

/********************************\
 * 获取钉钉的审批人userid
\********************************/
const getDingApproverIdFun = async (payload) => {
    try {
        const encodedChineseName = encodeURIComponent(payload);
        const response = await getDingUserId(encodedChineseName);
        // console.log('我们自己经过处理的(审批人)userid ===', response);
        if (response && response.code == 200) {
            localStorage.setItem(
                'approverUserId',
                response.result.dingtalkUserId,
            );
        }
    } catch (error) {
        console.log('error:', error);
    }
};
