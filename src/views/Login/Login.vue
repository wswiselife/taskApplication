<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-29 17:01:46
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-18 13:57:26
 * @FilePath: \taskApplication\src\views\Login\Login.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-29 17:01:46
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-08-31 10:32:08
 * @FilePath: \taskApplication\src\views\login\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserLoginStore } from '../../store/modules/user';
import { ElMessage } from 'element-plus';
import { useUserIdStore } from '@/store/public';
import debounce from 'lodash/debounce';
// 设备检测
import { isMobileDevice } from '@/utils/device/isMobile';
import { showFailMessage } from '@/utils/show-message/showSFmessage';

/********************************\
 * 公共引入处理
\********************************/
const router = useRouter();
const route = useRoute();
const userLoginStore = useUserLoginStore();
const userIdStore = useUserIdStore();

/********************************\
 * 登录部分
\********************************/
const form = reactive({
    account: '',
    password: '',
});

const loginFormRef = ref(null);
//debounce中的第一个参数，传递的是他的引用，而不是返回值，所以不带括号
// 我要的是函数，而不是函数值，所以loginbtn不用括号
const debouncedLoginBtn = debounce(loginbtn, 600);
async function loginbtn() {
    if (!form.account && !form.password) {
        ElMessage({
            message: '账号和密码不能为空',
            type: 'error',
        });
        return;
    }
    if (!form.account) {
        ElMessage({
            message: '账号不能为空',
            type: 'error',
        });
        return;
    }
    if (!form.password) {
        ElMessage({
            message: '密码不能为空',
            type: 'error',
        });
        return;
    }

    try {
        // 发送登录请求
        const response = await userLoginStore.fetchUserLoginAction(form);
        // console.log('登录 response ===', response);
        if (response.code === 200) {
            // 存储 token 和 authorityList 到 localStorage
            localStorage.setItem('token', response.result.token);
            localStorage.setItem('username', form.account); // 存储用户名到本地
            // 存储用户的id到store中
            userIdStore.saveUserId(response.result.userId);
            localStorage.setItem(
                'authorityList',
                JSON.stringify(response.result.authorityList),
            );

            // 检查是否具有管理员权限
            const hasAdminAuthority =
                response.result.authorityList.includes('WEB_TaskApplyAudit');

            // 获取当前路由的taskId参数
            const taskId = route.query.taskId;

            let path = {};
            let query = {};
            if (taskId) {
                path = '/dashboard/approval';
                query.taskId = taskId;
            } else {
                // 移动设备
                if (isMobileDevice) {
                    path = '/mobileexplore';
                } else {
                    // pc设备
                    path = hasAdminAuthority
                        ? '/dashboard/approval'
                        : '/dashboard/apply';
                }
            }

            // 重定向到指定路径，并保留所有查询参数
            router.push({ path, query });
        } else {
            console.log('response.message ===', response.message);
            ElMessage({
                message: response.message,
                type: 'error',
            });
        }
    } catch (error) {
        console.log('error ===', error);
        showFailMessage(error);
    }
}

/********************************\
 * 密码眼睛处理
\********************************/
// 星号与显示密码直接的切换
const passwordType = ref('password');
// 小图标的切换
const isPwdShown = ref(false);
function showPwd() {
    passwordType.value =
        passwordType.value === 'password' ? 'text' : 'password';
    isPwdShown.value = !isPwdShown.value;
}
</script>

<template>
    <div class="login_container">
        <!-- :rules="rules" // todo 如果使用的是elm内置的校验 -->
        <div class="form-container">
            <!-- title -->
            <div class="title">任务申请</div>

            <el-form
                :model="form"
                class="login_form"
                ref="loginFormRef"
                @keyup.enter="debouncedLoginBtn"
            >
                <el-form-item class="account" prop="account">
                    <el-input
                        v-model="form.account"
                        class="form_input"
                        type="text"
                        placeholder="请输入账号"
                    >
                        <!-- 左侧小icon -->
                        <template #prefix>
                            <span class="svg_container">
                                <!-- <svg-icon icon-class="user" /> -->
                                <img src="../../../public/user.png" alt="" />
                            </span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item class="password" prop="password">
                    <el-input
                        v-model="form.password"
                        class="form_input"
                        :type="passwordType"
                        placeholder="请输入密码"
                    >
                        <!-- 左侧小icon -->
                        <template #prefix>
                            <span class="svg_container">
                                <!-- <svg-icon icon-class="user" /> -->
                                <img
                                    src="../../../public/password.png"
                                    alt=""
                                />
                            </span>
                        </template>
                        <!-- 右侧眼睛 -->
                        <template #suffix>
                            <span class="show_pwd" @click="showPwd">
                                <!-- <img src="../../assets/icon/eye.svg" alt="" /> -->
                                <img
                                    v-if="isPwdShown"
                                    src="../../../public/eye-hide.png"
                                />
                                <img
                                    v-else
                                    src="../../../public/eye-open.png"
                                />
                            </span>
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>

            <div class="btn-container">
                <el-button @click="debouncedLoginBtn" class="login_btn">
                    <!-- <span class="letter">登</span>
                    <span class="letter">录</span> -->
                    登录
                </el-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../assets/css/variables.scss';

.el-form-item--medium .el-form-item__content {
    line-height: 36px;
}

.el-input input {
    padding: 2px 0 2px 0;
}

.el-input__inner::placeholder {
    color: #aaa;
    font-size: 10px;
}

.el-input__wrapper {
    background-color: rgba(255, 255, 255, 0.4);
    // padding: 10px 16px;
}

.el-button {
    height: 38px;
    font-size: 14px;
    color: #fff;
}

.el-button:hover {
    color: #000;
}

// 错误提示
.el-form-item__error {
    padding: 8px;
}
</style>

<style scoped lang="scss">
@import '../../assets/css/variables.scss';

.login_container {
    height: 100%;
    width: 100%;
    // background-color: $color-four;
    // overflow: hidden;
    background-image: url('../../../public/login-bgimg.png');
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .form-container {
        width: 266px;
        height: 280px;
        background-color: rgba($color: #fff, $alpha: 0.5);
        border-radius: 10px;
    }

    // title

    .title {
        padding: 39px 0 32px 0;
        // width: 127px;
        font-size: 22px;
        font-family: Microsoft YaHei;
        color: #267aea;
        text-align: center;
        font-weight: bold;
    }

    // .login_form {
    //     width: 360px;

    //     // overflow: hidden;
    // }

    .account,
    .password {
        width: 212px;
        height: 36px;
        margin: 0 auto;
        margin-bottom: 16px;
    }

    .password {
        margin-bottom: 24px;
    }

    .svg_container {
        display: inline-block;
        vertical-align: middle;
        width: 10px;
        height: 12px;
        margin-right: 4px;
        line-height: 12px;

        img {
            width: 10px;
            height: 12px;
        }
    }

    // 右侧眼睛图标样式
    .show_pwd {
        display: inline-block;
        vertical-align: middle;
        width: 12px;
        height: 8px;
        margin-left: 8px; // 注意这里是 margin-left
        line-height: 8px;
        cursor: pointer;

        img {
            width: 12px;
            // height: 16px;
        }
    }

    .btn-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login_btn {
        width: 212px;
        height: 32px;
        background: linear-gradient(90deg, #72dcff 0%, #939bff 100%);
        border-radius: 4px;
        color: #fff;
        transition: 0.5s ease-in-out;
        font-size: 12px;

        .letter {
            display: block;
        }
        .letter:first-child {
            margin-right: 25px;
        }
    }

    .login_btn:hover {
        background: linear-gradient(90deg, #72c0ff 0%, #9485ff 100%);
    }
}
</style>
