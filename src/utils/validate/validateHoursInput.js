/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-15 09:14:07
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-18 10:07:26
 * @FilePath: \taskApplication\src\utils\validate\validateHoursInput.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-09-15 09:14:07
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-15 16:02:29
 * @FilePath: \taskApplication\src\utils\validate\validateHoursInput.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 20231030（改为选择框，弃用）
const validateHoursInput = (hoursInput) => {
    // console.log('validateHoursInput函数被调用了');

    // 将输入转换为字符串
    const inputStr = String(hoursInput);
    // console.log('inputStr ===', inputStr);

    // 检查是否为空字符串
    if (!inputStr) {
        return {
            isValid: false,
            message: '计划完成小时数不能为空',
        };
    }

    // 检查小数点的数量
    if (inputStr.split('.').length - 1 > 1) {
        return {
            isValid: false,
            message: '计划完成小时数输入不能包含多于一个的小数点',
        };
    }

    // 检查小数点后的数字数量
    const decimalPart = inputStr.split('.')[1];
    if (decimalPart && decimalPart.length > 1) {
        return {
            isValid: false,
            message: '计划完成小时数的小数点后最多只能有一位数字',
        };
    }

    // 检查是否包含空格
    if (/\s/.test(inputStr)) {
        return {
            isValid: false,
            message: '计划完成小时数的输入不能包含空格',
        };
    }

    // 检查是否只包含数字和小数点，并且格式正确
    if (!/^(0(\.\d)?|[1-9]\d*(\.\d)?)$/.test(inputStr)) {
        return {
            isValid: false,
            message: '计划完成小时数格式错误,请输入有效的数字格式',
        };
    }

    const hours = parseFloat(inputStr);
    // 确保小时数在0到100之间
    if (hours > 0 && hours <= 100) {
        return {
            isValid: true,
            message: '输入的小时数有效',
        };
    } else {
        return {
            isValid: false,
            message: '输入的计划完成小时数超出范围（0-100）',
        };
    }
};

export { validateHoursInput };

// // validateHoursInput
// const validateHoursInputResult = validateHoursInput(form.planFinishHour);

// if (!validateHoursInputResult.isValid) {
//     ElMessage({
//         message: validateHoursInputResult.message,
//         type: 'error',
//     });
//     return;
// }
