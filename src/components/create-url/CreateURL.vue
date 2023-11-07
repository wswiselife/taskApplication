<script setup>
import { ref, reactive } from 'vue';
import { useAddURLListStore } from '@/store/modules/urllist.js';
// import { ElMessage } from 'element-plus';
import { useIsCreatedURLStore } from '@/store/public';
// import { useRouter } from 'vue-router';
import debounce from 'lodash/debounce';
// 设备检测
import { isMobileDevice } from '@/utils/device/isMobile';
// import { showFailToast } from 'vant';
import {
    showFailMessage,
    showSuccessMessage,
} from '@/utils/show-message/showSFmessage';

import { validateURLInput } from '@/utils/validate/validateURL';
/********************************\
 * 公共引入处理
\********************************/
// const router = useRouter();
/********************************\
 * 控制弹出层表单显示隐藏
\********************************/
const dialogFormVisible = ref(false);

// 点击创建按钮发送请求，获取权限接口数据
function dialogFormVisibleFun() {
    // 打开对话框
    dialogFormVisible.value = true;
    focusInput();
}
/********************************\
 * 创建后同步列表
\********************************/
const isCreateStoreURL = useIsCreatedURLStore();

/********************************\
 * 创建url
\********************************/
const addURLListStore = useAddURLListStore();

const formLabelWidth = '100px';
const form = reactive({
    url: '',
    description: '',
});
function resetForm() {
    form.url = '';
    form.description = '';
}

async function createURLBtn() {
    if (!form.url) {
        showFailMessage('网站地址不能为空。');
        return;
    }

    if (!form.description) {
        showFailMessage('网站说明不能为空。');
        return;
    }

    const validateURLInputResult = validateURLInput(form.url);
    if (!validateURLInputResult.isValid) {
        showFailMessage(validateURLInputResult.message);
        return;
    }

    // 打开禁止编辑表单
    isSubmitting.value = true;

    const response = await addURLListStore.fetchAddURLListAction(form);
    // console.log('add response ===', response);
    if (response && response.code === 200) {
        // 关闭对话框
        dialogFormVisible.value = false;
        showMobileCreateDialog.value = false;
        // 数据共享
        isCreateStoreURL.setIsCreatedURL(true);
        // 提示新建完成
        showSuccessMessage(`说明为${form.description}的网址新增成功。`);
        // 清除所有数据
        resetForm();
        // 成功后关闭禁止编辑表单
        isSubmitting.value = false;
    } else {
        showMobileCreateDialog.value = false;
        showFailMessage(response.message);
        // 成功后关闭禁止编辑表单
        isSubmitting.value = false;
    }
}
/********************************\
 * 焦点控制
\********************************/
const descriptionRef = ref(null);
const focusInput = () => {
    descriptionRef.value.focus();
};

/********************************\
 * 防抖处理
\********************************/
const debounceCreateURLBtn = debounce(createURLBtn, 600);
const showMobileCreateDialog = ref(false);

/********************************\
 * 处理提交之后网络延迟可以继续修改表单问题
\********************************/
const isSubmitting = ref(false);

const closeCreateDialog = () => {
    isSubmitting.value = false;
};
/********************************\
 * 移动端新增按钮
\********************************/
const clickMobileCreate = () => {
    // console.log('点击了新增按钮');
    showMobileCreateDialog.value = true;
    dialogFormVisibleFun();
};

/********************************\
 * 弹出层处理（请求）
\********************************/
const handleCreateBeforeClose = async (action) => {
    if (action === 'confirm') {
        // 在这里执行你的函数
        // 如果你想要关闭弹出框，调用 done()
        await debounceCreateURLBtn();
    } else {
        // 如果是取消操作，直接关闭弹出框
        showMobileCreateDialog.value = false;
    }
};
</script>

<template>
    <!-- pc端 -->
    <div class="urllist_container" v-if="!isMobileDevice">
        <el-button @click="dialogFormVisibleFun" class="create">新增</el-button>

        <!-- 弹出框 -->
        <el-dialog
            v-model="dialogFormVisible"
            title="网址新增"
            modal="true"
            class="dialog-content"
            @opened="focusInput"
            @close="closeCreateDialog"
        >
            <el-form :model="form" :disabled="isSubmitting">
                <!-- 描述内容 -->
                <el-form-item
                    label="网址说明"
                    prop="description"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        v-model="form.description"
                        placeholder="请填写网址说明"
                        ref="descriptionRef"
                    />
                </el-form-item>
                <!-- url -->
                <el-form-item
                    label="网址"
                    prop="url"
                    :label-width="formLabelWidth"
                >
                    <el-input v-model="form.url" placeholder="请填写网址" />
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
                        @click="debounceCreateURLBtn"
                        class="btn-sure"
                    >
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
    <!-- 移动端 -->
    <div class="mobile-create-container" v-if="isMobileDevice">
        <!-- 加号添加 -->
        <van-icon name="add-o" size="22" @click="clickMobileCreate" />

        <!-- 新增弹出框 -->
        <van-dialog
            v-model:show="showMobileCreateDialog"
            title="网址新增"
            show-cancel-button
            :before-close="handleCreateBeforeClose"
            :close-on-click-overlay="true"
            @opened="focusInput"
            @cancel="closeCreateDialog"
        >
            <van-form :disabled="isSubmitting">
                <!-- 计划完成时间 -->
                <van-field
                    label="网址说明"
                    v-model="form.description"
                    placeholder="请输入网址说明"
                    ref="descriptionRef"
                ></van-field>
                <!-- 任务描述 -->
                <van-field
                    label="网址"
                    v-model="form.url"
                    placeholder="请输入网址"
                ></van-field>
            </van-form>
        </van-dialog>
    </div>
</template>

<style scoped lang="scss">
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
.urllist_container {
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
</style>
