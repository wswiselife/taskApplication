export const validateDescriptionInput = (description) => {
    // 判断非空
    if (!description) {
        return {
            isValid: false,
            message: '任务描述不能为空',
        };
    }

    // 去除所有空格
    const trimmedDescription = description.replace(/\s+/g, '');

    // 判断长度是否为10-200
    if (trimmedDescription.length < 10 || trimmedDescription.length > 200) {
        return {
            isValid: false,
            message: '任务描述长度必须在10到200字符之间',
        };
    }

    return {
        isValid: true,
        message: '任务描述有效',
    };
};

// // validateHoursInput
// const validateHoursInputResult = validateHoursInput(form.planFinishHour);

// if (!validateHoursInputResult.isValid) {
//     ElMessage({
//         message: validateHoursInputResult.message,
//         type: 'error',
//     });
//     return;
// }
