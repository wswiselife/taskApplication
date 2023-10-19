<script setup>
import { ref, reactive } from 'vue';
import { useAddURLListStore } from '@/store/modules/urllist.js';
import { ElMessage } from 'element-plus';
import { useIsCreatedURLStore } from '@/store/public';
import { useRouter } from 'vue-router';
/********************************\
 * 公共引入处理
\********************************/
const router = useRouter();
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
    const response = await addURLListStore.fetchAddURLListAction(form);
    // console.log('add response ===', response);
    if (response && response.code === 401) {
        ElMessage({
            type: 'error',
            message: response.message,
        });
        router.push({ path: '/login' });
        // 禁止浏览器的后退功能
        window.addEventListener('popstate', function () {
            history.go(1);
        });
    }
    if (response && response.code === 200) {
        // 关闭对话框
        dialogFormVisible.value = false;
        // 数据共享
        isCreateStoreURL.setIsCreatedURL(true);
        // 提示新建完成
        ElMessage({
            message: `说明为${form.description}的网址新增成功。`,
            type: 'success',
        });
        // 清除所有数据
        resetForm();
    } else {
        ElMessage({
            type: 'error',
            message: response.message,
        });
    }
}
/********************************\
 * 焦点控制
\********************************/
const descriptionRef = ref(null);
const focusInput = () => {
    descriptionRef.value.focus();
};
</script>

<template>
    <div class="urllist_container">
        <el-button @click="dialogFormVisibleFun" class="create">新增</el-button>

        <!-- 弹出框 -->
        <el-dialog
            v-model="dialogFormVisible"
            title="网址新增"
            modal="true"
            class="dialog-content"
            @opened="focusInput"
        >
            <el-form :model="form">
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
                        @click="createURLBtn"
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
    margin-left: 24px;
    margin-bottom: 11px;
}
</style>
