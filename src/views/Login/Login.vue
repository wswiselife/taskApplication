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
import { useRouter } from 'vue-router';
import { useUserLoginStore } from '../../store/modules/user';
import { ElMessage } from 'element-plus';

/********************************\
 * 公共引入处理
\********************************/
const router = useRouter();
const userLoginStore = useUserLoginStore();

/********************************\
 * 登录部分
\********************************/

const form = reactive({
    account: '',
    password: '',
});

const loginFormRef = ref(null);
async function loginbtn () {
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
            type:'error'
        });
        return;
    }

    try {
        // 发送登录请求
        const response = await userLoginStore.fetchUserLoginAction(form);
        console.log('登录 response ===', response);
        if (response.code === 200) {
            // 存储 token 和 authorityList 到 localStorage
            localStorage.setItem('token', response.result.token);
            localStorage.setItem('username', form.account); // 存储用户名到本地
            localStorage.setItem(
                'authorityList',
                JSON.stringify(response.result.authorityList),
            );

            // 检查是否具有管理员权限
            const hasAdminAuthority =
                response.result.authorityList.includes('WEB_TaskApplyAudit');

            // 根据权限跳转到相应的页面
            if (hasAdminAuthority) {
                router.push({ path: '/dashboard/approval' }); // 第一个页面
            } else {
                router.push({ path: '/dashboard/apply' }); // 第二个页面
            }
        } else {
            console.log('response.message ===', response.message);
            ElMessage({
                message: response.message,
                type: 'error',
            });
        }
    } catch (error) {
        //句号，回车，error todo
        console.log('error ===', error);
        ElMessage({
            message: `登录失败。${error}`,
            type: 'error',
        });
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

/********************************\
 * 校验处理
\********************************/
</script>

<template>
    <div class="login_container">
        <!-- :rules="rules" -->
        <el-form
            :model="form"
            class="login_form"
            ref="loginFormRef"
            @keyup.enter="loginbtn"
        >
            <div class="title_container">
                <h3 class="title">任务申请</h3>
            </div>
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
                            <img src="../../assets/icon/user.svg" alt="" />
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
                            <img src="../../assets/icon/password.svg" alt="" />
                        </span>
                    </template>
                    <!-- 右侧眼睛 -->
                    <template #suffix>
                        <span class="show_pwd" @click="showPwd">
                            <!-- <img src="../../assets/icon/eye.svg" alt="" /> -->
                            <img
                                v-if="isPwdShown"
                                src="../../assets/icon/eye-open.svg"
                                alt="Hide Password"
                            />
                            <img
                                v-else
                                src="../../assets/icon/eye.svg"
                                alt="Show Password"
                            />
                        </span>
                    </template>
                </el-input>
            </el-form-item>

            <el-button @click="loginbtn" class="login_btn">
                <span class="letter">登</span>
                <span class="letter">录</span>
            </el-button>
        </el-form>
    </div>
</template>

<style lang="scss">
@import '../../assets/css/variables.scss';

.el-form-item--medium .el-form-item__content {
    line-height: 36px;
}

.el-input input {
    padding: 12px 10px 12px 10px;
}

.el-input__wrapper {
    background-color: $color-four;
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
    background-color: $color-four;
    overflow: hidden;

    .login_form {
        width: 520px;
        max-width: 520px;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    .account,
    .password {
        margin-bottom: 25px;
    }

    // title
    .title_container {
        .title {
            color: $color-bfont;
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
        cursor: pointer;

        img {
            width: 16px;
            // height: 16px;
        }
    }

    .login_btn {
        width: 100%;
        background: $color-primary;
        border-color: none;
        color: $color-wfont;

        .letter {
            display: block;
        }
        .letter:first-child {
            margin-right: 25px;
        }
    }

    .login_btn:hover {
        color: $color-bfont;
    }
}
</style>
