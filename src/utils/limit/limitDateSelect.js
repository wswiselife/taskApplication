/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-12 15:00:56
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-18 09:49:31
 * @FilePath: \taskApplication\src\utils\limitDateSelect.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const disabledPreviousDates = (time) => {
    // 限制今天之前的日期，不包括今天
    return time.getTime() < Date.now() - 8.64e7;
};
