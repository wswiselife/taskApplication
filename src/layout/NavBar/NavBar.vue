<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 10:49:42
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-13 17:32:05
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

import Create from './create/Create.vue';
import { ElMessage } from 'element-plus';
import { ref, computed } from 'vue';

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

            ElMessage({
                message: '退出登录成功',
                type: 'success',
            });

            router.push({ path: '/login' });
        } else {
            // 注销失败，打印错误信息
            console.error('注销失败:', response.message);
            router.push({ path: '/login' });
            ElMessage({
                message: response.message,
                type: 'error',
            });
        }
    } catch (error) {
        // 捕获任何错误并打印
        console.error('发生错误:', error);
        ElMessage({
            message: '退出登录失败',
            type: 'error',
        });
    }
}

/********************************\
 * 获取用户名
\********************************/
const username = ref(localStorage.getItem('username') || '未知用户');

const firstLetter = computed(() => {
    return username.value && username.value.length > 0 ? username.value[0] : '';
});
</script>

<template>
    <div class="sidebar_container">
        <!-- navbar 左侧 -->
        <div class="navbar_left">
            <!-- logo -->
            <div class="logo">
                <img src="../../assets/img/logo.png" alt="logo" />
                <span class="title">锦上云</span>
            </div>
            <!-- 创建按钮 -->
            <create></create>
        </div>

        <div class="navbar_right">
            <!-- 退出登录 -->
            <el-button class="logout" @click="logoutbtn">退出登录</el-button>

            <!-- 头像 -->
            <!-- <span class="username">{{ username }}</span> -->
            <span class="username_first_letter">{{ firstLetter }}</span>
            <!-- todo -->
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '../../assets/css/variables.scss';
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
        margin-left: 25px;
    }

    .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;

        .title {
            font-size: 16px;
            color: $color-bfont;
        }
    }

    .navbar_right {
        display: flex;
        justify-content: flex-end;
        flex-direction: center;
        align-items: center;
        gap: 20px;
        height: 100%;
        margin-right: 25px;
    }

    .logout {
        background-color: $color-primary;
        color: $color-wfont;
    }

    .logout:hover {
        color: $color-bfont;
    }

    .username {
        color: $color-bfont;
        margin-right: 20px;
    }

    .username_first_letter {
        font-size: 24px;
        font-weight: bold;
        color: $color-primary;
        padding: 5px 12px;
        border: 1px solid $color-primary;
        border-radius: 10px;
    }
}
</style>
