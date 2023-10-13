<script setup>
import {
    useCreateTaskStore,
    useUserProjectListStore,
    useTaskTypeListStore,
    useAuditUserListStore,
} from '@/store/modules/task.js';
/********************************\
 * 公共引入处理
\********************************/
import { reactive, ref, computed } from 'vue';
const createTask = useCreateTaskStore();
const userProjectList = useUserProjectListStore();
const useTaskTypeList = useTaskTypeListStore();
const useAuditTypeList = useAuditUserListStore();
import { ElMessage } from 'element-plus';

// 创建数据共享
import { useIsCreatedStore } from '@/store/public';
// import { storeToRefs } from 'pinia';
const isCreateStore = useIsCreatedStore();
// const { isCreate } = storeToRefs(isCreateStore);
import { validateHoursInput } from '@/utils/validate/validateHoursInput';
// 日期选择限制
import { disabledPreviousDates } from '@/utils/limit/limitDateSelect';
// 时间格式化
import { getFormattedDate } from '@/utils/format/formatDate';
// 任务描述验证
import { validateDescriptionInput } from '@/utils/validate/validateDescript';
// 获取项目id
import { useUserIdStore } from '@/store/public';
const userIdStore = useUserIdStore();
// 导入时间&分钟选择
import HourAndMinSelect from '@/components/hour-min-select/HourAndMinSelect.vue';
import router from '@/router';

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
}

/********************************\
 * 控制弹出层表单显示隐藏
\********************************/
const dialogFormVisible = ref(false);
const formLabelWidth = '120px';
const isTokenExpires = ref(false);
// 点击创建按钮发送请求，获取权限接口数据
async function dialogFormVisibleFun() {
    // 打开对话框
    dialogFormVisible.value = true;
    // 调用用户权限项目接口
    await getUserProjectList();
    // 调用获取权限任务类型接口
    await getTaskTypeList();
    // 调用权限审批人接口
    await getAuditUserList();
}
/********************************\
 * 获取用户有权限的项目ID
\********************************/
const projectList = ref([]);
async function getUserProjectList() {
    if (isTokenExpires.value) return;
    const response = await userProjectList.fetchUserProjectListAction(
        userIdStore.userId,
    );

    if (response && response.code === 401) {
        isTokenExpires.value = true;
        ElMessage({
            message: response.message,
            type: 'error',
        });
        router.replace({ path: '/login' });
    } else if (response && response.code === 200) {
        projectList.value = response.result;
    } else {
        ElMessage({
            message: '获取项目失败',
            type: 'error',
        });
    }
}

/********************************\
 * 获取任务类别ID
\********************************/
const taskTypeList = ref([]);
async function getTaskTypeList() {
    if (isTokenExpires.value) return;
    const response = await useTaskTypeList.fetchTaskTypeListAction();
    if (response && response.code === 401) {
        isTokenExpires.value = true;
        ElMessage({
            message: response.message,
            type: 'error',
        });
        router.replace({ path: '/login' });
        return;
    } else if (response && response.code === 200) {
        taskTypeList.value = response.result;
    } else {
        ElMessage({
            message: '获取任务类型失败',
            type: 'error',
        });
    }
}

/********************************\
 * 获取审批人ID
\********************************/
const auditUserList = ref([]);
async function getAuditUserList() {
    if (isTokenExpires.value) return;
    const response = await useAuditTypeList.fetchAuditUserListAction();
    if (response && response.code === 401) {
        isTokenExpires.value = true;
        ElMessage({
            message: response.message,
            type: 'error',
        });
        router.replace({ path: '/login' });
        return;
    } else if (response && response.code === 200) {
        auditUserList.value = response.result;
    } else {
        console.log('response ===', response);
        ElMessage({
            message: '获取审批人失败',
            type: 'error',
        });
    }
}

/********************************\
 * 对话框确认操作
\********************************/
async function createTaskBtn() {
    // 项目id
    if (!form.projectId) {
        ElMessage({
            message: '请选择项目',
            type: 'error',
        });
        return;
    }
    // 任务类别
    if (!form.taskTypeId) {
        ElMessage({
            message: '请选择任务类别',
            type: 'error',
        });
        return;
    }
    // 审批人
    if (!form.applyAuditId) {
        ElMessage({
            message: '请选择审批人',
            type: 'error',
        });
        return;
    }
    // validateHoursInput 验证计划完成小时数
    const validateHoursInputResult = validateHoursInput(form.planFinishHour);
    if (!validateHoursInputResult.isValid) {
        ElMessage({
            message: validateHoursInputResult.message,
            type: 'error',
        });
        return;
    }
    // 完成日期
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

    // 完成日期格式化
    form.planFinishDate = getFormattedDate(
        form.planFinishDate,
        form.planFinishDateTime,
    );

    console.log('form.planFinishDate ===', form.planFinishDate);
    try {
        const response = await createTask.fetchCreateTaskAction(form);
        // console.log(' Create 页面 response ===', response);

        if (response && response.code === 401) {
            ElMessage({
                message: response.message,
                type: 'success',
            });
            router.push({ path: '/login' });
        }

        if (response && response.code === 200) {
            // 关闭对话框
            dialogFormVisible.value = false;
            // 数据共享
            isCreateStore.setIsCreated(true);
            // 提示新建完成
            ElMessage({
                message: '任务新增成功',
                type: 'success',
            });
            // 清除所有数据
            resetForm();
        } else {
            // 可以添加其他的错误处理逻辑
            ElMessage({
                message: response.message,
                type: 'error',
            });
        }
    } catch (error) {
        console.error('创建任务错误：', error);
        // 取消弹出框
        dialogFormVisible.value = false;
        ElMessage({
            message: `任务新增失败，${error}`,
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
 * 时间传递（自定义事件）
\********************************/
const handleTimeUpdate = (time) => {
    // console.log('Received update-time event with value:', time);
    form.planFinishDateTime = time;
};
</script>

<template>
    <div class="create_container">
        <el-button @click="dialogFormVisibleFun" class="create">新增</el-button>

        <!-- 弹出框 -->
        <el-dialog
            v-model="dialogFormVisible"
            title="任务申请新增"
            modal="true"
            :width="dialogWidth"
            class="dialog-content"
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
                    <el-input
                        v-model="form.planFinishHour"
                        placeholder="请填写计划完成小时数"
                    />
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
                        <hour-and-min-select
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
                        :autosize="{ minRows: 2, maxRows: 10 }"
                        :maxlength="1000"
                        v-model="form.taskDescription"
                        placeholder="请填写任务描述"
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
                        @click="createTaskBtn"
                        class="btn-sure"
                    >
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
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
.create_container {
    .dialog-content {
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
</style>
