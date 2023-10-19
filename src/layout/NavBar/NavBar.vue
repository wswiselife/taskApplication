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
import { userLogout } from '@/api/modules/user';

// import Create from './create/Create.vue';
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
                message: '已正常退出',
                type: 'success',
            });

            router.push({ path: '/login' });

            // 禁止浏览器的后退功能
            window.addEventListener('popstate', function () {
                history.go(1);
            });
        } else {
            router.push({ path: '/login' });
            ElMessage({
                message: response.message,
                type: 'error',
            });
            // 注销失败，打印错误信息
            // console.error('注销失败:', response.message);
            localStorage.removeItem('token');
            localStorage.removeItem('authorityList');

            // 禁止浏览器的后退功能
            window.addEventListener('popstate', function () {
                history.go(1);
            });
        }
    } catch (error) {
        // 捕获任何错误并打印
        console.error('发生错误:', error);
        router.push({ path: '/login' });
        ElMessage({
            message: '退出登录失败',
            type: 'error',
        });
        localStorage.removeItem('token');
        localStorage.removeItem('authorityList');

        // 禁止浏览器的后退功能
        window.addEventListener('popstate', function () {
            history.go(1);
        });
    }
}

/********************************\
 * 获取用户名
\********************************/
const username = ref(localStorage.getItem('username') || '?');

const firstLetter = computed(() => {
    return username.value && username.value.length > 0 ? username.value[0] : '';
});
</script>

<template>
    <div class="navbar_container">
        <!-- navbar 左侧 -->
        <div class="navbar_left">
            <!-- logo -->
            <div class="logo">
                <img src="../../../public/logo.png" alt="logo" />
            </div>
            <!-- 创建按钮 -->
            <!-- <create></create> -->
        </div>

        <div class="navbar_right">
            <!-- 退出登录 -->
            <el-button class="logout" @click="logoutbtn">退出登录</el-button>

            <!-- 头像 -->
            <!-- <span class="username">{{ username }}</span> -->
            <div class="username_first_letter">{{ firstLetter }}</div>
            <!-- todo -->
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '../../assets/css/variables.scss';
.navbar_container {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 10px 17px #000;
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
    }

    .navbar_right {
        display: flex;
        justify-content: flex-end;
        flex-direction: center;
        align-items: center;
        height: 100%;
        margin-right: 49px;
    }

    .logout {
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
        line-height: 35px;
        font-weight: 400;
        width: 40px;
        height: 40px;
        color: #fff;
        border-radius: 50%;
        background-color: #1768e4;
        margin-left: 26px;
    }
}
</style>
