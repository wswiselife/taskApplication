<script setup>
import { useRouter } from 'vue-router';

/********************************\ 
 * 公共引入处理
\********************************/
const router = useRouter();

/********************************\ 
 * 返回上一步处理
\********************************/
function logoutbtn() {
    console.log('返回上一步');
    router.back();
}
</script>

<template>
    <div class="sidebar_container">
        <!-- navbar 左侧 -->
        <div class="navbar_left">
            <!-- logo -->
            <div class="logo">
                <!-- <img src="../../assets/icon/user.svg" alt="" /> -->
                logo
            </div>
            <!-- 创建按钮 -->
            <el-button>创建</el-button>
            <el-button @click="logoutbtn">上一步</el-button>
        </div>

        <div class="navbar_right">
            <!-- 退出登录 -->
            <el-button class="logout">退出登录</el-button>

            <!-- 头像 -->
            <div class="avatar">
                <!-- <img src="" alt="" /> -->
                avatar
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.sidebar_container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;

    .navbar_left {
        display: flex;
        justify-content: flex-start;
        flex-direction: center;
        align-items: center;
        gap: 20px;
        height: 100%;
    }

    .navbar_right {
        display: flex;
        justify-content: flex-end;
        flex-direction: center;
        align-items: center;
        gap: 20px;
        height: 100%;
    }
}
</style>
