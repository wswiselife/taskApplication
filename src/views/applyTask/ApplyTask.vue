<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 15:40:06
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-12 15:38:22
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
<script setup>
import {
    useUserProjectListStore,
    useTaskTypeListStore,
    useAuditUserListStore,
    useUpdateTaskStore,
    useEmployeeTaskStore,
    useDeleteTaskStore,
} from '@/store/modules/task.js';

import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import { formatDate } from '@/utils/formatTime';
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

/********************************\
 * 获取列表数据并渲染
\********************************/
function getEmployeeTasList() {
    employeeTaskStore.fetchEmployeeTaskAction();
    console.log('申请列表数据 ===', employeeTaskList);
}
// 列表展示数据
const employeeTaskStore = useEmployeeTaskStore();
// 这里一定要用storeTorefs,而不是ref
const { employeeTaskList } = storeToRefs(employeeTaskStore);

/********************************\
 * 控制弹出层、表单响应
\********************************/
const dialogFormVisible = ref(false);
const formLabelWidth = '120px';
// 储存选择的那条数据
const chooseModifyId = ref(null);
// console.log('employeeTaskList任务描述 ===', employeeTaskList);

const form = reactive({
    taskDescription: '', // 任务描述
    projectId: null, // 项目 ID
    planFinishHour: 1, // 计划完成小
    taskTypeId: null, // 任务类别 ID时数
    planFinishDate: '', // 计划完成日期
    applyAuditId: null, // 审批人ID
    id: chooseModifyId.value,
});

/********************************\
 * 修改内容
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
    }
}
/********************************\
 * 获取用户有权限的项目
\********************************/
const projectList = ref([]);
async function getUserProjectList() {
    const response = await userProjectList.fetchUserProjectListAction();
    console.log(' projectionName-response ===', response);
    if (response && response.code === 200) {
        projectList.value = response.result;
    } else {
        ElMessage({
            message: response.message,
            type: 'error',
        });
    }
}

/********************************\
 * 获取任务类别ID
\********************************/
const taskTypeList = ref([]);
async function getTaskTypeList() {
    const response = await useTaskTypeList.fetchTaskTypeListAction();
    if (response && response.code === 200) {
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
    const response = await useAuditTypeList.fetchAuditUserListAction();
    if (response && response.code === 200) {
        auditUserList.value = response.result;
    } else {
        ElMessage({
            message: '获取审批人失败',
            type: 'error',
        });
    }
}

/********************************\
 * 点击弹出框的修改（确定）按钮
\********************************/
async function modify() {
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
                message: '修改任务成功',
                type: 'success',
            });
            getEmployeeTasList(); // 重新获取数据
        } else {
            // 可以添加其他的错误处理逻辑
            ElMessage({
                message: response.meaasge,
                type: 'error',
            });
        }
    } catch (error) {
        console.log('error ===', error);
        // 取消弹出框
        dialogFormVisible.value = false;
        ElMessage({
            message: '修改申请失败',
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
        const response = await deleteTask.fetchDeleteTaskAction(
            chooseDeleteId.value,
        );

        // console.log('删除的 response ===', response);
        if (response && response.code === 200) {
            // 清除对话框
            showDeleteDialog.value = false;
            // 提示新建完成
            ElMessage({
                message: '删除任务成功',
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
        ElMessage({
            message: '删除失败',
            type: 'error',
        });
    }
}

/********************************\
 * 选项方式修改
\********************************/
// const projectNameList = ref([
//     { label: '希瑞', value: '116' },
//     { label: '上线问题列表', value: '115' },
//     { label: '鼎鹏', value: '1' },
//     { label: '本田金属', value: '2' },
//     { label: 'TaskList', value: '4' },
//     { label: 'android学习', value: '5' },
//     { label: '万宝', value: '6' },
//     { label: '今先', value: '7' },
//     { label: '', value: '' },
// ]);

const formatProjectName = (id) => {
    if (id == '116') {
        return '希瑞';
    }
    if (id == '115') {
        return '上线问题列表';
    }
    if (id == '1') {
        return '鼎鹏';
    }
    if (id == '2') {
        return '本田金属';
    }
    if (id == '4') {
        return 'TaskList';
    }

    if (id == '5') {
        return 'android学习';
    }
    if (id == '6') {
        return '万宝';
    }
    if (id == '7') {
        return '今仙';
    }
    return '';
};

/********************************\
 * 触发单元格编辑时
\********************************/
function handleCellActivated() {
    console.log('projectList ===', projectList.value);
}

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
</script>

<template>
    <div class="apply_container">
        <!-- vxe 表格 -->
        <vxe-table
            border
            align="center"
            show-overflow
            :data="employeeTaskList"
            :column-config="{ resizable: true, useKey: 'field' }"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
            :row-config="{ useKey: 'id' }"
            round
            @edit-actived="handleCellActivated"
            @edit-closed="handleCellClosed"
            :cell-config="{ selected: true }"
            @cell-click="handleCellClick"
            ref="xTable"
        >
            <!-- 预警ID -->
            <!-- <vxe-column field="id" title="ID" width="50px"></vxe-column> -->
            <!-- 项目名称 -->
            <vxe-column
                field="projectName"
                title="项目名称"
                :edit-render="{}"
                width="120px"
            >
                <template #default="{ row }">
                    <span>{{ formatProjectName(row.projectId) }}</span>
                </template>
                <template #edit="{ row }">
                    <vxe-select v-model="row.projectId" type="text" transfer>
                        <vxe-option
                            v-for="project in projectList"
                            :key="project.id"
                            :label="project.name"
                            :value="project.id"
                        />
                    </vxe-select>
                </template>
            </vxe-column>
            <!-- 项目描述 -->
            <vxe-column
                field="taskDescription"
                title="项目描述"
                :edit-render="{}"
                width="250px"
            >
                <template #edit="{ row }">
                    <vxe-input
                        v-model="row.taskDescription"
                        type="text"
                    ></vxe-input>
                </template>
            </vxe-column>
            <!-- 项目类型 -->
            <vxe-column
                field="taskTypeName"
                title="项目类型"
                :edit-render="{}"
                width="100px"
            >
                <template #edit="{ row }">
                    <vxe-input
                        v-model="row.taskTypeName"
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
                width="140px"
            >
                <template #default="{ row }">
                    {{ formatDate(row.planFinishDate) }}
                </template>
                <template #edit="{ row }">
                    <vxe-input
                        v-model="row.planFinishDate"
                        type="date"
                        placeholder="请选择计划完成日期"
                        transfer
                    ></vxe-input>
                </template>
            </vxe-column>
            <!-- 审批人 -->
            <vxe-column
                field="applyAuditName"
                title="审批人"
                :edit-render="{}"
                width="100px"
            >
                <template #edit="{ row }">
                    <vxe-input
                        v-model="row.applyAuditName"
                        type="text"
                    ></vxe-input>
                </template>
            </vxe-column>
            <!-- 操作 -->
            <vxe-column field="operate" title="操作" width="180px">
                <template #default="{ row }">
                    <button
                        @click="dialogFormVisibleFun(row.id)"
                        class="update"
                    >
                        修改
                    </button>
                    <button @click="showDeleteDialogFun(row.id)" class="delete">
                        删除
                    </button>
                </template>
            </vxe-column>
        </vxe-table>

        <!-- 修改的弹出框 -->
        <el-dialog v-model="dialogFormVisible" title="修改申请" modal="true">
            <el-form :model="form">
                <!-- 项目ID-选择框 -->
                <el-form-item
                    label="项目"
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
                    label="任务类别"
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
                    <el-date-picker
                        v-model="form.planFinishDate"
                        type="date"
                        placeholder="选择计划完成日期"
                        style="width: 100%"
                    />
                </el-form-item>

                <!-- 任务描述 -->
                <el-form-item
                    label="任务描述"
                    prop="desc"
                    :label-width="formLabelWidth"
                >
                    <el-input type="textarea" v-model="form.taskDescription" />
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
        <el-dialog v-model="showDeleteDialog" title="删除申请">
            确定删除申请吗
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
</template>

<style scoped lang="scss">
@import '../../assets/css/variables.scss';

.apply_container {
    // TODO: 添加样式

    // margin: 25px auto;

    .update,
    .delete {
        padding: 5px 8px;
        background-color: #f0f0f0;
        // border: 1px solid #ccc;
        border: none;
        border-radius: 5px;
    }

    .update:hover {
        color: $color-bfont;
        background-color: #ccc;
    }

    .delete:hover {
        color: $color-bfont;
        background-color: #ccc;
    }

    .update {
        margin-right: 15px;
    }

    // 对话框按钮样式
    .el-button.btn-cancel {
        color: $color-bfont;
        background-color: #f0f0f0;
        border: none;
    }

    .btn-sure {
        color: $color-wfont;
        background-color: $color-primary;
    }

    .btn-sure:hover {
        color: $color-bfont;
        background-color: $color-primary;
    }

    .el-button.btn-cancel:hover {
        background-color: #ccc;
    }

    // 对话框右上角取消btn
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
        color: $color-bfont;
    }
}
</style>
