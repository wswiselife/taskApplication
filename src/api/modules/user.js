import { request } from '../index';

/********************************\ 
 * 命名未 get(Name)Data
\********************************/

// 登录
export const userLogin = (data) => {
    // console.log('data',data)
    return request.post('/jsy/Auth/Login', {
        account: data.account,
        password: data.password,
    });
};

// 退出登录
export const userLogout = () => {
    return request.get('/jsy/Auth/Logout');
};
