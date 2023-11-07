export const validateDateInput = (date, dateTime) => {
    // console.log('date,dateTime ===', date, dateTime);
    // 已选日期，没选时间
    if (date && !dateTime) {
        return {
            isValid: false,
            message: '未选时间。日期和时间必须同时选择或者同时不选',
        };
    }
    // 未选日期，已选时间
    if (!date && dateTime) {
        return {
            isValid: false,
            message: '未选日期。日期和时间必须同时选择或者同时不选',
        };
    }

    return {
        isValid: true,
    };
};
