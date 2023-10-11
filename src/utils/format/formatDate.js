import moment from 'moment';

// 用户格式胡传递给后端的数据
// 传单个小时数的时候
// export const getFormattedDate = (date, dateTime) => {
//     // 合并日期和时间
//     const combinedDateTime = moment(date).set({
//         hour: parseInt(dateTime, 10),
//         minute: 0,
//         second: 0,
//     });
//     // 返回格式化的日期和时间字符串
//     return combinedDateTime.format('YYYY-MM-DD HH:mm:ss');
// };

export const getFormattedDate = (date, dateTime) => {
    // 从dateTime中提取小时和分钟
    const [hour, minute] = dateTime.split(':').map((num) => parseInt(num, 10));

    // 合并日期和时间
    const combinedDateTime = moment(date).set({
        hour: hour,
        minute: minute,
        second: 0,
    });

    // 返回格式化的日期和时间字符串
    return combinedDateTime.format('YYYY-MM-DD HH:mm:ss');
};

// 用户格式化显示内容
export const getFormattedDateTwo = (date) => {
    return moment(date).format('YYYY-MM-DD');
};

// 格式化显示小时和分钟
export const getFormattedDateThree = (time) => {
    return moment(time).format('HH:mm');
};
