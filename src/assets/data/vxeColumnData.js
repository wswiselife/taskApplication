/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-12 17:26:15
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-13 10:52:02
 * @FilePath: \taskApplication\src\assets\data\vxeColumnData.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 项目名称
export const formatProjectName = (id) => {
    if (id == '116') {
        return '希瑞';
    }
    if (id == '115') {
        return '上线问题列表';
    }
    if (id == '1') {
        return '鼎鹏';
    }
    if (id == '2') {
        return '本田金属';
    }
    if (id == '4') {
        return 'TaskList';
    }

    if (id == '5') {
        return 'android学习';
    }
    if (id == '6') {
        return '万宝';
    }
    if (id == '7') {
        return '今仙';
    }
    return '';
};

// 项目类型
export const formatTaskType = (id) => {
    if (id == '3') {
        return '代码编写';
    }
    if (id == '4') {
        return '文档';
    }
};

// 审核员
export const formatAudit = (id) => {
    if (id == '3') {
        return 'wayne';
    }
    if (id == '10003') {
        return 'Jon';
    }
};
