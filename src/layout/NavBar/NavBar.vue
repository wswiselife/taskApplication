<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 10:49:42
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-18 14:06:43
 * @FilePath: \taskApplication\src\layout\NavBar\NavBar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 10:49:42
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-01 17:07:45
 * @FilePath: \taskApplication\src\layout\NavBar\NavBar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { useRouter } from 'vue-router';

// import Create from './create/Create.vue';
import { ElMessage } from 'element-plus';
import { ref, computed } from 'vue';
import debounce from 'lodash/debounce';
// 链接审批数据共享
import { useIsLinkApprovalStore } from '@/store/public';
/********************************\
 * 公共引入处理
\********************************/
const router = useRouter();
const isLinkApprovalStore = useIsLinkApprovalStore();

// 设备检测
import { isMobileDevice } from '@/utils/device/isMobile';
import { storeToRefs } from 'pinia';
import { clearCacheFun } from '@/utils/clear-cache/clearCache';
/********************************\
 * 退出登录
\********************************/
async function logoutbtn() {
    // 清除本地缓存
    clearCacheFun();

    ElMessage({
        message: '已正常退出',
        type: 'success',
    });

    router.push({ path: '/login' });

    // 禁止浏览器的后退功能
    window.addEventListener('popstate', function () {
        history.go(1);
    });
}

/********************************\
 * 获取用户名
\********************************/
const username = ref(localStorage.getItem('username') || '?');

const firstLetter = computed(() => {
    return username.value && username.value.length > 0
        ? username.value[0].toUpperCase()
        : '';
});

/********************************\
 * 防抖
\********************************/
const debounceLogoutBtn = debounce(logoutbtn, 600);

/********************************\
 * 单独审批
\********************************/
const { isLinkApproval } = storeToRefs(isLinkApprovalStore);
// 持久化的问题
// const showLogoutBtn = isLinkApprovalStore.isLinkApproval;
</script>

<template>
    <!-- pc端 -->
    <div class="navbar_container" v-if="!isMobileDevice">
        <!-- navbar 左侧 -->
        <div class="navbar_left">
            <!-- logo -->
            <div class="logo">
                <img src="../../../public/logo.png" alt="logo" />
            </div>
            <!-- 创建按钮 -->
            <!-- <create></create> -->
        </div>

        <!-- 控制下拉弹出框的写法 -->
        <div class="navbar_right">
            <!-- 退出登录 -->
            <el-button
                class="logout"
                @click="debounceLogoutBtn"
                v-if="!isLinkApproval"
            >
                退出登录
            </el-button>

            <!-- 头像 -->
            <!-- <span class="username">{{ username }}</span> -->
            <div class="username_first_letter">{{ firstLetter }}</div>
            <!-- todo -->
            <!-- 省略号按钮，仅在移动设备上显示 -->
        </div>
    </div>

    <!-- 移动端 -->
    <div class="mobile-container" v-if="isMobileDevice">
        <!-- 背景 -->
        <div class="mobile-navbg">
            <!-- 首字母 -->
            <div class="user-firstletter">
                {{ firstLetter }}
            </div>
            <!-- 退出登录 -->
            <div class="mobile-logout" @click="debounceLogoutBtn">退出登录</div>
        </div>
    </div>
</template>

<!-- pc端 -->
<style scoped lang="scss">
@import '../../assets/css/variables.scss';

.navbar_container {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 1px 7px 0px rgba(123, 142, 223, 0.4);
    z-index: 999;

    .navbar_left {
        display: flex;
        justify-content: flex-start;
        flex-direction: center;
        align-items: center;
        height: 100%;
        margin-left: 23px;
    }

    .logo {
        height: 27px;
        padding-right: 23px;
    }

    .navbar_right {
        display: flex;
        justify-content: flex-end;
        flex-direction: center;
        align-items: center;
        height: 100%;
        margin-right: 39px;
    }

    .logout {
        // display: none;
        width: 104px;
        height: 42px;
        background: #edf0ff;
        border-radius: 4px;
        border: none;
        color: #1768e4;
        font-size: 16px;
        font-weight: 400;
        font-family: Microsoft YaHei;
    }

    .logout:hover {
        background: #1768e4;
        border-radius: 4px;
        font-weight: 400;
        color: #ffffff;
    }

    .username_first_letter {
        font-family: Microsoft YaHei;
        font-size: 24px;
        text-align: center;
        line-height: 42px;
        font-weight: 400;
        width: 40px;
        height: 40px;
        color: #fff;
        border-radius: 50%;
        background-color: #1768e4;
        margin-left: 26px;
    }
}
.popover {
    margin-right: 15px;
}
.ellipsis {
}
</style>

<!-- 移动端 -->
<style scoped lang="scss">
.mobile-container {
    height: 25%;
    width: 100%;
    min-height: 200px;
    background-image: url('../../../public/moble-bgi.png');
    background-size: 100% 100%;

    .mobile-navbg {
        margin: 0 auto;
        width: 120px;
        // height: 120px;

        // background-color: #333;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-top: 30px;
    }

    .user-firstletter {
        margin-top: 16%;
        width: 80px;
        height: 80px;
        background-color: #fff;
        border-radius: 50%;
        font-size: 52px;
        font-weight: 400;
        text-align: center;
        line-height: 80px;
        color: #1768e4;
    }

    .mobile-logout {
        margin-top: 22px;
        padding: 8px 15px;
        background-color: #fff;
        border-radius: 24px;
        color: #1768e4;
    }
}
</style>
