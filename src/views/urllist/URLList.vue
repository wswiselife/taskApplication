<script setup>
import { onMounted, ref, watch, reactive } from 'vue';
import {
    useGetURLListStore,
    useUpdateURLListStore,
    useDeleteURLListStore,
} from '@/store/modules/urllist';
import { storeToRefs } from 'pinia';
import CreateURL from '@/components/create-url/CreateURL.vue';
import { useIsCreatedURLStore } from '@/store/public';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import debounce from 'lodash/debounce';
// 设备检测
import { isMobileDevice } from '@/utils/device/isMobile';
import { showFailToast } from 'vant';

/********************************\
 * 公共引入处理
\********************************/
const isDataLoaded = ref(false);
onMounted(async () => {
    getURLList();
    isDataLoaded.value = true;
});

const router = useRouter();
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
 * 获取urllist
\********************************/
async function getURLList() {
    // await getURLListStore.fetchGetURLListAction();
    await getURLListStore.fetchGetURLListAction();
    // console.log('网站管理 urllist ===', urllist);
}
const getURLListStore = useGetURLListStore();
// urllist 列表渲染
const { urllist } = storeToRefs(getURLListStore);
// 获取创建成功的数据，状态通信
const isCreatedURLStore = useIsCreatedURLStore();
const { isCreatedURL } = storeToRefs(isCreatedURLStore);
watch(isCreatedURL, (newValue) => {
    if (newValue) {
        getURLList();
        isCreatedURLStore.setIsCreatedURL(false);
    }
});

/********************************\
 * 补全修改时的内容
\********************************/
const updateCurrentId = ref();
//控制修改dialog显示或隐藏
const updateDialogVisible = ref(false);
// 打开时，获取信息并填充
const updateURLDialogBtn = (currentId) => {
    updateDialogVisible.value = true;
    // console.log('update currentId ===', currentId);
    updateCurrentId.value = currentId;
    // console.log('updateCurrentId ===', updateCurrentId.value);
    // 将已有数据填写到表单中
    const selectedItem = urllist.value.find(
        (item) => item.id === updateCurrentId.value,
    );

    if (selectedItem) {
        form.description = selectedItem.description;
        form.url = selectedItem.url;
    }
};

/********************************\
 * 修改 urllist
\********************************/
const formLabelWidth = '100px';
const form = reactive({
    url: '',
    description: '',
    id: '',
});

const updateURLListStore = useUpdateURLListStore();
const updateURLFun = async () => {
    if (!form.description) {
        if (isMobileDevice) {
            showFailToast('网站说明不能为空');
        } else {
            ElMessage({
                message: '网站说明不能为空',
                type: 'error',
            });
        }
        return;
    }

    if (!form.url) {
        if (isMobileDevice) {
            showFailToast('网站地址不能为空');
        } else {
            ElMessage({
                message: '网站地址不能为空',
                type: 'error',
            });
        }
        return;
    }

    // 确定修改的id
    form.id = updateCurrentId.value;
    // 发送请求
    // 打开禁止编辑表单
    isSubmitting.value = true;
    const response = await updateURLListStore.fetchUpdteURLListAction(form);
    // console.log('update response ===', response);

    if (response && response.code === 200) {
        ElMessage({
            type: 'success',
            message: `说明为${form.description}的网址修改成功。`,
        });
        // 重新渲染列表
        getURLList();
        updateDialogVisible.value = false;
        showMobileUpdataDialog.value = false;
        // 成功后关闭禁止编辑表单
        isSubmitting.value = false;
    } else {
        showMobileUpdataDialog.value = false;
        // 成功后关闭禁止编辑表单
        isSubmitting.value = false;
        ElMessage({
            type: 'error',
            message: response.message,
        });
    }
};
/********************************\
 * 显示删除弹出框
\********************************/
//控制dialog显示或隐藏
const deleteDialogVisible = ref(false);
const deleteCurrentId = ref();
const deleteDescription = ref('');
const deleteURLDialogBtn = (currentId) => {
    deleteDialogVisible.value = true;
    deleteCurrentId.value = currentId;
    // 获取id之后，找到说明并存储
    // 获取 auditTaskList 中的完成时间和完成小时数
    const selectedItem = urllist.value.find(
        (item) => item.id === deleteCurrentId.value,
    );
    if (selectedItem) {
        // 更新form对象的值
        deleteDescription.value = selectedItem.description;
    }
};
/********************************\
 * 删除 urllist
\********************************/
const deleteURLListStore = useDeleteURLListStore();

const deleteURLFun = async () => {
    try {
        const response = await deleteURLListStore.fetchDeleteURLListAction(
            deleteCurrentId.value,
        );
        // console.log('response ===', response);
        if (response && response.code === 200) {
            ElMessage({
                type: 'success',
                message: `说明为${deleteDescription.value}的网址删除成功`,
            });
            getURLList();
            deleteDialogVisible.value = false;
        }
    } catch (error) {
        console.log('error ===', error);
    }
};
/********************************\
 * 防抖处理
\********************************/
const debounceUpdateURLFun = debounce(updateURLFun, 600);
/********************************\
 * 防抖处理
\********************************/
const debounceDeleteURLFun = debounce(deleteURLFun, 600);

/********************************\
 * 处理提交之后网络延迟可以继续修改表单问题
\********************************/
const isSubmitting = ref(false);

const closeUpdateDialog = () => {
    isSubmitting.value = false;
};

/********************************\
 * 移动端返回上一步
\********************************/
const goBack = () => {
    router.push({ path: '/mobileexplore' });
};
/********************************\
 * 移动端修改补全函数
\********************************/
const showMobileUpdataDialog = ref(false);

// 补全数据
const showMobileUpdataDialogBtn = (currentId) => {
    showMobileUpdataDialog.value = true;
    updateCurrentId.value = currentId;

    // 将已有数据填写到表单中
    // todo
    const selectedItem = urllist.value.find(
        (item) => item.id === updateCurrentId.value,
    );

    if (selectedItem) {
        form.description = selectedItem.description;
        form.url = selectedItem.url;
    }
};

/********************************\
 * 移动端弹出删除提示框
\********************************/
const showMobileDeleteDialog = ref(false);

// 删除弹出框显示
function showMobileDeleteDialogBtn(currentId) {
    showMobileDeleteDialog.value = true;
    deleteCurrentId.value = currentId;
}

/********************************\
 * 弹出层处理（修改）
\********************************/
const handleUpdateBeforeClose = async (action) => {
    if (action === 'confirm') {
        await debounceUpdateURLFun();
    } else {
        showMobileUpdataDialog.value = false;
    }
};
</script>

<template>
    <!-- pc端 -->
    <div
        class="urllist_container"
        v-if="authorityList.includes('WEB_URLList') && !isMobileDevice"
    >
        <div class="urllist-content">
            <CreateURL></CreateURL>

            <div class="urllist-box">
                <vxe-table
                    :data="urllist"
                    class="table"
                    :column-config="{ resizable: true, useKey: 'field' }"
                    border
                    max-height="520px"
                    :row-config="{ useKey: 'id' }"
                    :scroll-y="{ enabled: false }"
                    round
                >
                    <vxe-column
                        field="description"
                        title="网址说明"
                        :edit-render="{}"
                        width="250px"
                        header-align="center"
                        align="left"
                    ></vxe-column>
                    <vxe-column
                        field="url"
                        title="网址"
                        :edit-render="{}"
                        min-width="250px"
                        header-align="center"
                        align="left"
                    >
                        <template #default="{ row }">
                            <a :href="row.url" target="_blank">{{ row.url }}</a>
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
                                @click="updateURLDialogBtn(row.id)"
                                class="update"
                            >
                                修改
                            </button>
                            <button
                                @click="deleteURLDialogBtn(row.id)"
                                class="delete"
                            >
                                删除
                            </button>
                        </template>
                    </vxe-column>
                </vxe-table>
            </div>
        </div>

        <!-- 修改弹出框 -->
        <el-dialog
            title="网址管理修改"
            v-model="updateDialogVisible"
            modal="true"
            @close="closeUpdateDialog"
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
                        @click="updateDialogVisible = false"
                        class="btn-cancel"
                    >
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="debounceUpdateURLFun"
                        class="btn-sure"
                    >
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 确定删除提示框 -->
        <el-dialog v-model="deleteDialogVisible" title="网址管理删除">
            {{ `请确认是否删除说明为${deleteDescription}的网址？` }}
            <template #footer>
                <span class="dialog-footer">
                    <el-button
                        @click="deleteDialogVisible = false"
                        class="btn-cancel"
                    >
                        取消
                    </el-button>
                    <el-button
                        type="primary"
                        @click="debounceDeleteURLFun"
                        class="btn-sure"
                    >
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>

    <!-- 移动端 -->
    <div
        class="mobile-container"
        v-if="authorityList.includes('WEB_URLList') && isMobileDevice"
    >
        <!-- 返回操作 -->
        <div class="turnback_container">
            <div class="navbar">
                <div class="goback" @click="goBack">
                    <van-icon name="arrow-left" />
                </div>
                <div class="title">网站管理</div>
                <div class="createBtn">
                    <CreateURL></CreateURL>
                </div>
            </div>
        </div>

        <div class="noData" v-if="urllist.length == 0 && isDataLoaded">
            暂时没有更多网站数据
        </div>
        <!-- main -->
        <div class="mobile-content">
            <div
                class="mobile-box"
                v-for="urlItem in urllist"
                :key="urlItem.id"
            >
                <!-- 网站说明： -->
                <div class="mobile-urldescription item-box">
                    <div class="taskCard-item">网址说明</div>
                    <div class="taskCard-content">
                        {{ urlItem.description }}
                    </div>
                </div>
                <!-- 网站地址： -->
                <div class="mobile-url item-box">
                    <div class="taskCard-item">网址</div>
                    <div class="taskCard-content taskDescription">
                        <a
                            :href="urlItem.url"
                            target="_blank"
                            style="display: block"
                            class="taskCard-content"
                        >
                            {{ urlItem.url }}
                        </a>
                    </div>
                </div>
                <!-- 操作 -->
                <div class="operate-box">
                    <div
                        class="mobile-update operate"
                        @click="showMobileUpdataDialogBtn(urlItem.id)"
                    >
                        <van-icon name="edit" />
                        修改
                    </div>

                    <div
                        class="mobile-delete operate"
                        @click="showMobileDeleteDialogBtn(urlItem.id)"
                    >
                        <van-icon name="delete-o" />
                        删除
                    </div>
                </div>
            </div>
        </div>

        <!-- 修改弹出框 -->
        <van-dialog
            v-model:show="showMobileUpdataDialog"
            title="网址管理修改"
            show-cancel-button
            :before-close="handleUpdateBeforeClose"
            :close-on-click-overlay="true"
            @cancel="closeUpdateDialog"
        >
            <van-form :disabled="isSubmitting">
                <!-- 网站描述 -->
                <van-field
                    label="网址说明"
                    v-model="form.description"
                    placeholder="请输入网址说明"
                ></van-field>
                <!-- 计划完成时间 -->
                <van-field
                    label="网址"
                    v-model="form.url"
                    placeholder="请输入网址"
                ></van-field>
            </van-form>
        </van-dialog>

        <!-- 删除弹出框 -->
        <van-dialog
            v-model:show="showMobileDeleteDialog"
            title="网址管理删除"
            show-cancel-button
            @confirm="debounceDeleteURLFun"
            :close-on-click-overlay="true"
        >
            <div class="delete-content">请确认是否删除网址。</div>
        </van-dialog>
    </div>
</template>

<!-- pc端样式 -->
<style scoped lang="scss">
.urllist_container {
    margin-top: 15px;
    width: calc(100vw - 160px);
}

.urllist-content {
    margin-inline: 16px;
    background-color: #fff;
    border-radius: 2px;
}
.urllist-box {
    padding-bottom: 15px;
    background-color: #fff;
    border-radius: 2px;
}

.table {
    margin: 0px 21px 10px 21px;
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
</style>

<!-- 移动端样式 -->
<style scoped lang="scss">
.mobile-container {
    // width: 100%;
    background-color: #f3f7ff;
}

.taskDescription {
    padding-bottom: 5px;
}
.navbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 15px 18px 10px 18px;
    background-color: #fff;
}

.delete-content {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 10px;
    // text-align: center;
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

.mobile-url {
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
</style>
