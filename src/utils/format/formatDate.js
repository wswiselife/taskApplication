import moment from 'moment';

// 用户格式胡传递给后端的数据
export const getFormattedDate = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

// 用户格式化显示内容
export const getFormattedDateTwo = (date) => {
    return moment(date).format('YYYY-MM-DD');
};
