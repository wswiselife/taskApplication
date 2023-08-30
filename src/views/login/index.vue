<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-29 17:01:46
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-08-30 17:03:12
 * @FilePath: \taskApplication\src\views\login\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { reactive } from 'vue';
import axios from 'axios';

const form = reactive({
    account: '',
    password: '',
});

async function loginbtn() {
    try {
        const response = await axios.post(
            'http://192.168.1.83:5225/jsy/Auth/Login',
            {
                account: form.account,
                password: form.password,
            },
        );

        if (response.data) {
            // 登录成功，进行相应操作
            console.log('登录成功');
            console.log('response.data ↓↓', response.data)
        } else {
            // 登录失败，进行相应操作
            console.log('登录失败');
        }
    } catch (error) {
        // 请求失败或其他错误，进行相应操作
        console.log('请求失败', error);
    }
}
</script>

<template>
    <div class="login_container">
        <el-form :model="form" class="login_form">
            <div class="title_container">
                <h3 class="title">Login Form</h3>
            </div>
            <el-form-item class="account">
                <el-input v-model="form.account" class="form_input">
                    <!-- 左侧小icon -->
                    <template #prefix>
                        <span class="svg_container">
                            <!-- <svg-icon icon-class="user" /> -->
                            <img src="../../assets/icon/user.svg" alt="" />
                        </span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="password">
                <el-input v-model="form.password" class="form_input">
                    <!-- 左侧小icon -->
                    <template #prefix>
                        <span class="svg_container">
                            <!-- <svg-icon icon-class="user" /> -->
                            <img src="../../assets/icon/password.svg" alt="" />
                        </span>
                    </template>
                    <!-- 右侧眼睛 -->
                    <template #suffix>
                        <span class="show_pwd" @click="showPwd">
                            <img src="../../assets/icon/eye.svg" alt="" />
                        </span>
                    </template>
                </el-input>
            </el-form-item>

            <el-button @click="loginbtn" class="login_btn">登录</el-button>
        </el-form>
    </div>
</template>

<style lang="scss">
$bg: #283443;

.el-form-item--medium .el-form-item__content {
    line-height: 36px;
}

.el-input input {
    padding: 12px 10px 12px 10px;
}

.el-input__wrapper {
    background-color: $bg;
    padding: 10px 12px;
}

.el-button {
    height: 38px;
    font-size: 14px;
    color: #fff;
}

.el-button:hover {
    color: #000;
}

</style>

<style scoped lang="scss">
$bg: #2d3a4b;
$bg_btn: #46a6ff;

$dark_gray: #889aa4;
$light_gray: #eee;

.login_container {
    height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login_form {
        width: 520px;
        max-width: 520px;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    // title
    .title_container {
        .title {
            color: $light_gray;
            font-size: 26px;
            margin: 0 auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }


    .svg_container {
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        margin-right: 8px;
        line-height: 16px;

        img {
            width: 16px;
            height: 16px;
        }
    }

    // 右侧眼睛图标样式
    .show_pwd {
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        margin-left: 8px; // 注意这里是 margin-left
        line-height: 16px;

        img {
            width: 16px;
            // height: 16px;
        }
    }

    .login_btn {
        width: 100%;
        background: $bg_btn;
        border-color: $bg_btn;
    }
}
</style>
