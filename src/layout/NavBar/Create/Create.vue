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
import { reactive, ref } from 'vue';
const createTask = useCreateTaskStore();
const userProjectList = useUserProjectListStore();
const useTaskTypeList = useTaskTypeListStore();
const useAuditTypeList = useAuditUserListStore();
import { ElMessage } from 'element-plus';

/********************************\
 * 控制弹出层、表单响应
\********************************/
const dialogFormVisible = ref(false);
const formLabelWidth = '120px';

const form = reactive({
    taskDescription: '', // 任务描述
    projectId: null, // 项目 ID
    taskTypeId: null, // 任务类别 ID
    planFinishHour: 1, // 计划完成小时数
    pianFinishData: '', // 计划完成日期
    applyAuditId: null, // 审批人ID
});

/********************************\
 * dialog 控制处理(缓存优化)
\********************************/
// 点击的时候发送请求
function dialogFormVisibleFun() {
    dialogFormVisible.value = true;
    // 调用用户权限项目接口
    getUserProjectList();
    // 调用获取任务类型接口
    getTaskTypeList();
    // 调用审批人接口
    getAuditUserList();
}
/********************************\
 * 获取用户有权限的项目
\********************************/
const projectList = ref([]);
async function getUserProjectList() {
    const response = await userProjectList.fetchUserProjectListAction();
    if (response && response.code === 200) {
        projectList.value = response.result;
    }
    // console.log('用户有权限的项目 response ===', response);
}

/********************************\
 * 获取任务类别ID
\********************************/
const taskTypeList = ref([]);
async function getTaskTypeList() {
    const response = await useTaskTypeList.fetchTaskTypeListAction();
    if (response && response.code === 200) {
        taskTypeList.value = response.result;
    }
    // console.log('任务类型ID response ===', response);
}

/********************************\
 * 获取审批人ID
\********************************/
const auditUserList = ref([]);
async function getAuditUserList() {
    const response = await useAuditTypeList.fetchAuditUserListAction();
    if (response && response.code === 200) {
        auditUserList.value = response.result;
    }
    // console.log('审批人ID response ===', response);
}

/********************************\
 * 完成日期格式化
\********************************/

// function formatTime () {

// }

/********************************\
 * 创建按钮
\********************************/
async function createTaskBtn() {
    // 取消弹出框
    dialogFormVisible.value = false;

    try {
        const response = await createTask.fetchCreateTaskAction(form);
        console.log(' Create 页面 response ===', response);

        if (response && response.code === 200) {
            // 提示新建完成
            ElMessage({
                message: '新建任务成功',
                type: 'success',
            });
        } else {
            // 可以添加其他的错误处理逻辑
            ElMessage({
                message: '新建任务失败',
                type: 'error',
            });
        }
    } catch (error) {
        console.error('Error during task creation:', error);
        ElMessage({
            message: '新建任务出错',
            type: 'error',
        });
    }
}
</script>

<template>
    <div class="create_container">
        <el-button>request</el-button>
        <el-button @click="dialogFormVisibleFun">创建</el-button>

        <!-- 弹出框 -->
        <el-dialog v-model="dialogFormVisible" title="新建任务" modal="true">
            <el-form :model="form">
                <!-- 任务描述 -->
                <el-form-item
                    label="任务描述"
                    prop="desc"
                    :label-width="formLabelWidth"
                >
                    <el-input type="textarea" v-model="form.taskDescription" />
                </el-form-item>
                <!-- 项目ID-选择框 -->
                <el-form-item
                    label="项目ID"
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
                    label="任务类别ID"
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
                        v-model="form.pianFinishData"
                        type="date"
                        placeholder="选择计划完成日期"
                        style="width: 100%"
                    />
                </el-form-item>
                <!-- 审批人ID-选择框 -->
                <el-form-item
                    label="审批人ID"
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
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">
                        取消
                    </el-button>
                    <el-button type="primary" @click="createTaskBtn">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
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
</style>

<style scoped lang="scss">
.create_container {
}
</style>
