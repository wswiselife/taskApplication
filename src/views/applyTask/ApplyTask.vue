<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 15:40:06
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-18 13:55:09
 * @FilePath: \taskApplication\src\views\applyTask\ApplyTask.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 15:40:06
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-12 17:07:34
 * @FilePath: \taskApplication\src\views\applyTask\ApplyTask.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 15:40:06
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-11 11:06:40
 * @FilePath: \taskApplication\src\views\applyTask\ApplyTask.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<!-- // todo 表单正则的验证 -->
<script setup>
import {
    useUserProjectListStore,
    useTaskTypeListStore,
    useAuditUserListStore,
    useUpdateTaskStore,
    useEmployeeTaskStore,
    useDeleteTaskStore,
    usePlanFinishHourStore,
} from '@/store/modules/task.js';

import { ref, reactive, onMounted, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
// import {
//     formatProjectName,
//     formatTaskType,
//     formatAudit,
// } from '@/assets/data/vxeColumnData';
import {
    useSingleUpdateProjectIdStore,
    useSingleUpdateTaskTypeIdStore,
    useSingleUpdateAuditIdStore,
    useSingleUpdatePlanFinishHourStore,
    useSingleUpdatePlanFinishDateStore,
    useSingleUpdateDescriptionStore,
} from '@/store/modules/singleUpdate';

import { useIsCreatedStore } from '@/store/public';
// 校验
import { validateHoursInput } from '@/utils/validate/validateHoursInput';
import {
    getFormattedDate,
    getFormattedDateTwo,
    getFormattedDateThree,
} from '@/utils/format/formatDate';
import { disabledPreviousDates } from '@/utils/limit/limitDateSelect';
// 任务描述验证
import { validateDescriptionInput } from '@/utils/validate/validateDescript';
// 创建按钮
import CreateTask from '@/components/create-task/CreateTask.vue';
// 获取store中的userid
import { useUserIdStore } from '@/store/public';
// 导入时间&分钟选择
// import HourAndMinSelect from '@/components/hour-min-select/HourAndMinSelect.vue';
// 防抖处理
import debounce from 'lodash/debounce';
// 设备检测
import { isMobileDevice } from '@/utils/device/isMobile';
// 路由返回
import { useRouter } from 'vue-router';
import { showFailToast } from 'vant';
// 日期非选
import { validateDateInput } from '@/utils/validate/validateDate';
// 复制链接
import { copyLink } from '@/utils/copy-link/copy-link.js';
import {
    showFailMessage,
    showSuccessMessage,
} from '@/utils/show-message/showSFmessage';

/********************************\
 * 获取权限处理
\********************************/
const authorityList = ref([]);
/********************************\
 * 公共引入处理
\********************************/
// 数据加载中
const isDataLoaded = ref(false);
onMounted(async () => {
    // 从 localStorage 中获取权限信息
    const storedAuthorityList = localStorage.getItem('authorityList');
    if (storedAuthorityList) {
        authorityList.value = JSON.parse(storedAuthorityList);
    }
    // 进入时获取列表数据
    await getEmployeeTasList();

    // 本来下面四个是不需要的，单独修改可以当获得焦点的时候再请求对应的接口
    // 但是一开始后端并没有直接给对应的文字信息，一开始给的是这些接口的id,所以为了展示内容，要获取她们
    // id对应的文字信息，所以进入的时候要多请求四个接口，如果一开始就有文字信息，可以只获取一个
    // 调用用户权限项目接口
    // do(20231114)
    // getUserProjectList();
    // 调用获取任务类型接口
    // getTaskTypeList();
    // 调用审批人接口
    // getAuditUserList();
    // 计划完成小时数选择修改
    // getPlanFinishList();
    // 得到数据之后，获取成功
    isDataLoaded.value = true;
});

// 修改的选项的权限获取
const userProjectList = useUserProjectListStore();
const useTaskTypeList = useTaskTypeListStore();
const useAuditTypeList = useAuditUserListStore();
const usePlanFinishHourList = usePlanFinishHourStore();

// 更新接口数据
const useUpdateTask = useUpdateTaskStore();
// 假删除接口数据
const deleteTask = useDeleteTaskStore();
// 获取用户id
const userIdStore = useUserIdStore();
// 移动端返回
const router = useRouter();

/********************************\
 * 获取列表数据并渲染
\********************************/
async function getEmployeeTasList() {
    // 想拿到状态码，store中要返回promise，这里要使用async/await
    try {
        // 返回值通过store获取，这里只负责发送请求
        await employeeTaskStore.fetchEmployeeTaskAction();
    } catch (error) {
        showFailMessage(error);
    }

    // console.log('申请列表数据 ====', employeeTaskList);
    // console.log('页面中的response ===', response.code);
}
const employeeTaskStore = useEmployeeTaskStore(); // 列表展示数据
// 这里一定要用storeTorefs,而不是ref // todo
// 数据持久化问题
const { employeeTaskList } = storeToRefs(employeeTaskStore);

// console.log(' employeeTaskList===', employeeTaskList);

// 父子组件通过store进行通信
// 获取创建成功的数据
const isCreatedStore = useIsCreatedStore();
const { isCreated } = storeToRefs(isCreatedStore);

watch(isCreated, (newValue) => {
    if (newValue) {
        getEmployeeTasList();
        isCreatedStore.setIsCreated(false);
    }
});

/********************************\
 * 单元格修改
\********************************/
const singleUpdateProjectIdStore = useSingleUpdateProjectIdStore();
const singleUpdateTaskTypeIdStore = useSingleUpdateTaskTypeIdStore();
const singleUpdateAuditIdStore = useSingleUpdateAuditIdStore();
const singleUpdateDescriptionStore = useSingleUpdateDescriptionStore();
const singleUpdatePlanFinishHourStore = useSingleUpdatePlanFinishHourStore();
const singleUpdatePlanFinishDateStore = useSingleUpdatePlanFinishDateStore();
/********************************\
 * 控制弹出层、表单响应
\********************************/
const dialogFormVisible = ref(false);
const formLabelWidth = '120px';
// 储存选择的那条数据
const chooseModifyId = ref(null);

const form = reactive({
    taskDescription: '', // 任务描述
    projectId: null, // 项目 ID
    planFinishHour: null, // 计划完成小
    taskTypeId: null, // 任务类别 ID时数
    planFinishDate: '', // 计划完成日期
    planFinishDateTime: '', // 计划完成日期时间
    applyAuditId: null, // 审批人ID
    id: chooseModifyId.value,
});

const resetFormDate = () => {
    form.planFinishDate = ''; // 计划完成日期
    form.planFinishDateTime = ''; // 计划完成日期时间
};

/********************************\
 * 修改内容,弹出框，内容填充
\********************************/
function dialogFormVisibleFun(currentId) {
    dialogFormVisible.value = true;
    chooseModifyId.value = currentId;

    // 调用用户权限项目接口
    getUserProjectList();
    // 调用获取任务类型接口
    getTaskTypeList();
    // 调用审批人接口
    getAuditUserList();
    // 计划完成时间选择
    getPlanFinishList();
    // 将已有数据填写到表单中
    // todo
    const selectedItem = employeeTaskList.value.find(
        (item) => item.id === chooseModifyId.value,
    );

    // console.log('selsectedItem ===', selectedItem);

    if (selectedItem) {
        // 时间显示处理

        if (!selectedItem.planFinishDate) {
            form.planFinishDateTime = '';
        } else {
            form.planFinishDateTime = getFormattedDateThree(
                selectedItem.planFinishDate,
            );
        }

        form.taskDescription = selectedItem.taskDescription;
        form.planFinishHour = selectedItem.planFinishHour;
        form.planFinishDate = selectedItem.planFinishDate;
        form.projectId = selectedItem.projectId; // 项目ID
        form.taskTypeId = selectedItem.taskTypeId; // 任务类别ID
        form.applyAuditId = selectedItem.applyAuditId; // 审批人ID
    }
}
/********************************\
 * 获取用户有权限的项目
\********************************/
const projectList = ref([]);
const projectNameMap = ref({}); // 记录映射关系
async function getUserProjectList() {
    const response = await userProjectList.fetchUserProjectListAction(
        userIdStore.userId,
    );
    // console.log('项目idresponse ===', response);
    if (response && response.code === 200) {
        projectList.value = response.result;
        // 根据 projectList 创建 projectNameMap
        projectNameMap.value = response.result.reduce((map, project) => {
            map[project.id] = project.name;
            return map;
        }, {});
    } else {
        // ElMessage({
        //     message: response.message,
        //     type: 'error',
        // });
    }
}

/********************************\
 * 获取任务类别ID
\********************************/
const taskTypeList = ref([]);
const taskTypeMap = ref({});
async function getTaskTypeList() {
    const response = await useTaskTypeList.fetchTaskTypeListAction();
    // console.log('任务类型response ===', response);
    if (response && response.code === 200) {
        taskTypeList.value = response.result;
        // 根据 taskTypeList 创建 taskTypeMap
        taskTypeMap.value = response.result.reduce((map, taskType) => {
            map[taskType.id] = taskType.name;
            return map;
        }, {});
    } else {
        // ElMessage({
        //     message: '获取任务类型失败',
        //     type: 'error',
        // });
    }
}

/********************************\
 * 获取审批人ID
\********************************/
const auditUserList = ref([]);
const auditUserMap = ref({});
async function getAuditUserList() {
    const response = await useAuditTypeList.fetchAuditUserListAction();
    // console.log('审批人response ===', response);
    if (response && response.code === 200) {
        auditUserList.value = response.result;
        // 根据 auditUserList 创建 auditUserMap
        auditUserMap.value = response.result.reduce((map, auditUser) => {
            map[auditUser.id] = auditUser.nameEN;
            return map;
        }, {});
    } else {
        // ElMessage({
        //     message: '获取审批人失败',
        //     type: 'error',
        // });
    }
}

/********************************\
 * 获取计划完成小时数
\********************************/
const planFinishHourList = ref([]);
const planFinishHourListMap = ref({});
async function getPlanFinishList() {
    const response = await usePlanFinishHourList.fetchPlanFinishHourAction();
    // console.log('计划完成小时数response ===', response);
    if (response && response.code === 200) {
        planFinishHourList.value = response.result;
        planFinishHourListMap.value = response.result.reduce(
            (map, planFinishHour) => {
                map[planFinishHour.id] = planFinishHour.taskPoints;
                return map;
            },
            {},
        );
    } else {
        // ElMessage({
        //     message: '获取审批人失败',
        //     type: 'error',
        // });
    }
}

/********************************\
 * 任务修改
\********************************/
async function updateTaskFun() {
    // 验证小时数
    const validateHoursInputResult = validateHoursInput(form.planFinishHour);
    if (!validateHoursInputResult.isValid) {
        if (isMobileDevice) {
            showFailToast(validateHoursInputResult.message);
        } else {
            ElMessage({
                message: validateHoursInputResult.message,
                type: 'error',
            });
        }

        return;
    }

    // 任务描述
    const validateDescriptionInputResult = validateDescriptionInput(
        form.taskDescription,
    );
    if (!validateDescriptionInputResult.isValid) {
        if (isMobileDevice) {
            showFailToast(validateDescriptionInputResult.message);
        } else {
            ElMessage({
                message: validateDescriptionInputResult.message,
                type: 'error',
            });
        }

        return;
    }

    // 日期时间校验
    const validateDdteInputResult = validateDateInput(
        form.planFinishDate,
        form.planFinishDateTime,
    );
    if (!validateDdteInputResult.isValid) {
        if (isMobileDevice) {
            showFailToast(validateDdteInputResult.message);
        } else {
            ElMessage({
                message: validateDdteInputResult.message,
                type: 'error',
            });
        }
        return;
    }

    // 当有选择日期时间的时候
    if (form.planFinishDate && form.planFinishDateTime) {
        form.planFinishDate = getFormattedDate(
            form.planFinishDate,
            form.planFinishDateTime,
        );
    } else {
        form.planFinishDate = null;
    }

    // console.log('更新的form ===', form);
    try {
        // 打开禁止编辑表单
        isSubmitting.value = true;

        const response = await useUpdateTask.fetchUpdateTaskAction({
            taskDescription: form.taskDescription,
            projectId: form.projectId,
            taskTypeId: form.taskTypeId,
            planFinishHour: form.planFinishHour,
            planFinishDate: form.planFinishDate,
            applyAuditId: form.applyAuditId,
            // 选择的数据id
            id: chooseModifyId.value || mobileUpdateCurrentId.value,
        });

        if (response && response.code === 200) {
            // 移动端弹出框

            // 提示新建完成
            showSuccessMessage(`任务申请修改成功。`);

            getEmployeeTasList(); // 重新获取数据
            dialogFormVisible.value = false;
            showMobileUpdataDialog.value = false;
            // 成功后关闭禁止编辑表单
            isSubmitting.value = false;
        } else {
            showFailMessage(`任务申请修改失败，${response.message}`);
            isSubmitting.value = false;
        }
    } catch (error) {
        console.log('error ===', error);
        // 取消弹出框
        dialogFormVisible.value = false;
        showFailMessage(`任务申请修改失败，${error}`);
    }
}
/********************************\
 * 修改防抖处理
\********************************/
const debounceUpdateTaskFun = debounce(updateTaskFun, 600);
/********************************\
 * 删除防抖处理
\********************************/
const debounceDeleteTaskFun = debounce(deleteTaskFun, 600);
/********************************\
 * 弹出删除提示框
\********************************/
const showDeleteDialog = ref(false);
const chooseDeleteId = ref(null);
function showDeleteDialogFun(currentId) {
    showDeleteDialog.value = true;
    chooseDeleteId.value = currentId;
}

/********************************\
 * 假删除
\********************************/
async function deleteTaskFun() {
    const type = 1;
    const response = await deleteTask.fetchDeleteTaskAction({
        currentId: chooseDeleteId.value,
        // 直接多传递一个type
        type,
    });

    // console.log('删除的 response ===', response);
    if (response && response.code === 200) {
        // 清除对话框
        showDeleteDialog.value = false;
        // 提示新建完成
        showSuccessMessage('任务申请删除成功。');
        getEmployeeTasList(); // 重新获取数据
    } else {
        showFailMessage(`任务申请删除失败，${response.message}`);
    }
}

/********************************\
 * 单元格修改公共逻辑(获取选择行的id)
\********************************/
const prevValue = ref({});
const xTable = ref(null);
const oldValue = ref(null);
// 单元格获得焦点时调用
function handleCellActivated({ row, column }) {
    // 调用参数
    // 调用用户权限项目接口
    getUserProjectList();
    // 调用获取任务类型接口
    getTaskTypeList();
    // 调用审批人接口
    getAuditUserList();
    // todo(20231101)
    // 单个修改计划完成时间选择
    getPlanFinishList();

    prevValue.value = row.id;
    // console.log('当前行 prevValue.value ===', prevValue.value);

    if (column.property === 'taskDescription') {
        oldValue.value = row.taskDescription;
    } else if (column.property === 'planFinishHour') {
        oldValue.value = row.planFinishHour;
    } else if (column.property === 'planFinishDate') {
        oldValue.value = row.planFinishDate;
    }
}
// 单元格失去焦点时调用
function handleCellClosed({ row, column }) {
    // console.log('row,column ===', row, column);

    if (column.property === 'taskDescription') {
        // 值没改变时，不需要进行修改
        if (oldValue.value !== row.taskDescription) {
            singleUpdateDescription(row);
        }
    } else if (column.property === 'planFinishDate') {
        // 值没改变时，不需要进行修改
        if (oldValue.value !== row.planFinishDate) {
            singleUpdatePlanFinishDate(row);
        }
    }
}

/********************************\
 * 选项方式修改
\********************************/
// 项目名称单个修改
async function singleUpdateProjectId(row) {
    try {
        // console.log('项目ID已更改为:', row.projectId);
        // 如果需要，你可以在这里调用其他函数或更新其他数据
        const response =
            await singleUpdateProjectIdStore.fetchSUProjectIdAction({
                pProjectId: row.projectId,
                pTaskApplyId: prevValue.value,
            });

        if (response && response.code === 200) {
            ElMessage({
                message: '项目名称修改成功',
                type: 'success',
            });
        } else {
            ElMessage({
                message: response.message,
                type: 'error',
            });
        }
        // 清除活动单元格的状态
        // xTable.value.clearActived();
    } catch (error) {
        console.log('error ===', error);
        ElMessage({
            message: '修改项目名称失败',
        });
    }
}

// 任务类型单元格修改
async function singleUpdateTaskTypeId(row) {
    try {
        // console.log('项目ID已更改为:', row.taskTypeId);
        // 如果需要，你可以在这里调用其他函数或更新其他数据
        const response =
            await singleUpdateTaskTypeIdStore.fetchSUTaskTypeIdAction({
                pTaskTypeId: row.taskTypeId,
                pTaskApplyId: prevValue.value,
            });

        if (response && response.code === 200) {
            ElMessage({
                message: '任务类型修改成功',
                type: 'success',
            });
        } else {
            ElMessage({
                message: response.message,
                type: 'error',
            });
        }
        // 清除活动单元格的状态
        // xTable.value.clearActived();
    } catch (error) {
        console.log('error ===', error);
        ElMessage({
            message: '任务类型修改失败',
        });
    }
}

// 审批人单元格修改
async function singleUpdateAuditId(row) {
    try {
        // console.log('项目ID已更改为:', row.applyAuditId);
        // 如果需要，你可以在这里调用其他函数或更新其他数据
        const response = await singleUpdateAuditIdStore.fetchSUAuditIdAction({
            pApplyAuditId: row.applyAuditId,
            pTaskApplyId: prevValue.value,
        });

        if (response && response.code === 200) {
            ElMessage({
                message: '修改审批人成功',
                type: 'success',
            });
        } else {
            ElMessage({
                message: response.message,
                type: 'error',
            });
        }
        // 清除活动单元格的状态
        // xTable.value.clearActived();
    } catch (error) {
        console.log('error ===', error);
        ElMessage({
            message: '审批人修改失败',
        });
    }
}

// 任务描述单元格修改
async function singleUpdateDescription(row) {
    // 存储修改前的描述信息
    const originalTaskDescription = row.taskDescription;
    // 任务描述验证
    const validateDescriptionInputResult = validateDescriptionInput(
        row.taskDescription,
    );
    if (!validateDescriptionInputResult.isValid) {
        ElMessage({
            message: validateDescriptionInputResult.message,
            type: 'error',
        });
        // 如果修改失败，重置任务描述为原始的任务描述
        // todo 这里修改的数据就不应该拿页面中的状态来定义，应该使用的是pinia的数据来确定 20230919
        // row.taskDescription = originalTaskDescription;
        // 暂时的方法，再调用一次获取列表
        getEmployeeTasList();

        return;
    }
    try {
        // console.log('项目ID已更改为:', row.taskDescription);
        // 如果需要，你可以在这里调用其他函数或更新其他数据
        const response =
            await singleUpdateDescriptionStore.fetchSUDescriptionAction({
                pTaskDescription: row.taskDescription,
                pTaskApplyId: prevValue.value,
            });

        if (response && response.code === 200) {
            ElMessage({
                message: '任务描述修改成功',
                type: 'success',
            });
        } else {
            // 如果修改失败，重置任务描述为原始的任务描述
            row.taskDescription = originalTaskDescription;
            ElMessage({
                message: response.message,
                type: 'error',
            });
        }
        // 清除活动单元格的状态
        // xTable.value.clearActived();
    } catch (error) {
        console.log('error ===', error);
        // 如果修改失败，重置任务描述为原始的任务描述
        row.taskDescription = originalTaskDescription;
        // 修改为空时，表格会显示为空，但我希望的是，表格还是原来的数据
        ElMessage({
            message: '任务描述修改失败',
            type: 'error',
        });
    }
}

// 计划完成小时数单元格修改
async function singleUpdatePlanFinishHour(row) {
    // console.log('项目ID已更改为:', row.planFinishHour);
    // console.log('计划完成小时数row ===', row);
    // 如果需要，你可以在这里调用其他函数或更新其他数据
    try {
        const response =
            await singleUpdatePlanFinishHourStore.fetchSUPlanFinishHourAction({
                pPlanFinishHour: row.planFinishHour,
                pTaskApplyId: prevValue.value,
            });

        if (response && response.code === 200) {
            ElMessage({
                message: '计划完成小时数修改成功',
                type: 'success',
            });
        } else {
            ElMessage({
                message: response.message,
                type: 'error',
            });
        }
    } catch (error) {
        showFailMessage(error);
    }
    // 清除活动单元格的状态
    // xTable.value.clearActived();
}

// 计划完成日期单元格修改
const singleUpdateFinishDate = ref('');
async function singleUpdatePlanFinishDate(row) {
    // todo 日历组件的统一，日期的选择问题 20230919
    // todo 数据更新的方式是修改错误了，直接把之前存储的数据返回展示，而不是现在的重新获取

    const selectedDay = row.planFinishDate;
    // console.log('selectedDay ===', selectedDay);
    const today = getFormattedDateTwo(new Date());
    // console.log('today ===', today);
    // todo 数据不变，不更改时，不需要更新的问题 20230919
    if (selectedDay < today) {
        getEmployeeTasList();
        ElMessage({
            message: `请选择大于${today}的计划完成日期`,
            type: 'error',
        });
        return;
    }

    try {
        console.log('选择的日期', singleUpdateFinishDate);
        // 如果需要，你可以在这里调用其他函数或更新其他数据
        const response =
            await singleUpdatePlanFinishDateStore.fetchSUPlanFinishDateAction({
                pPlanFinishDate: row.planFinishDate,
                pTaskApplyId: prevValue.value,
            });

        if (response && response.code === 200) {
            // getEmployeeTasList();
            ElMessage({
                message: '计划完成日期修改成功',
                type: 'success',
            });
        } else {
            getEmployeeTasList();
            ElMessage({
                message: response.message,
                type: 'error',
            });
        }
        // 清除活动单元格的状态
        // xTable.value.clearActived();
    } catch (error) {
        console.log('error ===', error);
        getEmployeeTasList();
        ElMessage({
            message: '计划完成日期修改失败',
            type: 'error',
        });
    }
}

/********************************\
 * 完整显示1000字符
\********************************/
const dialogWidth = computed(() => {
    return form.taskDescription.length > 500 ? '80%' : '50%';
});

/********************************\
 * 同步清空日期和时间
\********************************/
const handleDateClose = () => {
    if (!form.planFinishDate) {
        form.planFinishDateTime = '';
    }
};

const handleDateTimeClose = () => {
    if (!form.planFinishDateTime) {
        form.planFinishDate = '';
    }
};

/********************************\
 * 触发单元格编辑时,获取对应权限
\********************************/

/********************************\
 * 处理单元格激活编辑状态(双击之后，自动获取焦点//todo)
\********************************/

/********************************\
 * 修改方式之二；先单击选中，后回车-修改(//todo)
\********************************/

/********************************\
 * 时间传递（自定义事件）
\********************************/

/********************************\
 * 处理提交之后网络延迟可以继续修改表单问题
\********************************/
const isSubmitting = ref(false);

const closeUpdateDialog = () => {
    isSubmitting.value = false;
    // 取消更新的时候，清空form
    resetFormDate();
};

/********************************\
 *
 * 移动端移动端移动端移动端
 *
\********************************/
const goBack = () => {
    router.push({ path: '/mobileexplore' });
};

/********************************\
 * 移动端修改补全函数
\********************************/
const showMobileUpdataDialog = ref(false);
const mobileUpdateCurrentId = ref();

const vantForm = reactive({
    vantApplyAuditName: '',
    vantProjectName: '',
    vantTaskTypeName: '',
    vanPlanHourName: '',
});
// 补全数据
const showMobileUpdataDialogBtn = (currentId) => {
    showMobileUpdataDialog.value = true;
    mobileUpdateCurrentId.value = currentId;

    // 调用用户权限项目接口
    getUserProjectList();
    // 调用获取任务类型接口
    getTaskTypeList();
    // 调用审批人接口
    getAuditUserList();
    // 计划完成小时数
    getPlanFinishList();
    // 将已有数据填写到表单中
    // todo
    const selectedItem = employeeTaskList.value.find(
        (item) => item.id === mobileUpdateCurrentId.value,
    );

    if (selectedItem) {
        // 时间显示处理
        form.planFinishDateTime = getFormattedDateThree(
            selectedItem.planFinishDate,
        );
        form.taskDescription = selectedItem.taskDescription;
        form.planFinishHour = selectedItem.planFinishHour;
        form.planFinishDate = getFormattedDateTwo(selectedItem.planFinishDate);
        form.projectId = selectedItem.projectId; // 项目ID
        form.taskTypeId = selectedItem.taskTypeId; // 任务类别ID
        form.applyAuditId = selectedItem.applyAuditId; // 审批人ID

        // vant 真的麻烦
        vantForm.vantApplyAuditName = selectedItem.applyAuditName;
        vantForm.vantProjectName = selectedItem.projectName;
        vantForm.vantTaskTypeName = selectedItem.taskTypeName;
        vantForm.vanPlanHourName = selectedItem.planFinishHour;
    }
};
/********************************\
 * <van-picker>格式化
\********************************/
const vantAuditUserList = computed(() => {
    return auditUserList.value.map((user) => ({
        text: user.nameEN,
        value: user.id,
    }));
});

const vantProjectList = computed(() => {
    return projectList.value.map((project) => ({
        text: project.name,
        value: project.id,
    }));
});

const vantTaskTypeList = computed(() => {
    return taskTypeList.value.map((taskType) => ({
        text: taskType.name,
        value: taskType.id,
    }));
});

const vantPlanHourList = computed(() => {
    return planFinishHourList.value.map((planHour) => ({
        text: planHour.taskPoints,
        value: planHour.taskPoints,
    }));
});

/********************************\
 * 获取表单数据
\********************************/
const showAuditPicker = ref(false);
const showProjectPicker = ref(false);
const showTaskTypePicker = ref(false);
const showPlanDatePicker = ref(false);
const showPlanDateTimePicker = ref(false);
const showPlanHourPicker = ref(false);

// 审批人获取
const onAuditConfirm = ({ selectedOptions }) => {
    showAuditPicker.value = false;
    form.applyAuditId = selectedOptions[0].value;
    vantForm.vantApplyAuditName = selectedOptions[0].text;
};
// 项目名称获取
const onProjectConfirm = ({ selectedOptions }) => {
    showProjectPicker.value = false;
    form.projectId = selectedOptions[0].value;
    vantForm.vantProjectName = selectedOptions[0].text;
};
// 任务类型
const onTaskTypeConfirm = ({ selectedOptions }) => {
    showTaskTypePicker.value = false;
    form.taskTypeId = selectedOptions[0].value;
    vantForm.vantTaskTypeName = selectedOptions[0].text;
};
// 计划完成小时数获取
const onPlanHourConfirm = ({ selectedOptions }) => {
    showPlanHourPicker.value = false;
    form.planFinishHour = selectedOptions[0].value;
    vantForm.vanPlanHourName = selectedOptions[0].text;
};
// 日期选择
const onPlanDateConfirm = (date) => {
    showPlanDatePicker.value = false;
    form.planFinishDate = getFormattedDateTwo(date);
};
// 完成日期小时
const onPlanDateTimeConfirm = (data) => {
    showPlanDateTimePicker.value = false;
    console.log('小时value ===', data.selectedValues);
    const formattedTime = data.selectedValues.join(':');

    form.planFinishDateTime = formattedTime;
};
// 小时选择
const filter = (type, options) => {
    if (type === 'hour') {
        return options.filter(
            (option) => Number(option.value) >= 9 && Number(option.value) <= 18,
        );
    }
    if (type === 'minute') {
        options = options.filter((option) => Number(option.value) % 30 === 0);
    }
    return options;
};

/********************************\
 * 移动端弹出删除提示框
\********************************/
const showMobileDeleteDialog = ref(false);
const mobileDeleteCurrentId = ref(null);
function showMobileDeleteDialogBtn(currentId) {
    showMobileDeleteDialog.value = true;
    mobileDeleteCurrentId.value = currentId;
}

/********************************\
 * 移动端假删除
\********************************/
async function mobileDeleteTaskFun() {
    const type = 1;
    const response = await deleteTask.fetchDeleteTaskAction({
        currentId: mobileDeleteCurrentId.value,
        // 直接多传递一个type
        type,
    });

    // console.log('删除的 response ===', response);
    if (response && response.code === 200) {
        // 清除对话框
        showMobileDeleteDialog.value = false;
        // 提示新建完成
        showSuccessMessage('任务删除成功');
        getEmployeeTasList(); // 重新获取数据
    } else {
        // 可以添加其他的错误处理逻辑
        // console.log('出错了');
        showFailMessage(response.message);
    }
}

/********************************\
 * 弹出层处理（修改）
\********************************/
const handleUpdateBeforeClose = async (action) => {
    if (action === 'confirm') {
        await debounceUpdateTaskFun();
    } else {
        showMobileUpdataDialog.value = false;
    }
};

/********************************\
 * 日期时间同时修改
\********************************/
const clearDate = () => {
    form.planFinishDate = '';
    form.planFinishDateTime = '';
};

/********************************\
 * 链接复制
\********************************/

const handleCopyLink = (id) => {
    copyLink(id);
};
</script>

<template>
    <!-- pc页面 -->
    <div
        class="apply_container"
        v-if="authorityList.includes('WEB_TaskApply') && !isMobileDevice"
    >
        <div class="apply-box">
            <!-- 创建按钮 -->
            <create-task></create-task>

            <!-- vxe 表格 -->
            <div class="apply-content">
                <vxe-table
                    border
                    header-align="center"
                    :show-overflow="false"
                    max-height="520px"
                    :data="employeeTaskList"
                    :column-config="{ resizable: true, useKey: 'field' }"
                    :edit-config="{ trigger: 'click', mode: 'cell' }"
                    :row-config="{ useKey: 'id' }"
                    :scroll-y="{ enabled: false }"
                    round
                    @edit-actived="handleCellActivated"
                    @edit-closed="handleCellClosed"
                    :cell-config="{ selected: true }"
                    @cell-click="handleCellClick"
                    ref="xTable"
                    class="table"
                >
                    <!-- 项目名称 -->
                    <vxe-column
                        field="projectName"
                        title="项目名称"
                        :edit-render="{}"
                        width="100px"
                        header-align="center"
                        align="left"
                    >
                        <template #default="{ row }">
                            <span>
                                {{
                                    projectNameMap[row.projectId] ||
                                    row.projectName
                                }}
                            </span>
                        </template>
                        <template #edit="{ row }">
                            <vxe-select
                                v-model="row.projectId"
                                type="text"
                                transfer
                                @change="singleUpdateProjectId(row)"
                            >
                                <vxe-option
                                    v-for="project in projectList"
                                    :key="project.id"
                                    :label="project.name"
                                    :value="project.id"
                                />
                            </vxe-select>
                        </template>
                    </vxe-column>
                    <!-- 项目类型 -->
                    <vxe-column
                        field="taskTypeName"
                        title="任务类型"
                        :edit-render="{}"
                        width="100px"
                        header-align="center"
                        align="left"
                    >
                        <template #default="{ row }">
                            {{
                                row.taskTypeName || taskTypeMap[row.taskTypeId]
                            }}
                        </template>
                        <template #edit="{ row }">
                            <vxe-select
                                v-model="row.taskTypeId"
                                type="text"
                                transfer
                                @change="singleUpdateTaskTypeId(row)"
                            >
                                <vxe-option
                                    v-for="tasktype in taskTypeList"
                                    :key="tasktype.id"
                                    :label="tasktype.name"
                                    :value="tasktype.id"
                                ></vxe-option>
                            </vxe-select>
                        </template>
                    </vxe-column>
                    <!-- 项目描述 -->
                    <vxe-column
                        field="taskDescription"
                        title="任务描述"
                        min-width="250px"
                        header-align="center"
                        align="left"
                        class="wrap-content"
                    >
                        <template #edit="{ row }">
                            <vxe-input
                                v-model="row.taskDescription"
                                type="textarea"
                            ></vxe-input>
                        </template>
                    </vxe-column>
                    <!-- 计划完成小时数 -->
                    <vxe-column
                        field="planFinishHour"
                        title="计划完成小时数"
                        :edit-render="{}"
                        width="140px"
                        header-align="center"
                        align="right"
                    >
                        <!-- 显示 -->
                        <template #default="{ row }">
                            {{ row.planFinishHour }}
                        </template>

                        <!-- 单独编辑（todo-20231101） -->
                        <template #edit="{ row }">
                            <vxe-select
                                v-model="row.planFinishHour"
                                type="text"
                                transfer
                                @change="singleUpdatePlanFinishHour(row)"
                            >
                                <vxe-option
                                    v-for="planHour in planFinishHourList"
                                    :key="planHour.id"
                                    :label="planHour.taskPoints"
                                    :value="planHour.taskPoints"
                                ></vxe-option>
                            </vxe-select>
                        </template>
                    </vxe-column>
                    <!-- 计划完成日期 -->
                    <vxe-column
                        field="planFinishDate"
                        title="计划完成日期"
                        width="130px"
                        header-align="center"
                        align="center"
                    >
                        <template #default="{ row }">
                            {{ getFormattedDateTwo(row.planFinishDate) }}
                        </template>
                        <!-- todo 表单数据的更改都应该用的store中持久化的数据，
                    而不是ref中的数据 这里v-module绑定的数据就有问题 20230919 -->
                        <template #edit="{ row }">
                            <vxe-input
                                v-model="row.planFinishDate"
                                type="date"
                                placeholder="请选择计划完成日期"
                                transfer
                                :min-date="minDate"
                            ></vxe-input>
                            <!-- <el-date-picker
                            v-model="form.planFinishDate"
                            type="date"
                            placeholder="选择计划完成日期"
                            style="width: 100%"
                            :disabledDate="disabledPreviousDates"
                        /> -->
                        </template>
                    </vxe-column>
                    <!-- 审批人 -->
                    <vxe-column
                        field="applyAuditName"
                        title="审批人"
                        :edit-render="{}"
                        width="100px"
                        header-align="center"
                        align="center"
                    >
                        <template #default="{ row }">
                            {{
                                auditUserMap[row.applyAuditId] ||
                                row.applyAuditName
                            }}
                        </template>
                        <template #edit="{ row }">
                            <vxe-select
                                v-model="row.applyAuditId"
                                type="text"
                                transfer
                                @change="singleUpdateAuditId(row)"
                            >
                                <vxe-option
                                    v-for="audit in auditUserList"
                                    :key="audit.id"
                                    :label="audit.nameEN"
                                    :value="audit.id"
                                ></vxe-option>
                            </vxe-select>
                        </template>
                    </vxe-column>
                    <!-- 操作 -->
                    <vxe-column
                        field="operate"
                        title="操作"
                        width="220px"
                        header-align="center"
                        align="center"
                    >
                        <template #default="{ row }">
                            <button
                                @click="handleCopyLink(row.id)"
                                class="copyLink"
                            >
                                复制链接
                            </button>
                            <button
                                @click="dialogFormVisibleFun(row.id)"
                                class="update"
                            >
                                修改
                            </button>
                            <button
                                @click="showDeleteDialogFun(row.id)"
                                class="delete"
                            >
                                删除
                            </button>
                        </template>
                    </vxe-column>
                </vxe-table>
            </div>
        </div>

        <!-- 修改的弹出框 -->
        <el-dialog
            v-model="dialogFormVisible"
            title="任务申请修改"
            modal="true"
            :width="dialogWidth"
            @close="closeUpdateDialog"
        >
            <el-form :model="form" :disabled="isSubmitting">
                <!-- 项目ID-选择框 -->
                <el-form-item
                    label="项目名称"
                    prop="projectId"
                    :label-width="formLabelWidth"
                >
                    <el-select
                        placeholder="请选择项目"
                        v-model="form.projectId"
                    >
                        <el-option
                            v-for="project in projectList"
                            :key="project.id"
                            :label="project.name"
                            :value="project.id"
                        />
                    </el-select>
                </el-form-item>
                <!-- 任务类别ID-选择框 -->
                <el-form-item
                    label="任务类型"
                    prop="auditUser"
                    :label-width="formLabelWidth"
                >
                    <el-select
                        placeholder="请选择任务类型"
                        v-model="form.taskTypeId"
                    >
                        <el-option
                            v-for="taskType in taskTypeList"
                            :key="taskType.id"
                            :label="taskType.name"
                            :value="taskType.id"
                        />
                    </el-select>
                </el-form-item>
                <!-- 审批人ID-选择框 -->
                <el-form-item
                    label="审批人"
                    prop="auditUser"
                    :label-width="formLabelWidth"
                >
                    <el-select
                        placeholder="请选择审批人"
                        v-model="form.applyAuditId"
                    >
                        <el-option
                            v-for="auditUser in auditUserList"
                            :key="auditUser.id"
                            :label="auditUser.nameEN"
                            :value="auditUser.id"
                        />
                    </el-select>
                </el-form-item>
                <!-- 计划完成小时数 -->
                <el-form-item
                    label="计划完成小时数"
                    prop="name"
                    :label-width="formLabelWidth"
                >
                    <el-select
                        placeholder="请选择计划完成小时数"
                        v-model="form.planFinishHour"
                    >
                        <el-option
                            v-for="auditUser in planFinishHourList"
                            :key="auditUser.id"
                            :label="auditUser.taskPoints"
                            :value="auditUser.taskPoints"
                        />
                    </el-select>
                </el-form-item>
                <!-- 计划完成日期 -->
                <el-form-item
                    label="计划完成日期"
                    :label-width="formLabelWidth"
                >
                    <el-col :span="11">
                        <el-date-picker
                            v-model="form.planFinishDate"
                            type="date"
                            placeholder="选择计划完成日期"
                            style="width: 100%"
                            :disabledDate="disabledPreviousDates"
                            @change="handleDateClose"
                        />
                    </el-col>
                    <el-col :span="2" style="text-align: center">-</el-col>
                    <el-col :span="11">
                        <!-- <hour-and-min-select
                            :selected-time="form.planFinishDate"
                            @update-time="handleTimeUpdate"
                        ></hour-and-min-select> -->
                        <el-time-select
                            style="width: 100%"
                            v-model="form.planFinishDateTime"
                            start="09:00"
                            step="00:30"
                            end="18:00"
                            placeholder="请选择时间"
                            @change="handleDateTimeClose"
                        ></el-time-select>
                    </el-col>
                </el-form-item>
                <!-- 任务描述 -->
                <el-form-item
                    label="任务说明"
                    prop="desc"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        type="textarea"
                        v-model="form.taskDescription"
                        :autosize="{ minRows: 2, maxRows: 10 }"
                        :maxlength="1000"
                        placeholder="请填写任务说明"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button
                        @click="dialogFormVisible = false"
                        class="btn-cancel"
                    >
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="debounceUpdateTaskFun"
                        class="btn-sure"
                    >
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 确定删除提示框 -->
        <el-dialog v-model="showDeleteDialog" title="任务申请删除">
            请确定是否删除任务申请？
            <template #footer>
                <span class="dialog-footer">
                    <el-button
                        @click="showDeleteDialog = false"
                        class="btn-cancel"
                    >
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="debounceDeleteTaskFun"
                        class="btn-sure"
                    >
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>

    <!-- 无权限提示 -->
    <div class="no-premission" v-if="!authorityList.includes('WEB_TaskApply')">
        您还不具备该权限！
    </div>

    <!-- 移动设备 -->
    <div
        class="mobile-container"
        v-if="authorityList.includes('WEB_TaskApply') && isMobileDevice"
    >
        <!-- 返回操作 -->

        <!-- <van-nav-bar -->
        <!-- title="任务申请" left-text="返回" left-arrow @click-left="goBack" -->
        <!-- > -->
        <!-- <template #right> -->
        <!-- 这样做会出现闪动问题 -->
        <!-- <create-task></create-task> -->
        <!-- </template> -->
        <!-- </van-nav-bar> -->
        <!-- 使用自己的 -->
        <!-- <van-sticky> -->
        <div class="navbar">
            <div class="goback" @click="goBack">
                <van-icon name="arrow-left" />
            </div>
            <div class="title">任务申请</div>
            <div class="createBtn">
                <create-task></create-task>
            </div>
        </div>
        <!-- </van-sticky> -->

        <div class="noData" v-if="employeeTaskList.length == 0 && isDataLoaded">
            暂时没有更多申请任务
        </div>

        <!-- main -->
        <div class="mobile-content">
            <div
                class="mobile-box"
                v-for="task in employeeTaskList"
                :key="task.id"
            >
                <!-- 任务名称 -->
                <div class="mobile-taskName item-box">
                    <div class="taskCard-item">项目名称</div>
                    <div class="taskCard-content">{{ task.projectName }}</div>
                </div>
                <!-- 任务类型 -->
                <div class="mobile-taskType item-box">
                    <div class="taskCard-item">任务类型</div>
                    <div class="taskCard-content">{{ task.taskTypeName }}</div>
                </div>
                <!-- 申请人 -->
                <div class="mobile-employee item-box">
                    <div class="taskCard-item">审批人</div>
                    <div class="taskCard-content">
                        {{ task.applyAuditName }}
                    </div>
                </div>

                <!-- 计划完成时间 -->
                <div class="mobile-planFinishHour item-box">
                    <div class="taskCard-item">计划完成小时数</div>
                    <div class="taskCard-content">
                        {{ task.planFinishHour }}
                    </div>
                </div>
                <!-- 计划完成日期 -->
                <div class="mobile-planFinishDate item-box">
                    <div class="taskCard-item">计划完成日期</div>
                    <div class="taskCard-content">
                        {{ task.planFinishDate }}
                    </div>
                </div>
                <!-- 任务描述 -->
                <div class="mobile-description item-box">
                    <div class="taskCard-item">任务说明</div>
                    <div style="margin-bottom: 10px" class="taskCard-content">
                        {{ task.taskDescription }}
                    </div>
                </div>

                <!-- <van-cell title="单元格" value="task.taskDescription" /> -->

                <!-- 操作 -->
                <div class="operate-box">
                    <div
                        class="mobile-copy operate"
                        @click="handleCopyLink(task.id)"
                    >
                        <van-icon name="link-o" />
                        复制链接
                    </div>
                    <div
                        class="mobile-update operate"
                        @click="showMobileUpdataDialogBtn(task.id)"
                    >
                        <van-icon name="edit" />
                        修改
                    </div>
                    <div
                        class="mobile-delete operate"
                        @click="showMobileDeleteDialogBtn(task.id)"
                    >
                        <van-icon name="delete-o" />
                        删除
                    </div>
                </div>
            </div>
        </div>

        <!-- 修改弹出框 -->
        <van-dialog
            v-model:show="showMobileUpdataDialog"
            title="任务申请修改"
            show-cancel-button
            @cancel="closeUpdateDialog"
            :before-close="handleUpdateBeforeClose"
            :close-on-click-overlay="true"
        >
            <van-form :disabled="isSubmitting">
                <!-- 项目名称 -->
                <van-field
                    is-link
                    readonly
                    v-model="vantForm.vantProjectName"
                    label="项目名称"
                    placeholder="请选择项目"
                    @click="showProjectPicker = true"
                    label-width="100px"
                ></van-field>

                <!-- 任务类型 -->
                <van-field
                    is-link
                    readonly
                    v-model="vantForm.vantTaskTypeName"
                    label="任务类型"
                    placeholder="请选择任务类型"
                    @click="showTaskTypePicker = true"
                    label-width="100px"
                ></van-field>
                <!-- 审批人 -->
                <van-field
                    is-link
                    readonly
                    v-model="vantForm.vantApplyAuditName"
                    label="审批人"
                    placeholder="请选择审批人"
                    @click="showAuditPicker = true"
                    label-width="100px"
                ></van-field>

                <!-- 计划完成小时数 -->
                <van-field
                    is-link
                    readonly
                    label="计划完成小时数"
                    v-model="vantForm.vanPlanHourName"
                    placeholder="请选择计划完成小时数"
                    @click="showPlanHourPicker = true"
                    label-width="100px"
                ></van-field>

                <!-- 计划完成日期 -->
                <van-cell
                    :value="form.planFinishDate"
                    title="计划完成日期"
                    placeholder="请选择计划完成日期"
                    @click="showPlanDatePicker = true"
                >
                    <template #right-icon>
                        <van-icon
                            name="close"
                            class="close-icon"
                            @click.stop="clearDate"
                            :style="{
                                display: form.planFinishDate ? 'block' : 'none',
                            }"
                        />
                    </template>
                </van-cell>
                <!-- 计划完成时间 -->
                <van-cell
                    :value="form.planFinishDateTime"
                    placeholder="请选择计划完成时间"
                    title="计划完成时间"
                    @click="showPlanDateTimePicker = true"
                >
                    <template #right-icon>
                        <van-icon
                            name="close"
                            class="close-icon"
                            @click.stop="clearDate"
                            :style="{
                                display: form.planFinishDateTime
                                    ? 'block'
                                    : 'none',
                            }"
                        />
                    </template>
                </van-cell>

                <!-- 任务描述 -->
                <van-field
                    label="任务说明"
                    v-model="form.taskDescription"
                    placeholder="请填写任务说明"
                    label-width="100px"
                ></van-field>
            </van-form>
        </van-dialog>

        <!------------------------ >
        ||在最顶部显示弹出层 
        <-------------------------->
        <!-- 计划完成小时数 -->
        <van-popup v-model:show="showPlanHourPicker" round position="bottom">
            <van-picker
                :columns="vantPlanHourList"
                @cancel="showPlanHourPicker = false"
                @confirm="onPlanHourConfirm"
            />
        </van-popup>

        <!-- 审批人 -->
        <van-popup v-model:show="showAuditPicker" round position="bottom">
            <van-picker
                :columns="vantAuditUserList"
                @cancel="showAuditPicker = false"
                @confirm="onAuditConfirm"
            />
        </van-popup>

        <!-- 项目名称 -->
        <van-popup v-model:show="showProjectPicker" round position="bottom">
            <van-picker
                :columns="vantProjectList"
                @cancel="showProjectPicker = false"
                @confirm="onProjectConfirm"
            />
        </van-popup>

        <!-- 任务类型 -->
        <van-popup v-model:show="showTaskTypePicker" round position="bottom">
            <van-picker
                :columns="vantTaskTypeList"
                @cancel="showTaskTypePicker = false"
                @confirm="onTaskTypeConfirm"
            />
        </van-popup>

        <!-- 完成日期 -->
        <van-calendar
            v-model:show="showPlanDatePicker"
            @confirm="onPlanDateConfirm"
        ></van-calendar>

        <!-- 完成时间 -->
        <van-popup v-model:show="showPlanDateTimePicker" position="bottom">
            <van-time-picker
                title="选择时间"
                @confirm="onPlanDateTimeConfirm"
                :filter="filter"
                @click="showPlanDateTimePicker = false"
            ></van-time-picker>
        </van-popup>

        <!-- 删除弹出框 -->
        <van-dialog
            v-model:show="showMobileDeleteDialog"
            title="任务申请删除"
            show-cancel-button
            @confirm="mobileDeleteTaskFun"
            :close-on-click-overlay="true"
        >
            <div class="delete-content">请确认是否删除任务申请。</div>
        </van-dialog>
    </div>
</template>

<!-- pc端样式 -->
<style scoped lang="scss">
@import '../../assets/css/variables.scss';

.el-dialog__footer {
    text-align: right;
}

.no-premission {
    margin: 100px auto;
    text-align: center;
}

.apply_container {
    // TODO: 添加样式
    width: calc(100vw - 160px);

    .apply-box {
        margin-top: 15px;
        padding-bottom: 15px;
        margin-inline: 16px;
        background-color: #fff;
        border-radius: 2px;
    }
    .table {
        margin: 0 21px 10px 21px;
    }

    .update,
    .delete {
        border: none;
        border-radius: 2px;
        width: 54px;
        height: 26px;
    }

    .copyLink {
        border: none;
        border-radius: 2px;
        background-color: #fff0eb;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ff6b3b;
        padding: 3px 10px;
    }

    .update {
        background-color: #c6eddc;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #13b75c;
    }

    .delete {
        background-color: #ffecec;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #e41731;
    }

    .copyLink:hover {
        background-color: #ff6b3b;
        color: #fff;
        cursor: pointer;
    }

    .update:hover {
        color: #fff;
        background-color: #04c18c;
        cursor: pointer;
    }

    .delete:hover {
        color: #fff;
        background-color: #ed5b5d;
        cursor: pointer;
    }

    .update {
        margin: 0 11px;
    }

    // 对话框按钮样式
    .el-button.btn-cancel {
        width: 64px;
        height: 26px;
        background: #f3f4f9;
        border-radius: 2px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
        border: none;
    }

    .el-button.btn-cancel:hover {
        color: #666666;
        background: #ffffff;
        // border: none;
        border: 1px solid #e3eeff;
    }

    .btn-sure {
        width: 64px;
        height: 26px;
        background: #1768e4;
        border-radius: 2px;
        border: none;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
    }

    .btn-sure:hover {
        background: #2b8aec;
        color: #ffffff;
    }

    // 对话框右上角取消btn
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
        color: $color-bfont;
    }
}
</style>

<!-- 移动端样式 -->
<style scoped lang="scss">
.mobile-container {
    background-color: #f3f7ff;
    .navbar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 15px 18px 10px 18px;
        background-color: #fff;
    }

    .delete-content {
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 10px;
        // text-align: center;
    }
}

.noData {
    margin: 150px auto;
    text-align: center;
}

.mobile-content {
    width: auto;
    margin: 18px 16px 0px 16px;
    border-radius: 16px;
    padding-bottom: 20px;
}

.mobile-box {
    margin-bottom: 20px;
    background-color: #fff;
    padding: 12px 15px 0px 15px;
    border-radius: 16px;
}
.item-box {
    display: flex;
    width: 100%;
}

.item-box :not(:last-child) {
    margin-bottom: 10px;
}

// taskCard-item的宽度控制
.taskCard-item {
    // width: 100%;
    min-width: 120px;
    color: #333;
}
.taskCard-content {
    color: #666;
    width: 100%;
    height: auto;
    word-wrap: break-word;
    word-break: break-all;
}

.mobile-description {
    border-bottom: 1px solid #d7d7d7;
}

.operate-box {
    display: flex;
    justify-content: flex-end;
    flex-direction: flex-end;
    margin: 5px 10px;
}

.operate {
    color: #666;
    padding: 4px 5px;
    margin-bottom: 2px;
}

.mobile-delete {
    margin-left: 5px;
}

.close-icon {
    font-size: 16px;
    line-height: inherit;
    padding: 0 10px;
    color: #666;
}
</style>
