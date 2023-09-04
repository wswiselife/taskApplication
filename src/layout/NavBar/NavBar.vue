<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 10:49:42
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-04 16:32:27
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
import { userLogout } from '@/api/modules/user';

import Create from './Create/Create.vue';

/********************************\
 * 公共引入处理
\********************************/
const router = useRouter();

/********************************\
 * 退出登录
\********************************/
async function logoutbtn() {
    try {
        const response = await userLogout();
        // console.log('退出登录 response ===', response);
        if (response.code === 200) {
            // 清除本地缓存
            localStorage.removeItem('token');
            localStorage.removeItem('authorityList');
            router.push('/login');
        } else {
            // 注销失败，打印错误信息
            console.error('注销失败:', response.message);
        }
    } catch (error) {
        // 捕获任何错误并打印
        console.error('发生错误:', error);
    }
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
            <create></create>
        </div>

        <div class="navbar_right">
            <!-- 退出登录 -->
            <el-button class="logout" @click="logoutbtn">退出登录</el-button>

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
