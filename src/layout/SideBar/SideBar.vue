<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 10:50:36
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-13 15:53:37
 * @FilePath: \taskApplication\src\layout\SideBar\SideBar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE.
-->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isMobileDevice } from '@/utils/device/isMobile';
// 链接审批数据共享
import { useIsLinkApprovalStore } from '@/store/public';
import { storeToRefs } from 'pinia';
/********************************\ 
 * 公共引入处理
\********************************/
const router = useRouter();
const route = useRoute();

const isLinkApprovalStore = useIsLinkApprovalStore();

const { isLinkApproval } = storeToRefs(isLinkApprovalStore);

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
 * 申请人申请任务
\********************************/
function applyTask() {
    // console.log('点击申请人');
    router.push({
        path: '/dashboard/apply',
    });
}
/********************************\ 
 * 审批人审批任务
\********************************/
function approvalTask() {
    // console.log('点击审批人');
    router.push({
        path: '/dashboard/approval',
    });
}
/********************************\ 
 * urllist
\********************************/
function urllist() {
    // console.log('点击审批人');
    router.push({
        path: '/dashboard/urllist',
    });
}

/********************************\ 
 * 处理选中的内容
\********************************/
const isApplyRouteActive = computed(() => {
    return route.path === '/dashboard/apply';
});

const isApprovalRouteActive = computed(() => {
    return route.path === '/dashboard/approval';
});
const isURLListRouteActive = computed(() => {
    return route.path === '/dashboard/urllist';
});
</script>

<template>
    <div class="sidebar_container" v-if="!isMobileDevice && !isLinkApproval">
        <el-menu class="el_menu">
            <!-- 没有子选项 -->
            <el-menu-item
                index="1"
                @click="applyTask"
                v-if="authorityList.includes('WEB_TaskApply')"
                :class="{ 'active-route': isApplyRouteActive }"
            >
                <el-icon><List /></el-icon>
                <span>任务申请</span>
            </el-menu-item>
            <!-- 拥有子选项 -->
            <el-menu-item
                index="2"
                @click="approvalTask"
                v-if="authorityList.includes('WEB_TaskApplyAudit')"
                :class="{ 'active-route': isApprovalRouteActive }"
            >
                <el-icon><Checked /></el-icon>
                <span>任务审批</span>
            </el-menu-item>
            <!-- urllist -->
            <el-menu-item
                index="3"
                @click="urllist"
                v-if="authorityList.includes('WEB_URLList')"
                :class="{ 'active-route': isURLListRouteActive }"
            >
                <el-icon><Platform /></el-icon>
                <span>网址管理</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<style scoped lang="scss">
@import '../../assets/css/variables.scss';

.el-menu {
    border-right: none;
}

.el-menu-item {
    height: 52px;
    border-left: none;
    color: #333;
}

// 路由被选中时
// .el-menu-item.is-active {
//     background-color: $color-primary;
//     color: $color-bfont;
// }

// 路由被选中时
.active-route {
    background: linear-gradient(90deg, #ffffff 0%, #f3f7ff 100%);
    border-right: 3px solid #1768e4;
}
</style>
