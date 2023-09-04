/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-01 10:00:28
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-04 10:43:11
 * @FilePath: \taskApplication\src\api\modules\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-01 10:00:28
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-01 16:27:14
 * @FilePath: \taskApplication\src\api\modules\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { request } from '../index';

/********************************\ 
 * 命名未 get(Name)Data
\********************************/

// 登录
export const userLogin = (data) => {
    // console.log('data',data)
    return request.post('/Auth/Login', {
        account: data.account,
        password: data.password,
    });
};

// 退出登录
export const userLogout = () => {
    return request.get('/Auth/Logout');
};
