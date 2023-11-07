<script setup>
import NavBarVue from '@/layout/navBar/NavBar.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { isMobileDevice } from '@/utils/device/isMobile';
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
const router = useRouter();

const applyClickBtn = () => {
    router.push({ path: '/dashboard/apply' });
};

const approvalClickBtn = () => {
    router.push({ path: '/dashboard/approval' });
};

const urllistClickBtn = () => {
    router.push({ path: '/dashboard/urllist' });
};
</script>

<template>
    <div class="explore_container" v-if="isMobileDevice">
        <!-- navbar部分 -->
        <NavBarVue></NavBarVue>
        <!-- 菜单导航 -->
        <div class="menu-container">
            <!-- 任务申请 -->
            <div
                class="apply-content menu"
                @click="applyClickBtn"
                v-if="authorityList.includes('WEB_TaskApply')"
            >
                <div class="title">任务申请</div>
                <div class="icon">
                    <van-icon name="arrow" />
                </div>
            </div>
            <!-- 任务审批 -->
            <div
                class="approval-content menu"
                @click="approvalClickBtn"
                v-if="authorityList.includes('WEB_TaskApplyAudit')"
            >
                <div class="title">任务审批</div>
                <div class="icon">
                    <van-icon name="arrow" />
                </div>
            </div>
            <!-- 网站管理 -->
            <div
                class="urllist-content menu"
                @click="urllistClickBtn"
                v-if="authorityList.includes('WEB_URLList')"
            >
                <div class="title">网站管理</div>
                <div class="icon">
                    <van-icon name="arrow" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.explore_container {
    height: 100%;
}

.menu-container {
    // display: flex;
    // flex-wrap: wrap;
    // align-items: flex-start;
    // justify-content: space-around;

    background-color: #f3f7ff;
    // background-color: green;
    height: 75%;
    padding-top: 15px;

    .menu {
        padding: 5px 20px;
        // min-width: 250px;
        width: 100%;
        height: 60px;
        text-align: center;
        // flex: 1;
        border-bottom: 1px solid #ececec;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title {
        color: #666;
    }

    .icon {
        color: #999;
    }
}
</style>
