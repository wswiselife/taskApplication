/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-01 09:58:27
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-11 11:32:20
 * @FilePath: \taskApplication\src\api\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import { ElMessage } from 'element-plus';
//引入nprogress 进度条插件
import NProgress from 'nprogress';
// 路由跳转(.js文件不是这样条状的)
import router from '@/router';
// 开发环境配置
// const processENV = () => {
//     if (import.meta.env.VITE_API_URL === 'development') {
//         return process.env.VITE_API_URL;
//     }
// };

const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        // 开启进度条
        // console.log('Request interceptor called');
        NProgress.start();
        const token = localStorage.getItem('token');
        // 为什么拦截401？token 过期问题
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // 关闭进度条
        NProgress.done();
        return Promise.reject(error);
    },
);
let is401MessageShown = false;
let is401HandlingInProgress = false;

const handle401Error = () => {
    if (!is401HandlingInProgress) {
        is401HandlingInProgress = true;
        localStorage.removeItem('token'); // 清除 token
        if (!is401MessageShown) {
            ElMessage({
                message: '验证身份失败，三秒后即将跳转登录页',
                type: 'error',
            });
            is401MessageShown = true;
            setTimeout(() => {
                is401MessageShown = false;
            }, 3000); // 3秒后重置标志
        }
        setTimeout(() => {
            router.replace({ path: '/login' }); // 重定向到登录页面
            is401HandlingInProgress = false;
        }, 3000); // 3秒后跳转
    }
};

request.interceptors.response.use(
    (response) => {
        // 关闭进度条
        NProgress.done();
        console.log('response.data:', response);
        if (response.status == 200) {
            if (response.data.code == 200) {
                return response.data;
            } else if (response.data.code === 401) {
                handle401Error();
                return;
            } else if (response.data.code >= 400 && response.data.code < 500) {
                ElMessage({
                    message: response.data.message || '请求错误',
                    type: 'error',
                });
                return Promise.reject(response.data.message);
            } else {
                // 其他未知错误
                ElMessage({
                    message: response.data.message,
                    type: 'error',
                });
                return Promise.reject(response.data.message);
            }
        } else {
            // console.log('请求发送错误');
            return Promise.reject(response.data.message);
        }
    },
    (error) => {
        // 关闭进度条
        NProgress.done();
        return Promise.reject(error);
    },
);

export { request };
