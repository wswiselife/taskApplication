<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 16:37:21
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-18 13:53:21
 * @FilePath: \taskApplication\src\views\approvalTask\ApprovalTask.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEmport
-->
<script setup>
import {
    useAuditTaskStore,
    useAgreeTaskStore,
    useDeleteTaskStore,
    usePlanFinishHourStore,
} from '@/store/modules/task';
import { storeToRefs } from 'pinia';
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import {
    getFormattedDate,
    getFormattedDateTwo,
    getFormattedDateThree,
} from '@/utils/format/formatDate';
// import { formatProjectName, formatTaskType } from '@/assets/data/vxeColumnData';
// import { disabledPreviousDates } from '@/utils/limitDateSelect';
import { disabledPreviousDates } from '@/utils/limit/limitDateSelect';
// 小时数校验
import { validateHoursInput } from '@/utils/validate/validateHoursInput';
// 点数校验
import { validatePoint } from '@/utils/validate/validatePoint';

// 导入时间&分钟选择
// import HourAndMinSelect from '@/components/hour-min-select/HourAndMinSelect.vue';
// 防抖处理
import debounce from 'lodash/debounce';
// 设备检测
import { isMobileDevice } from '@/utils/device/isMobile';
// 路由返回
import { useRouter, useRoute } from 'vue-router';
// 移动端返回
const router = useRouter();
const route = useRoute();
// 刷新按钮
import Refresh from '@/components/approval-refresh/refresh.vue';
import {
    showFailMessage,
    showSuccessMessage,
} from '@/utils/show-message/showSFmessage';
// 日期非选
import { validateDateInput } from '@/utils/validate/validateDate';
// 链接审批数据共享
import { useIsLinkApprovalStore } from '@/store/public';

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
    getAuditUserData();
    isDataLoaded.value = true;
});
/********************************\
 * 公共引入处理
 \********************************/
const isDataLoaded = ref(false);
const usePlanFinishHourList = usePlanFinishHourStore();
// 假删除接口数据
const deleteTask = useDeleteTaskStore();

// todo 这里其实是获取申请人的用户的权限，现在可以暂时这么做，但是当表格的数据需要修改的时候，
// 我们就要真正的获取申请人的权限，然后做映射，在表格中显示对应的项目名称、任务类型或申请人
// 申请人可以直接使用

// 链接审批数据共享
const isLinkApprovalStore = useIsLinkApprovalStore();

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
 * 获取审批列表接口
 \********************************/
async function getAuditUserData() {
    await useAuditTaskList.fetchAuditTaskAction();
    // console.log('任务审批 auditTaskList ===', auditTaskList);
}
const useAuditTaskList = useAuditTaskStore();
const { auditTaskList } = storeToRefs(useAuditTaskList);

/********************************\
 * 获取审批同意接口
 \********************************/
const useAgreeTask = useAgreeTaskStore();
const form = reactive({
    point: null,
    chooseAgreeId: null,
    finishDate: '',
    finishDateTime: '',
    finishHour: null,
    taskDescription: '',
});

const onlyShow = reactive({
    employeeName: '',
    projectName: '',
    taskTypeName: '',
});

/********************************\
 * 显示同意按钮
 \********************************/
const showAgreeDialog = ref(false);
// 选择的id
const chooseAgreeId = ref(null);
function showAgreeDialogFun(currentId) {
    // 选择时间获取
    getPlanFinishList();
    chooseAgreeId.value = currentId;
    form.chooseAgreeId = currentId;
    showAgreeDialog.value = true;

    // 获取 auditTaskList 中的完成时间和完成小时数
    const selectedItem = auditTaskList.value.find(
        (item) => item.id === chooseAgreeId.value,
    );
    if (selectedItem) {
        // 更新form对象的值
        form.finishDate = selectedItem.planFinishDate;
        form.finishHour = selectedItem.planFinishHour;
        form.taskDescription = selectedItem.taskDescription;
        form.finishDateTime = getFormattedDateThree(
            selectedItem.planFinishDate,
        );
        // 只需要显示的内容（申请人、项目名称、任务类型）
        onlyShow.employeeName = selectedItem.employeeName;
        onlyShow.projectName = selectedItem.projectName;
        onlyShow.taskTypeName = selectedItem.taskTypeName;
    }
    // console.log('pc的表单form ===', form);
}
/********************************\
 * 清除点数（关闭时、成功时）
 \********************************/
function resetForm() {
    form.point = '';
    // 网络导致的请求失败退出后,处理无法点击问题
    isSubmitting.value = false;
    approvalLoading.value = false;
}

/********************************\
 * 确认同意
 \********************************/
const approvalLoading = ref(false);
async function agreeFun() {
    // vant组件和ele组件差异处理
    if (isLinkApproval.value) {
        form.point = applyLinkForm.point;
        form.finishDate = applyLinkForm.finishDate;
        form.finishDateTime = applyLinkForm.finishDateTime;
        form.finishHour = applyLinkForm.finishHour;
        form.taskDescription = applyLinkForm.taskDescription;
    }
    // console.log('审批共用的校验方法form ===', form);

    // 验证点数
    const validatePointInputResult = validatePoint(form.point);
    if (!validatePointInputResult.isValid) {
        showFailMessage(validatePointInputResult.message);
        return;
    }

    // 日期时间校验
    const validateDateInputResult = validateDateInput(
        form.finishDate,
        form.finishDateTime,
    );
    if (!validateDateInputResult.isValid) {
        showFailMessage(validateDateInputResult.message);
        return;
    }

    // 当有选择日期时间的时候
    if (form.finishDate && form.finishDateTime) {
        form.finishDate = getFormattedDate(
            form.finishDate,
            form.finishDateTime,
        );
    } else {
        form.finishDate = null;
    }

    // 验证小时数
    const validateHoursInputResult = validateHoursInput(form.finishHour);
    if (!validateHoursInputResult.isValid) {
        showFailMessage(validateHoursInputResult.message);
        return;
    }

    // 打开禁止编辑表单
    isSubmitting.value = true;
    if (isLinkApproval.value) {
        form.chooseAgreeId = linkApplyId;
    }

    // 遮罩层控制，禁止点击控制
    approvalLoading.value = true;

    const response = await useAgreeTask.fetchAgreeTaskAction(form);

    if (response.code === 200) {
        // 关闭遮罩层，取消加载效果
        approvalLoading.value = false;
        // 成功后可编辑,用于下次审批任务
        isSubmitting.value = false;
        // 提示成功
        showSuccessMessage(`任务审批成功，任务编号为${response.result.code}。`);
        // 清空输入的点数
        resetForm();
        // 关闭对话框
        showAgreeDialog.value = false;
        showMobileApprovalDialog.value = false;
        // 重新发送请求
        useAuditTaskList.fetchAuditTaskAction();
    } else {
        // 弹出框不关闭
        showAgreeDialog.value = true;
        // 成功后可编辑,用于下次审批任务
        isSubmitting.value = false;
        // 加载效果取消，按钮变为可点击
        approvalLoading.value = false;
        showFailMessage(`任务审批失败，${response.message}`);
    }
}
/********************************\
 * 防抖处理
 \********************************/
const debounceAgreeFun = debounce(agreeFun, 600);
/********************************\
 * 日期选择限制//todo
 \********************************/
/********************************\
 * 完整显示1000字符
 \********************************/
const dialogWidth = computed(() => {
    return form.taskDescription.length > 500 ? '80%' : '50%';
});

/********************************\
 * 时间传递（自定义事件）
 \********************************/
// const handleTimeUpdate = (time) => {
//     // console.log('Received update-time event with value:', time);
//     form.finishDateTime = time;
// };

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
    const type = 2;
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
        // 重新获取数据
        getAuditUserData();
    } else {
        showFailMessage(`任务申请删除失败，${response.message}`);
    }
}
/********************************\
 * 删除防抖处理
 \********************************/
const debounceDeleteTaskFun = debounce(deleteTaskFun, 600);
/********************************\
 * 焦点控制
 \********************************/
const pointRef = ref(null);
const focusInput = () => {
    if (pointRef.value) {
        pointRef.value.focus();
    }
};

/********************************\
 * 刷新控制按钮
 \********************************/
const refreshApplyList = () => {
    getAuditUserData();
    showSuccessMessage('任务审批列表数据已更新');
};

/********************************\
 * 审批日期时间同步问题
 \********************************/
const handleDateClose = () => {
    if (!form.finishDate) {
        form.finishDateTime = '';
    }
    if (!applyLinkForm.finishDate) {
        applyLinkForm.finishDateTime = '';
    }
};

const handleDateTimeClose = () => {
    if (!form.finishDateTime) {
        form.finishDate = '';
    }
    if (!applyLinkForm.finishDateTime) {
        applyLinkForm.finishDate = '';
    }
};
/********************************\
 * 处理提交之后网络延迟可以继续修改表单问题
 \********************************/
const isSubmitting = ref(false);
/********************************\
 * 移动端返回上一步
 \********************************/
const goBack = () => {
    router.push({ path: '/mobileexplore' });
};
/********************************\
 * 移动端修改补全函数
 \********************************/
const showMobileApprovalDialog = ref(false);
const mobileApprovalCurrentId = ref();

// 补全数据
const showMobileApprovalDialogBtn = (currentId) => {
    // 点击打开弹出层
    showMobileApprovalDialog.value = true;
    // 保存所选的任务的id
    mobileApprovalCurrentId.value = currentId;
    // 发送请求时，携带所选择的id
    form.chooseAgreeId = currentId;

    // 将已有数据填写到表单中
    // todo
    const selectedItem = auditTaskList.value.find(
        (item) => item.id === mobileApprovalCurrentId.value,
    );

    if (selectedItem) {
        // 时间显示处理
        form.finishDateTime = getFormattedDateThree(
            selectedItem.planFinishDate,
        );
        form.taskDescription = selectedItem.taskDescription;
        form.finishHour = selectedItem.planFinishHour;
        form.finishDate = getFormattedDateTwo(selectedItem.planFinishDate);

        // 只读属性
        onlyShow.projectName = selectedItem.projectName; // 项目ID
        onlyShow.taskTypeName = selectedItem.taskTypeName; // 任务类别ID
        onlyShow.employeeName = selectedItem.employeeName; // 审批人ID

        // 审批补全（vant的特殊补全机制）
        // 移动端全部审批时需要
        vantForm.vanPlanHourName = selectedItem.planFinishHour;
    }
    // console.log('全部审批时的form ===', form);
};

/********************************\
 * 获取表单数据
 \********************************/
const showPlanDatePicker = ref(false);
const showPlanDateTimePicker = ref(false);
const showPlanHourPicker = ref(false);
// const vantPlanHourName = ref('');
// 计划完成小时数获取
const onPlanHourConfirm = ({ selectedOptions }) => {
    showPlanHourPicker.value = false;
    applyLinkForm.finishHour = selectedOptions[0].value;
    vantForm.vanPlanHourName = selectedOptions[0].text;
};
// 日期选择
const onPlanDateConfirm = (date) => {
    showPlanDatePicker.value = false;
    // 单独审批处理
    if (isLinkApproval.value) {
        applyLinkForm.finishDate = getFormattedDateTwo(date);
    }
    form.finishDate = getFormattedDateTwo(date);
};
// 完成日期小时
const onPlanDateTimeConfirm = (data) => {
    showPlanDateTimePicker.value = false;
    // console.log('小时value ===', data.selectedValues);
    const formattedTime = data.selectedValues.join(':');
    // 单独审批处理
    if (isLinkApproval.value) {
        applyLinkForm.finishDateTime = formattedTime;
    }
    form.finishDateTime = formattedTime;
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
    const type = 2;
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
        showSuccessMessage('任务申请删除成功。');
        getAuditUserData(); // 重新获取数据
    } else {
        // 可以添加其他的错误处理逻辑
        // console.log('出错了');
        showFailMessage(`任务申请删除失败，${response.message}`);
    }
}

/********************************\
 * 弹出层处理（同意）
 \********************************/
const handleApprovalBeforeClose = (action) => {
    if (action === 'confirm') {
        debounceAgreeFun();
    } else {
        showMobileApprovalDialog.value = false;
    }
};

const clearDate = () => {
    // console.log('dianjiquxiao');
    if (isLinkApproval.value) {
        applyLinkForm.finishDate = '';
        applyLinkForm.finishDateTime = '';
    }
    form.finishDate = '';
    form.finishDateTime = '';
};

const vantPlanHourList = computed(() => {
    return planFinishHourList.value.map((planHour) => ({
        text: planHour.taskPoints,
        value: planHour.taskPoints,
    }));
});

/********************************\
 * 获取路由信息
 \********************************/
const isLinkApproval = ref('');
const linkApplyId = route.query.taskId;
// console.log('linkApplyId ===', linkApplyId);
// 存储路由信息
isLinkApproval.value = Boolean(linkApplyId);
// console.log('isLinkApproval.value ===', isLinkApproval.value);
isLinkApprovalStore.setIsLinkApproval(isLinkApproval.value);

/********************************\
 * 对选中的那条数据进行渲染
 \********************************/
// 没有权限时
const noPermission = ref(false);

const applyLinkForm = reactive({
    point: null,
    chooseAgreeId: null,
    finishDate: '',
    finishDateTime: '',
    finishHour: null,
    taskDescription: '',
});
const vantForm = reactive({ vanPlanHourName: '' });

// 单独审批补全
onMounted(async () => {
    if (linkApplyId) {
        // 获取所有的列表数据，找到其中应该审批的那个
        await getAuditUserData();
        getPlanFinishList();
        // 获取列表之后填充数据
        // showMobileApprovalDialogBtn(linkApplyId);

        const selectedItem = auditTaskList.value.find(
            (item) => item.id == linkApplyId,
        );

        if (selectedItem) {
            // 时间显示处理
            applyLinkForm.finishDateTime = getFormattedDateThree(
                selectedItem.planFinishDate,
            );
            applyLinkForm.taskDescription = selectedItem.taskDescription;

            applyLinkForm.finishDate = getFormattedDateTwo(
                selectedItem.planFinishDate,
            );

            applyLinkForm.finishHour = selectedItem.planFinishHour;
            // 时间需要变更
            vantForm.vanPlanHourName = selectedItem.planFinishHour;

            // 只需要显示的内容（申请人、项目名称、任务类型）
            onlyShow.employeeName = selectedItem.employeeName;
            onlyShow.projectName = selectedItem.projectName;
            onlyShow.taskTypeName = selectedItem.taskTypeName;
        } else {
            // todo 20231103(合理性问题)
            noPermission.value = true;
            // if (isMobileDevice) {
            //     showFailToast('你还没拥有该审批权限');
            // } else {
            //     ElMessage({
            //         message: '你还没拥有该审批权限',
            //         type: 'error',
            //     });
            // }
            // console.log('noPermission ===', noPermission.value);
        }
    }
    // 焦点控制
    focusInput();
});
</script>

<template>
    <!-- pc端 -->
    <div
        class="approval_container"
        v-if="
            authorityList.includes('WEB_TaskApplyAudit') &&
            !isMobileDevice &&
            !isLinkApproval
        "
    >
        <!--  暂时不启动编辑功能   :edit-config="{ trigger: 'dblclick', mode: 'cell' }" -->
        <!-- projectList、taskTypeList、auditUserList也没获取 -->
        <!-- todo -->

        <div class="approval-box">
            <div class="refresh-content">
                <div @click="refreshApplyList" class="refresh-box">
                    <Refresh></Refresh>
                </div>
            </div>

            <div class="approval-content">
                <vxe-table
                    border
                    header-align="center"
                    :show-overflow="false"
                    max-height="520px"
                    :data="auditTaskList"
                    :column-config="{ resizable: true, useKey: 'field' }"
                    :row-config="{ useKey: 'id' }"
                    round
                    @edit-actived="handleCellActivated"
                    @edit-closed="handleCellClosed"
                    class="table"
                >
                    <!-- 选择框 -->
                    <!-- <vxe-column type="checkbox" width="60"></vxe-column> -->
                    <!-- 预警ID -->
                    <!-- <vxe-column field="id" title="ID" width="50px"></vxe-column> -->
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
                                {{ row.projectName }}
                            </span>
                        </template>
                        <template #edit="{ row }">
                            <vxe-select
                                v-model="row.projectId"
                                type="text"
                                transfer
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

                    <!-- 任务类型 -->
                    <vxe-column
                        field="taskTypeName"
                        title="任务类型"
                        :edit-render="{}"
                        width="100px"
                        header-align="center"
                        align="left"
                    >
                        <template #default="{ row }">
                            {{ row.taskTypeName }}
                        </template>
                        <template #edit="{ row }">
                            <vxe-select
                                v-model="row.taskTypeId"
                                type="text"
                                transfer
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
                        :edit-render="{}"
                        min-width="250px"
                        header-align="center"
                        align="left"
                    >
                        <template #edit="{ row }">
                            <vxe-input
                                v-model="row.taskDescription"
                                type="text"
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
                        :edit-render="{}"
                        width="130px"
                        header-align="center"
                        align="center"
                    >
                        <template #default="{ row }">
                            {{ getFormattedDateTwo(row.planFinishDate) }}
                        </template>
                        <template #edit="{ row }">
                            <vxe-input
                                v-model="row.planFinishDate"
                                type="text"
                            ></vxe-input>
                        </template>
                    </vxe-column>

                    <!-- 申请人 -->
                    <vxe-column
                        field="employeeName"
                        title="申请人"
                        :edit-render="{}"
                        width="100px"
                        header-align="center"
                        align="center"
                    ></vxe-column>
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
                                @click="showAgreeDialogFun(row.id)"
                                class="agree"
                            >
                                审批
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

        <!-- 申请审批弹出框 -->
        <el-dialog
            v-model="showAgreeDialog"
            title="任务申请审批"
            modal="true"
            :width="dialogWidth"
            @close="resetForm"
            @opened="focusInput"
        >
            <el-form
                :model="form"
                :disabled="isSubmitting"
                v-loading="approvalLoading"
            >
                <el-form-item :label-width="40">
                    <el-col :span="8">
                        项目名称：{{ onlyShow.projectName }}
                    </el-col>
                    <el-col :span="8">
                        任务类型：{{ onlyShow.taskTypeName }}
                    </el-col>
                    <el-col :span="8">
                        申请人：{{ onlyShow.employeeName }}
                    </el-col>
                </el-form-item>

                <!-- 任务点数 -->
                <el-form-item label="任务点数" prop="point" :label-width="120">
                    <el-input type="text" v-model="form.point" ref="pointRef" />
                </el-form-item>

                <!-- 计划完成小时数 -->
                <el-form-item
                    label="计划完成小时数"
                    prop="name"
                    :label-width="120"
                >
                    <!-- todo -->
                    <el-select
                        placeholder="请选择计划完成小时数"
                        v-model="form.finishHour"
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
                <el-form-item label="计划完成日期" :label-width="120">
                    <el-col :span="11">
                        <el-date-picker
                            v-model="form.finishDate"
                            type="date"
                            placeholder="选择计划完成日期"
                            style="width: 100%"
                            :disabledDate="disabledPreviousDates"
                            @change="handleDateClose"
                        />
                    </el-col>
                    <el-col :span="2" style="text-align: center">
                        <span>-</span>
                    </el-col>
                    <el-col :span="11">
                        <el-time-select
                            style="width: 100%"
                            v-model="form.finishDateTime"
                            start="09:00"
                            step="00:30"
                            end="18:00"
                            placeholder="请选择时间"
                            @change="handleDateTimeClose"
                        ></el-time-select>
                    </el-col>
                </el-form-item>

                <!-- 任务描述 -->
                <el-form-item label="任务说明" prop="desc" label-width="120">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 10 }"
                        :maxlength="1000"
                        v-model="form.taskDescription"
                        placeholder="请填写任务说明"
                    ></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button
                        @click="showAgreeDialog = false"
                        class="btn-cancel"
                    >
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="debounceAgreeFun"
                        class="btn-sure"
                        :disabled="approvalLoading"
                    >
                        同意
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 确定删除提示框 -->
        <el-dialog v-model="showDeleteDialog" title="任务申请删除">
            请确认是否删除任务申请？
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

    <!-- 移动设备 -->
    <div
        class="mobile-container"
        v-if="
            authorityList.includes('WEB_TaskApplyAudit') &&
            isMobileDevice &&
            !isLinkApproval
        "
    >
        <!-- 返回组件 -->
        <div class="turnback_container">
            <div class="navbar">
                <div class="goback" @click="goBack">
                    <van-icon name="arrow-left" />
                </div>
                <div class="title">任务审批</div>
                <div class="createBtn" @click="refreshApplyList">
                    <van-icon name="replay" size="22" />
                </div>
            </div>
        </div>

        <div class="noData" v-if="auditTaskList.length == 0 && isDataLoaded">
            暂时没有更多审批任务
        </div>

        <!-- 移动端展示 -->
        <div class="mobile-content">
            <div
                class="mobile-box"
                v-for="task in auditTaskList"
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
                    <div class="taskCard-item">申请人</div>
                    <div class="taskCard-content">{{ task.employeeName }}</div>
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
                <!-- 操作 -->
                <div class="operate-box">
                    <div
                        class="mobile-approval operate"
                        @click="showMobileApprovalDialogBtn(task.id)"
                    >
                        <van-icon name="records-o" />
                        审批
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

        <!-- 移动端审批弹出框 -->
        <van-dialog
            v-model:show="showMobileApprovalDialog"
            title="任务申请审批"
            show-cancel-button
            :before-close="handleApprovalBeforeClose"
            :close-on-click-overlay="true"
            @opened="focusInput"
            @cancel="resetForm"
        >
            <van-form :disabled="isSubmitting">
                <!-- 项目名称 -->
                <van-cell
                    :value="onlyShow.projectName"
                    title="项目名称"
                    label-width="100px"
                ></van-cell>
                <!-- 任务类型 -->
                <van-cell
                    :value="onlyShow.taskTypeName"
                    title="任务类型"
                    label-width="100px"
                ></van-cell>
                <!-- 申请人 -->
                <van-cell
                    :value="onlyShow.employeeName"
                    title="申请人"
                    label-width="100px"
                ></van-cell>

                <!-- 计划完成时间 -->
                <van-field
                    label="任务点数"
                    v-model="form.point"
                    placeholder="请输入任务点数"
                    ref="pointRef"
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
                    :value="getFormattedDateTwo(form.finishDate)"
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
                                display: form.finishDate ? 'block' : 'none',
                            }"
                        />
                    </template>
                </van-cell>

                <!-- 计划完成日期的时间 -->
                <van-cell
                    :value="form.finishDateTime"
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
                                display: form.finishDateTime ? 'block' : 'none',
                            }"
                        />
                    </template>
                </van-cell>

                <!-- 任务描述 -->
                <van-field
                    label="任务说明"
                    v-model="form.taskDescription"
                    placeholder="请输入任务说明"
                    label-width="100px"
                ></van-field>
            </van-form>
        </van-dialog>

        <!-- 弹出框 -->
        <!-- 计划完成小时数 -->
        <van-popup v-model:show="showPlanHourPicker" round position="bottom">
            <van-picker
                :columns="vantPlanHourList"
                @cancel="showPlanHourPicker = false"
                @confirm="onPlanHourConfirm"
            />
        </van-popup>
        <!-- 完成日期 -->
        <van-calendar
            v-model:show="showPlanDatePicker"
            @confirm="onPlanDateConfirm"
        />
        <!-- 完成时间 -->
        <van-popup v-model:show="showPlanDateTimePicker" position="bottom">
            <van-time-picker
                title="选择时间"
                @confirm="onPlanDateTimeConfirm"
                :filter="filter"
                @click="showPlanDateTimePicker = false"
            />
        </van-popup>

        <!-- 删除弹出框 -->
        <van-dialog
            v-model:show="showMobileDeleteDialog"
            title="任务申请"
            show-cancel-button
            @confirm="mobileDeleteTaskFun"
            :close-on-click-overlay="true"
        >
            <div class="delete-content">请确认是否删除任务申请。</div>
        </van-dialog>
    </div>

    <!-- 链接-PC端审批 -->
    <div
        class="link-pc-approval"
        v-if="isLinkApproval && !isMobileDevice && !noPermission"
    >
        <div class="link-content">
            <el-form :model="form" :disabled="isSubmitting">
                <div class="link-pc-container">
                    <div class="title">任务申请审批</div>
                </div>
                <el-form-item
                    label="项目名称"
                    prop=""
                    :label-width="120"
                    class="nolyShow"
                >
                    <div class="onlyShowItem">
                        {{ onlyShow.projectName }}
                    </div>
                </el-form-item>
                <el-form-item
                    label="任务类型"
                    prop=""
                    :label-width="120"
                    class="nolyShow"
                >
                    <div class="onlyShowItem">{{ onlyShow.taskTypeName }}</div>
                </el-form-item>
                <el-form-item
                    label="申请人"
                    prop=""
                    :label-width="120"
                    class="nolyShow"
                >
                    <div class="onlyShowItem">{{ onlyShow.employeeName }}</div>
                </el-form-item>

                <!-- 任务点数 -->
                <el-form-item label="任务点数" prop="point" :label-width="120">
                    <el-input
                        type="text"
                        v-model="applyLinkForm.point"
                        ref="pointRef"
                    />
                </el-form-item>

                <!-- 计划完成小时数 -->
                <el-form-item
                    label="计划完成小时数"
                    prop="name"
                    :label-width="120"
                >
                    <el-select
                        placeholder="请选择计划完成小时数"
                        v-model="applyLinkForm.finishHour"
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
                <el-form-item label="计划完成日期" :label-width="120">
                    <el-col :span="11">
                        <el-date-picker
                            v-model="applyLinkForm.finishDate"
                            type="date"
                            placeholder="选择计划完成日期"
                            style="width: 100%"
                            :disabledDate="disabledPreviousDates"
                            @change="handleDateClose"
                        />
                    </el-col>
                    <el-col :span="2" style="text-align: center">
                        <span>-</span>
                    </el-col>
                    <el-col :span="11">
                        <el-time-select
                            style="width: 100%"
                            v-model="applyLinkForm.finishDateTime"
                            start="09:00"
                            step="00:30"
                            end="18:00"
                            placeholder="请选择时间"
                            @change="handleDateTimeClose"
                        ></el-time-select>
                    </el-col>
                </el-form-item>

                <!-- 任务描述 -->
                <el-form-item label="任务说明" prop="desc" label-width="120">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 10 }"
                        :maxlength="1000"
                        v-model="applyLinkForm.taskDescription"
                        placeholder="请填写任务说明"
                    ></el-input>
                </el-form-item>
            </el-form>

            <div class="pclinkapply">
                <div class="pc-cencel" @click="resetForm">取消</div>
                <div class="pc-sure" @click="debounceAgreeFun">同意</div>
            </div>
        </div>
    </div>

    <!-- 链接-移动端审批 -->
    <div
        class="link-mobile-approval"
        v-if="isLinkApproval && isMobileDevice && !noPermission"
    >
        <!-- navbar -->
        <div class="link-mobile-container">
            <div class="title">任务申请审批</div>
        </div>

        <div class="link-mobile-content">
            <van-form>
                <!-- 项目名称 -->
                <van-cell
                    :value="onlyShow.projectName"
                    title="项目名称"
                ></van-cell>

                <!-- 任务类型 -->
                <van-cell
                    :value="onlyShow.taskTypeName"
                    title="任务类型"
                ></van-cell>
                <!-- 申请人 -->
                <van-cell
                    :value="onlyShow.employeeName"
                    title="申请人"
                ></van-cell>
                <!-- 任务点数 -->
                <van-field
                    label="任务点数"
                    v-model="applyLinkForm.point"
                    placeholder="请输入任务点数"
                    ref="pointRef"
                    label-width="100px"
                ></van-field>

                <!-- 计划完成时间 -->
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
                    :value="getFormattedDateTwo(applyLinkForm.finishDate)"
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
                                display: applyLinkForm.finishDate
                                    ? 'block'
                                    : 'none',
                            }"
                        />
                    </template>
                </van-cell>

                <!-- 计划完成日期的时间 -->
                <van-cell
                    :value="applyLinkForm.finishDateTime"
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
                                display: applyLinkForm.finishDateTime
                                    ? 'block'
                                    : 'none',
                            }"
                        />
                    </template>
                </van-cell>

                <!-- 任务描述 -->
                <van-field
                    label="任务说明"
                    v-model="applyLinkForm.taskDescription"
                    placeholder="请输入任务说明"
                    label-width="100px"
                ></van-field>
            </van-form>
        </div>

        <div class="linkapply-opreate">
            <div class="link-cencel" @click="resetForm">取消</div>
            <div class="link-sure" @click="debounceAgreeFun">同意</div>
        </div>

        <van-popup v-model:show="showPlanHourPicker" round position="bottom">
            <van-picker
                :columns="vantPlanHourList"
                @cancel="showPlanHourPicker = false"
                @confirm="onPlanHourConfirm"
            />
        </van-popup>

        <!-- 完成日期 -->
        <van-calendar
            v-model:show="showPlanDatePicker"
            @confirm="onPlanDateConfirm"
        />
        <!-- 完成时间 -->
        <van-popup v-model:show="showPlanDateTimePicker" position="bottom">
            <van-time-picker
                title="选择时间"
                @confirm="onPlanDateTimeConfirm"
                :filter="filter"
                @click="showPlanDateTimePicker = false"
            />
        </van-popup>
    </div>

    <!-- 无审批权限页面 -->
    <div class="nopermission" v-if="noPermission">
        当前你没有该任务申请的审批权限
    </div>
</template>

<!-- pc端样式 -->
<style scoped lang="scss">
@import '../../assets/css/variables.scss';

.nopermission {
    margin: 100px auto;
    text-align: center;
}

.el-dialog--center .el-dialog__footer {
    text-align: right !important;
}
.el-dialog__footer {
    text-align: right !important;
}
.approval_container {
    width: calc(100vw - 160px);
    .refresh-box {
        width: 80px;
    }
    .approval-box {
        margin-top: 15px;
        padding-bottom: 15px;
        margin-inline: 16px;
        background-color: #fff;
        border-radius: 2px;
        // padding-top: 16px;
    }
    .table {
        margin: 0px 21px 10px 21px;
    }

    .agree {
        width: 53px;
        height: 27px;
        background: #ecf1ff;
        border: none;
        border-radius: 2px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #1768e4;
    }

    .agree:hover {
        color: #ffffff;
        background: #1768e4;
        cursor: pointer;
    }

    .delete {
        border: none;
        border-radius: 2px;
        width: 54px;
        height: 26px;
    }

    .delete {
        background-color: #ffecec;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #e41731;
    }

    .delete:hover {
        color: #fff;
        background-color: #ed5b5d;
        cursor: pointer;
    }

    .agree {
        margin-right: 11px;
    }

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
}

// 单独审批
.link-content {
    margin: 20px auto 30px;
    padding: 30px;
    max-width: 700px;
    background-color: #fff;
}

.pclinkapply {
    display: flex;
    justify-content: flex-end;
}

.pc-cencel,
.pc-sure {
    text-align: center;
    line-height: 26px;
}

.pc-cencel {
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

.pc-cencel:hover {
    color: #666666;
    background: #ffffff;
    // border: none;
    border: 1px solid #e3eeff;
    cursor: pointer;
}

.pc-sure {
    width: 64px;
    height: 26px;
    background: #1768e4;
    border-radius: 2px;
    border: none;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
    margin-left: 11px;
}

.pc-sure:hover {
    background: #2b8aec;
    color: #ffffff;
    cursor: pointer;
}

.onlyShowItem {
    color: #666666;
    // margin-right: auto;
    width: 100%;
    margin-right: 10px;
    text-align: right;
    // padding-left: 450px;
    // margin-right: 50px;
}

.el-form-item__content {
    display: flex;
    justify-content: flex-end;
}
</style>

<!-- 移动端样式 -->
<style scoped lang="scss">
.mobile-container {
    // width: 100%;
    background-color: #f3f7ff;
}

.delete-content {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 10px;
    // text-align: center;
}
.navbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 15px 18px 10px 18px;
    background-color: #fff;
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

.link-pc-container {
    padding: 5px 10px;
    text-align: center;
    background-color: #fff;
    margin-bottom: 10px;
}

// 移动端单独审批

.link-mobile-container {
    padding: 15px 18px 10px 18px;
    text-align: center;
    background-color: #fff;
    margin-bottom: 10px;
}
.linkapply-opreate {
    margin: 20px 0 30px 0;
    padding-inline: 20px;
    display: flex;
    justify-content: center;
}

.link-cencel,
.link-sure {
    padding: 15px 50px;
}

.link-cencel {
    background: #ffffff;
    border: 1px solid #1768e4;
    border-radius: 8px;
    color: #1768e4;
}

.link-sure {
    background: #1768e4;
    border-radius: 8px;
    margin-left: 15px;
    color: #ffffff;
}

.van-cell__value.van-field__control {
    text-align: right;
    padding-left: 20px;
}
</style>
