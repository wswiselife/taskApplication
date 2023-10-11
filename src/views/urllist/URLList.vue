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
/********************************\
 * 公共引入处理
\********************************/
onMounted(() => {
    getURLList();
});
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
    await getURLListStore.fetchGetURLListAction();
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
const form = reactive({
    url: '',
    description: '',
    id: '',
});

const updateURLListStore = useUpdateURLListStore();
const updateURLFun = async () => {
    // 确定修改的id
    form.id = updateCurrentId.value;
    // 发送请求
    const response = await updateURLListStore.fetchUpdteURLListAction(form);
    // console.log('update response ===', response);
    if (response && response.code === 200) {
        ElMessage({
            type: 'success',
            message: '修改URLList成功',
        });
        // 重新渲染列表
        getURLList();
        updateDialogVisible.value = false;
    }
};
/********************************\
 * 显示删除弹出框
\********************************/
//控制dialog显示或隐藏
const deleteDialogVisible = ref(false);
const deleteCurrentId = ref();
const deleteURLDialogBtn = (currentId) => {
    deleteDialogVisible.value = true;
    deleteCurrentId.value = currentId;
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
                message: 'URLList删除成功',
            });
            getURLList();
            deleteDialogVisible.value = false;
        }
    } catch (error) {
        console.log('error ===', error);
    }
};
</script>

<template>
    <div
        class="approval_container"
        v-if="authorityList.includes('WEB_URLList')"
    >
        <div class="urllist_container">
            <CreateURL></CreateURL>

            <div class="urllist-box">
                <vxe-table
                    :data="urllist"
                    class="table"
                    :column-config="{ resizable: true, useKey: 'field' }"
                    border
                    max-height="520px"
                    :scroll-y="{ enabled: false }"
                    round
                >
                    <vxe-column
                        field="description"
                        title="描述内容"
                        :edit-render="{}"
                        width="50% -90px"
                        header-align="center"
                        align="left"
                    ></vxe-column>
                    <vxe-column
                        field="url"
                        title="url地址"
                        :edit-render="{}"
                        width="50%-90px"
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
            title="修改URLList"
            v-model="updateDialogVisible"
            modal="true"
        >
            <el-form :model="form">
                <!-- 描述内容 -->
                <el-form-item
                    label="描述内容"
                    prop="description"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        v-model="form.description"
                        placeholder="请填写描述内容"
                    />
                </el-form-item>
                <!-- url -->
                <el-form-item
                    label="url地址"
                    prop="url"
                    :label-width="formLabelWidth"
                >
                    <el-input v-model="form.url" placeholder="请填写url地址" />
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
                        @click="updateURLFun"
                        class="btn-sure"
                    >
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 确定删除提示框 -->
        <el-dialog v-model="deleteDialogVisible" title="URLList删除">
            确定删除URLList吗
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
                        @click="deleteURLFun"
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
.urllist_container {
    margin-top: 15px;
    // padding-bottom: 15px;
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
