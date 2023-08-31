<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 10:50:36
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-08-31 16:46:35
 * @FilePath: \taskApplication\src\layout\SideBar\SideBar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE.
-->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

/********************************\ 
 * 公共引入处理
\********************************/
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
 * 前往待审批（普通用户）
\********************************/
function pendingtaskClick() {
    router.push({
        path: '/layout/pendingtask',
    });
}
/********************************\ 
 * 前往给普通用户审批
\********************************/
function adminpendingtask() {
    router.push({
        path: '/layout/adminpendingtask',
    });
}
</script>

<template>
    <div class="sidebar_container">
        <div class="board"></div>

        <el-menu class="el_menu">
            <!-- 没有子选项 -->
            <el-menu-item
                index="1"
                @click="pendingtaskClick"
                v-if="authorityList.includes('WEB_TaskApply')"
            >
                <el-icon><document /></el-icon>
                <span>待审核任务</span>
            </el-menu-item>
            <!-- 拥有子选项 -->
            <el-menu-item
                index="2"
                @click="adminpendingtask"
                v-if="authorityList.includes('WEB_TaskApprover')"
            >
                <el-icon><location /></el-icon>
                <span>待审批任务</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<style scoped></style>
