<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 16:37:21
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-18 13:53:21
 * @FilePath: \taskApplication\src\views\approvalTask\ApprovalTask.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEmport
-->
<script setup>
import { useAuditTaskStore, useAgreeTaskStore } from '@/store/modules/task';
import { storeToRefs } from 'pinia';
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getFormattedDateTwo } from '@/utils/format/formatDate';
import { formatProjectName, formatTaskType } from '@/assets/data/vxeColumnData';
// import { disabledPreviousDates } from '@/utils/limitDateSelect';
import { disabledPreviousDates } from '@/utils/limit/limitDateSelect';
// 小时数校验
import { validateHoursInput } from '@/utils/validate/validateHoursInput';
// 点数校验
import { validatePoint } from '@/utils/validate/validatePoint';
/********************************\
 * 公共引入处理
\********************************/
onMounted(() => {
    getAuditUserData();
});

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
            message: '任务审批失败',
            type: 'error',
        });
    }
}

/********************************\
 * 日期选择限制//todo
\********************************/
</script>

<template>
    <div class="approval_container">
        <!--  暂时不启动编辑功能   :edit-config="{ trigger: 'dblclick', mode: 'cell' }" -->
        <!-- projectList、taskTypeList、auditUserList也没获取 -->
        <!-- todo -->
        <vxe-table
            border
            align="center"
            show-overflow
            max-height="600px"
            :data="auditTaskList"
            :column-config="{ resizable: true, useKey: 'field' }"
            :row-config="{ useKey: 'id' }"
            round
            @edit-actived="handleCellActivated"
            @edit-closed="handleCellClosed"
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

            <!-- 任务类型 -->
            <vxe-column
                field="taskTypeName"
                title="任务类型"
                :edit-render="{}"
                width="100px"
            >
                <template #default="{ row }">
                    {{ formatTaskType(row.taskTypeId) }}
                </template>
                <template #edit="{ row }">
                    <vxe-select v-model="row.taskTypeId" type="text" transfer>
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
                width="250px"
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
            ></vxe-column>
            <!-- 操作 -->
            <vxe-column field="operate" title="操作" width="180px">
                <template #default="{ row }">
                    <button @click="showAgreeDialogFun(row.id)" class="agree">
                        同意
                    </button>
                </template>
            </vxe-column>
        </vxe-table>

        <!-- 弹出点数 -->
        <el-dialog v-model="showAgreeDialog" title="同意申请" modal="true">
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
                    <el-date-picker
                        v-model="form.finishDate"
                        type="date"
                        placeholder="选择计划完成日期"
                        style="width: 100%"
                        :disabledDate="disabledPreviousDates"
                    />
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
.approval_container {
    .agree {
        padding: 5px 8px;
        background-color: #f0f0f0;
        // border: 1px solid #ccc;
        border: none;
        border-radius: 5px;
    }

    .agree:hover {
        color: $color-bfont;
        background-color: #ccc;
    }

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
}
</style>
