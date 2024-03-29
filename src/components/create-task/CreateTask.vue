<script setup>
import {
    useCreateTaskStore,
    useUserProjectListStore,
    useTaskTypeListStore,
    useAuditUserListStore,
    usePlanFinishHourStore,
} from '@/store/modules/task.js';
/********************************\
 * 公共引入处理
\********************************/
import { reactive, ref, computed } from 'vue';
const createTask = useCreateTaskStore();
const userProjectList = useUserProjectListStore();
const useTaskTypeList = useTaskTypeListStore();
const useAuditTypeList = useAuditUserListStore();
const usePlanFinishHourList = usePlanFinishHourStore();
// import { ElMessage } from 'element-plus';

// 创建数据共享
import { useIsCreatedStore } from '@/store/public';
// import { storeToRefs } from 'pinia';
const isCreateStore = useIsCreatedStore();
// const { isCreate } = storeToRefs(isCreateStore);
// 计划完成小时数校验
// import { validateHoursInput } from '@/utils/validate/validateHoursInput';
// 日期选择限制
import { disabledPreviousDates } from '@/utils/limit/limitDateSelect';
// 时间格式化
import {
    getFormattedDate,
    getFormattedDateTwo,
} from '@/utils/format/formatDate';
// 任务描述验证
import { validateDescriptionInput } from '@/utils/validate/validateDescript';
// 获取项目id
import { useUserIdStore } from '@/store/public';
const userIdStore = useUserIdStore();
// 导入时间&分钟选择
// import HourAndMinSelect from '@/components/hour-min-select/HourAndMinSelect.vue';
// 防抖
import debounce from 'lodash/debounce';
// 设备检测
import { isMobileDevice } from '@/utils/device/isMobile';
// 日期非选
import { validateDateInput } from '@/utils/validate/validateDate';
// 提示处理
import {
    showFailMessage,
    showSuccessMessage,
} from '@/utils/show-message/showSFmessage';
import { showFailToast } from 'vant';
import { getApplyData } from '@/api/dingding/dingding.js';
// import { toRaw } from 'vue';
import { taskApplyIdCombineDingInstanceId } from '@/api/dingding/combine';
import { ElMessage } from 'element-plus';
/********************************\
 * 表单数据定义
\********************************/
const form = reactive({
    taskDescription: '', // 任务描述
    projectId: null, // 项目 ID
    taskTypeId: null, // 任务类别 ID
    planFinishHour: null, // 计划完成小时数
    planFinishDate: '', // 计划完成日期
    planFinishDateTime: '', // 计划的日期的时间
    applyAuditId: null, // 审批人ID
});

// 清空表单内容
function resetForm() {
    form.taskDescription = '';
    form.projectId = null;
    form.taskTypeId = null;
    form.planFinishHour = null;
    form.planFinishDate = '';
    form.planFinishDateTime = '';
    form.applyAuditId = null;

    // 清除禁止点击事件
    isSubmitting.value = false;
    creating.value = false;
}

/********************************\
 * 控制弹出层表单显示隐藏
\********************************/
const dialogFormVisible = ref(false);
const formLabelWidth = '120px';

async function dialogFormVisibleFun() {
    // 打开对话框
    dialogFormVisible.value = true;

    // 调用用户权限项目接口
    await getUserProjectList();
    // 调用获取任务类型接口
    await getTaskTypeList();
    // 调用审批人接口
    await getAuditUserList();
    // 计划完成时间选择
    await getPlanFinishList();
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
    try {
        if (response && response.code === 200) {
            projectList.value = response.result;
            // 根据 projectList 创建 projectNameMap
            projectNameMap.value = response.result.reduce((map, project) => {
                map[project.id] = project.name;
                return map;
            }, {});
        }
    } catch (error) {
        console.log('error');
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
    try {
        if (response && response.code === 200) {
            taskTypeList.value = response.result;
            // 根据 taskTypeList 创建 taskTypeMap
            taskTypeMap.value = response.result.reduce((map, taskType) => {
                map[taskType.id] = taskType.name;
                return map;
            }, {});
        }
    } catch (error) {
        console.log('error');
    }
}

/********************************\
 * 获取审批人ID
\********************************/
const auditUserList = ref([]);
const auditUserMap = ref({});
const auditUserNameCNMap = ref({});
async function getAuditUserList() {
    const response = await useAuditTypeList.fetchAuditUserListAction();
    // console.log('审批人response ===', response);
    try {
        if (response && response.code === 200) {
            auditUserList.value = response.result;
            // 根据 auditUserList 创建 auditUserMap
            auditUserMap.value = response.result.reduce((map, auditUser) => {
                map[auditUser.id] = auditUser.nameEN;
                return map;
            }, {});
            // 中文名
            auditUserNameCNMap.value = response.result.reduce(
                (map, auditUser) => {
                    map[auditUser.id] = auditUser.nameCN;
                    return map;
                },
                {},
            );
        }
    } catch (error) {
        console.log('error');
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
    try {
        if (response && response.code === 200) {
            planFinishHourList.value = response.result;
            planFinishHourListMap.value = response.result.reduce(
                (map, planFinishHour) => {
                    map[planFinishHour.id] = planFinishHour.taskPoints;
                    return map;
                },
                {},
            );
        }
    } catch (error) {
        console.log('error');
    }
}
/********************************\
 * 创建提交
\********************************/
const creating = ref(false);
async function createTaskBtn() {
    // 项目id
    if (!form.projectId) {
        showFailMessage('请选择项目名称。');
        return;
    }
    // 任务类别
    if (!form.taskTypeId) {
        showFailMessage('请选择任务类型。');
        return;
    }
    // 审批人
    if (!form.applyAuditId) {
        showFailMessage('请选择审批人。');
        return;
    }

    // validateHoursInput 验证计划完成小时数(20231101改为下拉框),只需要验证是否为空
    if (form.planFinishHour == undefined || form.planFinishHour == null) {
        showFailMessage('请选择计划完成小时数。');
        return;
    }

    // 日期时间校验
    const validateDdteInputResult = validateDateInput(
        form.planFinishDate,
        form.planFinishDateTime,
    );
    if (!validateDdteInputResult.isValid) {
        showFailMessage(validateDdteInputResult.message);
        return;
    }

    // 当有选择日期时间的时候，进行合并
    if (form.planFinishDate && form.planFinishDateTime) {
        form.planFinishDate = getFormattedDate(
            form.planFinishDate,
            form.planFinishDateTime,
        );
    } else {
        // 当没有的时候，则置空
        form.planFinishDate = null;
    }

    // 任务描述
    const validateDescriptionInputResult = validateDescriptionInput(
        form.taskDescription,
    );
    if (!validateDescriptionInputResult.isValid) {
        showFailMessage(validateDescriptionInputResult.message);
        return;
    }

    const applyName = localStorage.getItem('username');
    // 发送请求之后禁止操作表单
    isSubmitting.value = true;
    // 发送请求禁止再次点击发送
    creating.value = true;
    // 钉钉的表单
    let dingdingForm = {
        applyId: null,
        applyName: applyName,
        projectName: projectNameMap.value[form.projectId],
        taskTypeName: taskTypeMap.value[form.taskTypeId],
        applyAuditName: auditUserNameCNMap.value[form.applyAuditId],
        planFinishHour: form.planFinishHour,
        planFinishDate: form.planFinishDate,
        taskDescription: form.taskDescription,
    };
    // console.log('dingdingForm ===', dingdingForm);

    try {
        const response = await createTask.fetchCreateTaskAction(form);
        if (response && response.code === 200) {
            // 返回得到taskApplyId
            // console.log('taskApplyId ===', response.result.taskApplyId);
            // 钉钉调用数据
            let taskApplyId = response.result.taskApplyId;

            let instanceIds = null;
            dingdingForm.applyId = taskApplyId;
            // 等待钉钉创建任务申请实例
            await getApplyData(dingdingForm)
                .then((instance) => {
                    instanceIds = instance.instanceId;
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            // 创建成功之后，得到后端返回的taskid,再得到钉钉返回的instanceid
            // console.log(
            //     'taskApplyId,instanceIds ===',
            //     taskApplyId,
            //     instanceIds,
            // );
            // 等待任务申请系统创建成功
            // 等待钉钉创建成功
            // 将他们连接，方便后续的查询同步
            await combinedFun(taskApplyId, instanceIds);

            if (instanceIds) {
                showSuccessMessage('任务申请新增成功，钉钉同步任务申请成功。');
            } else {
                // todo 20231207 移动端提示处理
                if (isMobileDevice) {
                    showFailToast({
                        icon: 'warning-o',
                        messasge: '任务申请新增成功，但钉钉同步任务申请失败。',
                    });
                } else {
                    ElMessage({
                        message: '任务申请新增成功，但钉钉同步任务申请失败。',
                        type: 'warning',
                    });
                }
            }
            // 数据共享
            isCreateStore.setIsCreated(true);
            // 提示新建完成
            // showSuccessMessage('任务申请新增成功，钉钉同步成功。');
            // 清除所有数据
            resetForm();
            // 清除移动端数据
            resetVantForm();
            // 打开可编辑
            isSubmitting.value = false;
            creating.value = false;
            // 关闭对话框
            dialogFormVisible.value = false;
            // 关闭移动端弹出框
            showMobileCreateDialog.value = false;
        } else {
            // 可以添加其他的错误处理逻辑
            showFailMessage(`任务申请新增失败，${response.message}`);
            // 设置打开可编辑
            isSubmitting.value = false;
            creating.value = false;
            // 不用关闭对话框
        }
    } catch (error) {
        // 可以添加其他的错误处理逻辑
        showFailMessage(`任务申请新增失败，${error}`);
        // 设置打开可编辑
        isSubmitting.value = false;
        creating.value = false;
        // 关闭对话框
        dialogFormVisible.value = false;
    }
}

// combined
// const instanceId = ref();
// const taskApplyId = ref();
const combinedFun = async (taskApplyId, instanceId) => {
    // 将得到的taskApplyId和dingInstanceId结合
    // 参数一：taskApplyId 参数二：dingInstanceId

    try {
        await taskApplyIdCombineDingInstanceId(taskApplyId, instanceId);
    } catch (error) {
        console.log(error);
    }
};

/********************************\
 * 防抖处理
\********************************/
const debounceCreateTaskBtn = debounce(createTaskBtn, 1200);
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
//     form.planFinishDateTime = time;
// };
/********************************\
 * 处理提交之后网络延迟可以继续修改表单问题
\********************************/
const isSubmitting = ref(false);

/********************************\
 * 移动端新增按钮
\********************************/
const clickMobileCreate = () => {
    // console.log('点击了新增按钮');
    showMobileCreateDialog.value = true;
    dialogFormVisibleFun();
};

/********************************\
 * 移动端新增
\********************************/
const showMobileCreateDialog = ref(false);

// vant正常显示处理1
const vantForm = reactive({
    vantApplyAuditName: '',
    vantProjectName: '',
    vantTaskTypeName: '',
    vanPlanHourName: '',
});

// vant正常显示处理2
function resetVantForm() {
    vantForm.vantApplyAuditName = '';
    vantForm.vantProjectName = '';
    vantForm.vantTaskTypeName = '';
    vantForm.vanPlanHourName = '';
}

/********************************\
 * <van-picker>格式化
\********************************/
// vant正常显示处理3
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
    return planFinishHourList.value.map((value) => ({
        text: value.taskPoints,
        value: value.taskPoints,
    }));
});

/********************************\
 * 获取表单数据（底下弹出框选择）
\********************************/
const showAuditPicker = ref(false);
const showPlanHourPicker = ref(false);
const showProjectPicker = ref(false);
const showTaskTypePicker = ref(false);
const showPlanDatePicker = ref(false);
const showPlanDateTimePicker = ref(false);

// 审批人获取
const onAuditConfirm = ({ selectedOptions }) => {
    showAuditPicker.value = false;
    form.applyAuditId = selectedOptions[0].value;
    vantForm.vantApplyAuditName = selectedOptions[0].text;
};
// 计划完成小时数获取
const onPlanHourConfirm = ({ selectedOptions }) => {
    showPlanHourPicker.value = false;
    form.planFinishHour = selectedOptions[0].value;
    vantForm.vanPlanHourName = selectedOptions[0].text;
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
// 日期选择
const onPlanDateConfirm = (date) => {
    showPlanDatePicker.value = false;
    form.planFinishDate = getFormattedDateTwo(date);
};
// 完成日期小时
const onPlanDateTimeConfirm = (data) => {
    showPlanDateTimePicker.value = false;
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
 * 弹出层处理（请求）
\********************************/
// 点击确认没成功也会取消弹出框问题
const handleCreateBeforeClose = async (action) => {
    if (action === 'confirm') {
        // 禁止移动端多次点击新增按钮
        await debounceCreateTaskBtn();
        // debounceCreateTaskBtn内部控制弹出框显示或隐藏
    } else {
        showMobileCreateDialog.value = false;
    }
};

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
 * 日期时间同时修改
\********************************/
const clearDate = () => {
    form.planFinishDate = '';
    form.planFinishDateTime = '';
};
</script>

<template>
    <!-- pc端新增 -->
    <div class="create_container" v-if="!isMobileDevice">
        <el-button @click="dialogFormVisibleFun" class="create">新增</el-button>

        <!-- 新增弹出框 -->
        <el-dialog
            v-model="dialogFormVisible"
            title="任务申请新增"
            modal="true"
            :width="dialogWidth"
            class="dialog-content"
            @close="resetForm"
        >
            <el-form :model="form" :disabled="isSubmitting">
                <!-- 项目ID-选择框 -->
                <el-form-item
                    label="项目名称"
                    prop="projectId"
                    :label-width="formLabelWidth"
                >
                    <el-select
                        placeholder="请选择项目名称"
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
                    <!-- <el-input
                        v-model="form.planFinishHour"
                        placeholder="请选择计划完成小时数"
                    /> -->
                    <el-select
                        placeholder="请选择计划完成小时数"
                        v-model="form.planFinishHour"
                    >
                        <el-option
                            v-for="auditUser in planFinishHourList"
                            :key="auditUser.id"
                            s
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
                            placeholder="请选择计划完成日期"
                            style="width: 100%"
                            :disabledDate="disabledPreviousDates"
                            @change="handleDateClose"
                        />
                    </el-col>
                    <el-col :span="2" style="text-align: center">
                        <span>-</span>
                    </el-col>
                    <el-col :span="11">
                        <!-- 只需要小时的情况 -->
                        <!-- <el-select
                            v-model="form.planFinishDateTime"
                            placeholder="请选择小时"
                            style="width: 100%"
                        >
                            <el-option
                                v-for="n in 24"
                                :key="n - 1"
                                :label="`${n - 1} `"
                                :value="n - 1"
                            ></el-option>
                        </el-select> -->
                        <!-- <hour-and-min-select
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
                        <!-- <button @click="clearDateTime">清除</button> -->
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
                        @click="dialogFormVisible = false"
                        class="btn-cancel"
                    >
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="debounceCreateTaskBtn"
                        class="btn-sure"
                        :disabled="creating"
                    >
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>

    <!-- 移动端新增 -->
    <div class="mobile-create-container" v-if="isMobileDevice">
        <!-- 加号添加 -->
        <van-icon name="add-o" size="22" @click="clickMobileCreate" />

        <!-- 新增弹出框 -->
        <van-dialog
            v-model:show="showMobileCreateDialog"
            title="任务申请新增"
            show-cancel-button
            :close-on-click-overlay="true"
            :before-close="handleCreateBeforeClose"
            @cancel="resetForm"
        >
            <van-form :disabled="isSubmitting">
                <!-- 项目名称 -->
                <van-field
                    is-link
                    readonly
                    v-model="vantForm.vantProjectName"
                    label="项目名称"
                    placeholder="请选择项目名称"
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
                <!-- 计划完成小时 -->
                <van-cell
                    :value="form.planFinishDateTime"
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
                    type="textarea"
                    rows="1"
                    autosize
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

        <!-- 审批人 -->
        <van-popup v-model:show="showAuditPicker" round position="bottom">
            <van-picker
                :columns="vantAuditUserList"
                @cancel="showAuditPicker = false"
                @confirm="onAuditConfirm"
            />
        </van-popup>

        <!-- 计划完成小时数 -->
        <van-popup v-model:show="showPlanHourPicker" round position="bottom">
            <van-picker
                :columns="vantPlanHourList"
                @cancel="showPlanHourPicker = false"
                @confirm="onPlanHourConfirm"
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
</template>

<style scoped lang="scss">
@import '../../assets/css/variables.scss';

.custom-time-select .el-scrollbar__wrap {
    padding-right: 50px; /* 或更多，根据需要调整 */
}

.el-dialog__footer {
    text-align: right;
}
.el-button--text {
    margin-right: 15px;
}
.el-select {
    width: 300px;
}
.el-input {
    width: 300px;
}
.dialog-footer button:first-child {
    margin-right: 10px;
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
</style>

<style scoped lang="scss">
@import '../../assets/css/variables.scss';

.el-overlay-dialog {
    width: 100vw;
    height: 100vh;
}

.create_container {
    width: 100%;
    height: 100%;

    .dialog-content {
        width: 100%;
        height: 100%;
        max-height: 400px; /* 你可以根据需要调整这个值 */
        overflow-y: auto;
    }
    .create {
        width: 80px;
        height: 32px;
        background: #1768e4;
        border-radius: 4px;
        border: none;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        margin-top: 16px;
        margin-left: 40px;
        margin-bottom: 11px;
    }
    .create:hover {
        background: #2b8aec;
    }
}

.close-icon {
    font-size: 16px;
    line-height: inherit;
    padding: 0 10px;
    color: #666;
}
</style>
