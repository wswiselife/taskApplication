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
} from '@/utils/format/formatDate';
import { disabledPreviousDates } from '@/utils/limit/limitDateSelect';
// 任务描述验证
import { validateDescriptionInput } from '@/utils/validate/validateDescript';
// 创建按钮
import CreateTask from '@/components/create-task/CreateTask.vue';
// 获取store中的userid
import { useUserIdStore } from '@/store/public';
// 导入时间&分钟选择
import HourAndMinSelect from '@/components/hour-min-select/HourAndMinSelect.vue';

/********************************\
 * 获取权限处理
\********************************/
const authorityList = ref([]);
onMounted(() => {
    // 从 localStorage 中获取权限信息
    const storedAuthorityList = localStorage.getItem('authorityList');
    if (storedAuthorityList) {
        authorityList.value = JSON.parse(storedAuthorityList);
    }
});
/********************************\
 * 公共引入处理
\********************************/

onMounted(() => {
    // 进入时获取列表数据
    getEmployeeTasList();
    // 调用用户权限项目接口
    getUserProjectList();
    // 调用获取任务类型接口
    getTaskTypeList();
    // 调用审批人接口
    getAuditUserList();
});

// 修改的选项的权限获取
const userProjectList = useUserProjectListStore();
const useTaskTypeList = useTaskTypeListStore();
const useAuditTypeList = useAuditUserListStore();

// 更新接口数据
const useUpdateTask = useUpdateTaskStore();
// 假删除接口数据
const deleteTask = useDeleteTaskStore();
// 获取用户id
const userIdStore = useUserIdStore();

/********************************\
 * 获取列表数据并渲染
\********************************/
function getEmployeeTasList() {
    employeeTaskStore.fetchEmployeeTaskAction();
    console.log('申请列表数据 ====', employeeTaskList);
}
const employeeTaskStore = useEmployeeTaskStore(); // 列表展示数据
// 这里一定要用storeTorefs,而不是ref // todo
const { employeeTaskList } = storeToRefs(employeeTaskStore);

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

    // 将已有数据填写到表单中
    // todo
    const selectedItem = employeeTaskList.value.find(
        (item) => item.id === chooseModifyId.value,
    );

    if (selectedItem) {
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
 * 点击表格右侧的修改（确定）按钮
\********************************/
async function modify() {
    // 验证小时数
    const validateHoursInputResult = validateHoursInput(form.planFinishHour);
    if (!validateHoursInputResult.isValid) {
        ElMessage({
            message: validateHoursInputResult.message,
            type: 'error',
        });
        return;
    }
    // 验证输入日期
    if (!form.planFinishDate) {
        ElMessage({
            message: '请选择计划完成日期',
            type: 'error',
        });
        return;
    }
    // 任务描述
    const validateDescriptionInputResult = validateDescriptionInput(
        form.taskDescription,
    );
    if (!validateDescriptionInputResult.isValid) {
        ElMessage({
            message: validateDescriptionInputResult.message,
            type: 'error',
        });
        return;
    }
    // 日期格式化
    form.planFinishDate = getFormattedDate(
        form.planFinishDate,
        form.planFinishDateTime,
    );

    try {
        const response = await useUpdateTask.fetchUpdateTaskAction({
            taskDescription: form.taskDescription,
            projectId: form.projectId,
            taskTypeId: form.taskTypeId,
            planFinishHour: form.planFinishHour,
            planFinishDate: form.planFinishDate,
            applyAuditId: form.applyAuditId,
            // 选择的数据id
            id: chooseModifyId.value,
        });

        if (response && response.code === 200) {
            dialogFormVisible.value = false;
            // 提示新建完成
            ElMessage({
                message: '任务修改成功',
                type: 'success',
            });
            getEmployeeTasList(); // 重新获取数据
        } else {
            // 可以添加其他的错误处理逻辑
            ElMessage({
                message: response.message,
                type: 'error',
            });
        }
    } catch (error) {
        console.log('error ===', error);
        // 取消弹出框
        dialogFormVisible.value = false;
        ElMessage({
            message: `任务修改失败。${error}`,
            type: 'error',
        });
    }
}

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
    try {
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
            ElMessage({
                message: '任务删除成功',
                type: 'success',
            });
            getEmployeeTasList(); // 重新获取数据
        } else {
            // 可以添加其他的错误处理逻辑
            // console.log('出错了');
            ElMessage({
                message: response.message,
                type: 'error',
            });
        }
    } catch (error) {
        console.log('error ===', error);
        ElMessage({
            message: '删除失败',
            type: 'error',
        });
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

    prevValue.value = row.id;
    console.log('当前行 prevValue.value ===', prevValue.value);

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
    } else if (column.property === 'planFinishHour') {
        // 值没改变时，不需要进行修改
        if (oldValue.value !== row.planFinishHour) {
            singleUpdatePlanFinishHour(row);
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
    // 验证小时数
    const validateHoursInputResult = validateHoursInput(row.planFinishHour);
    if (!validateHoursInputResult.isValid) {
        ElMessage({
            message: validateHoursInputResult.message,
            type: 'error',
        });
        // 跟上面一致 todo 20230919
        getEmployeeTasList();
        return;
    }
    try {
        // console.log('项目ID已更改为:', row.planFinishHour);
        // 如果需要，你可以在这里调用其他函数或更新其他数据
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
        // 清除活动单元格的状态
        // xTable.value.clearActived();
    } catch (error) {
        console.log('error ===', error);
        ElMessage({
            message: '计划完成小时数修改失败',
            type: 'error',
        });
    }
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
 * 触发单元格编辑时,获取对应权限
\********************************/

/********************************\
 * 处理单元格激活编辑状态(双击之后，自动获取焦点//todo)
\********************************/

/********************************\
 * 修改方式之二；先单击选中，后回车-修改(//todo)
\********************************/
// todo
// function handleCellClick({ row, column }) {
//     console.log('Selected cell:', row, column);
// }
// onMounted(() => {
//     if (xTable.value) {
//         document.addEventListener('keydown', handleKeydown);
//     }
// });
// const xTable = ref(null);
// function handleKeydown (event) {
//     if (event.keyCode === 13) {
//         // 检查是否为回车键
//        console.log('event.keyCode ===', event.keyCode)
//     }
// }
/********************************\
 * 时间传递（自定义事件）
\********************************/
const handleTimeUpdate = (time) => {
    // console.log('Received update-time event with value:', time);
    form.planFinishDateTime = time;
};
</script>

<template>
    <div class="apply_container" v-if="authorityList.includes('WEB_TaskApply')">
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
                                {{ projectNameMap[row.projectId] || '' }}
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
                            {{ taskTypeMap[row.taskTypeId] || '' }}
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
                        <template #edit="{ row }">
                            <vxe-input
                                v-model="row.planFinishHour"
                                type="text"
                            ></vxe-input>
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
                            {{ auditUserMap[row.applyAuditId] || '' }}
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
                        width="180px"
                        header-align="center"
                        align="center"
                    >
                        <template #default="{ row }">
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
        >
            <el-form :model="form">
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
                    <el-input v-model="form.planFinishHour" />
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
                        />
                    </el-col>
                    <el-col :span="2" style="text-align: center">-</el-col>
                    <el-col :span="11">
                        <hour-and-min-select
                            :selected-time="form.planFinishDate"
                            @update-time="handleTimeUpdate"
                        ></hour-and-min-select>
                    </el-col>
                </el-form-item>
                <!-- 任务描述 -->
                <el-form-item
                    label="任务描述"
                    prop="desc"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        type="textarea"
                        v-model="form.taskDescription"
                        :autosize="{ minRows: 2, maxRows: 10 }"
                        :maxlength="1000"
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
                    <el-button type="primary" @click="modify" class="btn-sure">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 确定删除提示框 -->
        <el-dialog v-model="showDeleteDialog" title="任务申请删除">
            确定删除任务申请吗
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
                        @click="deleteTaskFun"
                        class="btn-sure"
                    >
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
    <div class="no-premission" v-else>您还不具备该权限！</div>
</template>

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
    width: 100%;
    // margin: 25px auto;
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
        margin-right: 11px;
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
