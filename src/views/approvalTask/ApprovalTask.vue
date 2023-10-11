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
    useUserProjectListStore,
    useTaskTypeListStore,
} from '@/store/modules/task';
import { storeToRefs } from 'pinia';
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
    getFormattedDate,
    getFormattedDateTwo,
} from '@/utils/format/formatDate';
// import { formatProjectName, formatTaskType } from '@/assets/data/vxeColumnData';
// import { disabledPreviousDates } from '@/utils/limitDateSelect';
import { disabledPreviousDates } from '@/utils/limit/limitDateSelect';
// 小时数校验
import { validateHoursInput } from '@/utils/validate/validateHoursInput';
// 点数校验
import { validatePoint } from '@/utils/validate/validatePoint';
// 获取项目id
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
    getAuditUserData();
    // 调用用户权限项目接口
    getUserProjectList();
    // 调用获取任务类型接口
    getTaskTypeList();
    // 调用审批人接口
    // getAuditUserList();
});

const userProjectList = useUserProjectListStore();
const useTaskTypeList = useTaskTypeListStore();
const userIdStore = useUserIdStore();

// todo 这里其实是获取申请人的用户的权限，现在可以暂时这么做，但是当表格的数据需要修改的时候，
// 我们就要真正的获取申请人的权限，然后做映射，在表格中显示对应的项目名称、任务类型或申请人
// 申请人可以直接使用
/********************************\
 * 获取用户有权限的项目
\********************************/
const projectList = ref([]);
const projectNameMap = ref({}); // 记录映射关系
async function getUserProjectList() {
    console.log('userIdStore.userId ===', userIdStore.userId);
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
 * 获取申请人
\********************************/
// const auditUserList = ref([]);
// const auditUserMap = ref({});
// async function getAuditUserList() {
//     const response = await useAuditTypeList.fetchAuditUserListAction();
//     // console.log('审批人response ===', response);
//     if (response && response.code === 200) {
//         auditUserList.value = response.result;
//         // 根据 auditUserList 创建 auditUserMap
//         auditUserMap.value = response.result.reduce((map, auditUser) => {
//             map[auditUser.id] = auditUser.nameEN;
//             return map;
//         }, {});
//     } else {
//         ElMessage({
//             message: '获取审批人失败',
//             type: 'error',
//         });
//     }
// }

/********************************\
 * 获取审批列表接口
\********************************/
function getAuditUserData() {
    useAuditTaskList.fetchAuditTaskAction();
    console.log('任务审批 auditTaskList ===', auditTaskList);
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
});

/********************************\
 * 显示同意按钮
\********************************/
const showAgreeDialog = ref(false);
// 选择的id
const chooseAgreeId = ref(null);
function showAgreeDialogFun(currentId) {
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
    }
}

/********************************\
 * 确认同意
\********************************/
async function agreeFun() {
    // 验证点数
    const validatePointInputResult = validatePoint(form.point);
    if (!validatePointInputResult.isValid) {
        ElMessage({
            message: validatePointInputResult.message,
            type: 'error',
        });
        return;
    }

    if (!form.finishDate) {
        ElMessage({
            message: '请选择计划完成日期',
            type: 'error',
        });
        return;
    }

    form.finishDate = getFormattedDate(form.finishDate, form.finishDateTime);

    // 验证小时数
    const validateHoursInputResult = validateHoursInput(form.finishHour);
    if (!validateHoursInputResult.isValid) {
        ElMessage({
            message: validateHoursInputResult.message,
            type: 'error',
        });
        return;
    }

    try {
        // 获取审批接口
        const response = await useAgreeTask.fetchAgreeTaskAction(form);
        if (response && response.code === 200) {
            // 清除弹出框
            showAgreeDialog.value = false;
            // 提示成功
            ElMessage({
                message: '任务审批成功',
                type: 'success',
            });
            // 清空输入的点数
            form.point = null;
            // 重新发送请求
            useAuditTaskList.fetchAuditTaskAction();
        } else {
            showAgreeDialog.value = false;
            ElMessage({
                message: response.message,
                type: 'error',
            });
            // alert(response.message)
        }
    } catch (error) {
        console.log('error ===', error);
        showAgreeDialog.value = false;
        ElMessage({
            // todo 任务审批请求任务不成功。+error
            message: `任务审批请求任务不成功。${error}`,
            type: 'error',
        });
    }
}

/********************************\
 * 日期选择限制//todo
\********************************/

/********************************\
 * 时间传递（自定义事件）
\********************************/
const handleTimeUpdate = (time) => {
    // console.log('Received update-time event with value:', time);
    form.finishDateTime = time;
};
</script>

<template>
    <div
        class="approval_container"
        v-if="authorityList.includes('WEB_TaskApplyAudit')"
    >
        <!--  暂时不启动编辑功能   :edit-config="{ trigger: 'dblclick', mode: 'cell' }" -->
        <!-- projectList、taskTypeList、auditUserList也没获取 -->
        <!-- todo -->

        <div class="approval-box">
            <vxe-table
                border
                header-align="center"
                :show-overflow="false"
                max-height="563px"
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
                        <span>{{ projectNameMap[row.projectId] || '' }}</span>
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
                        {{ taskTypeMap[row.taskTypeId] || '' }}
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
                            同意
                        </button>
                    </template>
                </vxe-column>
            </vxe-table>
        </div>

        <!-- 申请审批 -->
        <el-dialog v-model="showAgreeDialog" title="任务申请审批" modal="true">
            <el-form :model="form">
                <!-- 任务点数 -->
                <el-form-item label="任务点数" prop="point" :label-width="120">
                    <el-input type="text" v-model="form.point" />
                </el-form-item>
                <!-- 计划完成小时数 -->
                <el-form-item
                    label="计划完成小时数"
                    prop="name"
                    :label-width="120"
                >
                    <el-input v-model="form.finishHour" />
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
                        />
                    </el-col>
                    <el-col :span="2" style="text-align: center">
                        <span>-</span>
                    </el-col>
                    <el-col :span="11">
                        <!-- 将来可能只需要小时 -->
                        <!-- <el-select
                            v-model="form.finishDateTime"
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
                            :selected-time="form.finishDate"
                            @update-time="handleTimeUpdate"
                        ></hour-and-min-select>
                    </el-col>
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
                        @click="agreeFun"
                        class="btn-sure"
                    >
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
@import '../../assets/css/variables.scss';
.el-dialog--center .el-dialog__footer {
    text-align: right !important;
}
.el-dialog__footer {
    text-align: right !important;
}
.approval_container {
    .approval-box {
        margin-top: 15px;
        padding-bottom: 15px;
        margin-inline: 16px;
        background-color: #fff;
        border-radius: 2px;
        padding-top: 16px;
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
</style>
