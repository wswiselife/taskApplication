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
// 路由跳转(.js文件不是这样跳转的)
import router from '@/router';
// import route from 'vue-router';
import { clearCacheFun } from '@/utils/clear-cache/clearCache';
import { showFailMessage } from '@/utils/show-message/showSFmessage';

const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        NProgress.start();
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        NProgress.done();
        return Promise.reject(error);
    },
);

request.interceptors.response.use(
    (response) => {
        NProgress.done();

        if (response.status == 200) {
            if (response.data.code == 200) {
                return response.data;
            } else if (response.data.code === 401) {
                handle401Error();
                // 这里可以解决再次提示的问题
                return new Promise(() => undefined);
                // return response.data;
                // return;
            } else {
                return response.data;
            }
        } else {
            return new Promise(() => undefined);
        }
    },
    (error) => {
        NProgress.done();
        // console.log('axios的error ===', error);
        return Promise.reject(error);
    },
);

let is401MessageShown = false;
let is401HandlingInProgress = false;

const handle401Error = () => {
    if (!is401HandlingInProgress) {
        is401HandlingInProgress = true;

        // 清除缓存
        clearCacheFun();
        if (!is401MessageShown) {
            showFailMessage('验证身份失败，请重新进行登录。');
            is401MessageShown = true;
            // 新增内容
            router.replace({ path: '/login' }); // 重定向到登录页面
            is401HandlingInProgress = false;
            is401MessageShown = false;
            // setTimeout(() => {
            //     is401MessageShown = false;
            // }, 3000); // 3秒后重置标志
        }
        // setTimeout(() => {
        //     router.replace({ path: '/login' }); // 重定向到登录页面
        //     is401HandlingInProgress = false;
        // }, 3000); // 3秒后跳转
    }
};

export { request };

// import axios from 'axios';

// import Util from '.';
// import { BASE_URL } from '@/configs';
// import store from '@/store';
// import router from '@/router';

// axios.defaults.baseURL = BASE_URL;

// axios.interceptors.request.use(
//     (config) => {
//         let { token } = store.state;
//         if (token !== '') {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return Promise.resolve(config);
//     },
//     (error) => {
//         return Promise.reject(error);
//     },
// );

// axios.interceptors.response.use(
//     (response) => {
//         let { data } = response;
//         if (data.code !== 200) {
//             let { message } = data;
//             Util.showMessage(message, 'error');
//         }
// 成功
//         return Promise.resolve(data);
//     },
//     // 状态码不在 [200,300)||[304] 时执行的回调
//     (error) => {
//         let { response } = error;
//         if (response !== undefined) {
//             let { status, data } = response;
//             let { message } = data;
//             if (status === 400) {
//                 if (data.code === 401) {
//                     store.state.token = '';
//                     router.replace(
//                         { path: '/' },
//                         () => undefined,
//                         () => undefined,
//                     );
//                 }
//             }
//             Util.showMessage(message, 'error');
//         } else {
//             let { code } = error;
//             if (code === 'ERR_NETWORK') {
//                 Util.showMessage(
//                     '无法获取响应数据，连接服务器失败，请您稍后再试。',
//                     'error',
//                 );
//             }
//         }
//         return new Promise(() => undefined);
//     },
// );

// export default axios;
