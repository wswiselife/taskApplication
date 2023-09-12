/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-01 09:58:27
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-11 11:32:20
 * @FilePath: \taskApplication\src\api\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
//引入nprogress 进度条插件
import NProgress from 'nprogress';

// 开发环境配置
// const processENV = () => {
//     if (import.meta.env.VITE_API_URL === 'development') {
//         return process.env.VITE_API_URL;
//     }
// };

const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        // 开启进度条
        // console.log('Request interceptor called');
        NProgress.start();
        const token = localStorage.getItem('token');
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

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        // 关闭进度条
        // console.log('Response interceptor called');
        NProgress.done();
        // console.log('axios 拦截器 response.data ===', response.data);
        if (response.status === 200) {
            return response.data;
        } else {
            return Promise.reject(new Error('Error: ' + response.status));
        }
    },
    (error) => {
        // 关闭进度条
        NProgress.done();
        // 为什么拦截401？token 过期问题
        if (error.response && error.response.status === 401) {
            // 重新登录逻辑
            console.log('请重新登录');
        }
        return Promise.reject(error);
    },
);

export { request };
