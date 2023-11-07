// 参数1 pc端的成功的提示文字
// 参数2 移动端的成功的提示文字

import { showFailToast, showSuccessToast } from 'vant';
import { isMobileDevice } from '../device/isMobile';
import { ElMessage } from 'element-plus';

// 提醒：一般是相同的，如果不同的情况下，第二个参数才生效
export const showSuccessMessage = (publicMessage, mobileMessage) => {
    if (isMobileDevice) {
        const message = mobileMessage || publicMessage;
        showSuccessToast(message);
    } else {
        ElMessage({
            message: publicMessage,
            type: 'success',
        });
    }
};

// 提醒：一般是相同的，如果不同的情况下，第二个参数才生效
export const showFailMessage = (publicMessage, mobileMessage) => {
    if (isMobileDevice) {
        const message = mobileMessage || publicMessage;
        showFailToast(message);
    } else {
        ElMessage({
            message: publicMessage,
            type: 'error',
        });
    }
};
