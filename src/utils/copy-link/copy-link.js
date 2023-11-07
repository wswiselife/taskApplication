// 导入提示语句

import { ElMessage } from 'element-plus';
import { showFailToast, showSuccessToast } from 'vant';
import { isMobileDevice } from '../device/isMobile';

export const copyLink = (id) => {
    const protocol = window.location.protocol; // 获取协议，例如 'http:'
    const host = window.location.host; // 获取域名和端口，例如 'localhost:5173'
    const link = `${protocol}//${host}/#/?taskId=${id}`;
    copyTextToClipboard(link);
};

const copyTextToClipboard = (text) => {
    if (!navigator.clipboard) {
        // 如果浏览器不支持Clipboard API，可以使用document.execCommand('copy')作为备选方案
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(
        () => {
            if (isMobileDevice) {
                showSuccessToast(`链接已成功复制到剪切板。链接为${text}`);
            } else {
                ElMessage({
                    message: `链接已成功复制到剪切板。链接为${text}`,
                    type: 'success',
                });
            }
        },
        (err) => {
            if (isMobileDevice) {
                showFailToast(`链接复制失败。${err}`);
            } else {
                ElMessage({
                    message: `链接复制失败。${err}`,
                    type: 'error',
                });
            }
        },
    );
};

const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // 避免滚动到页面底部
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            if (isMobileDevice) {
                showSuccessToast(`链接已成功复制到剪切板。链接为${text}`);
            } else {
                ElMessage({
                    message: `链接已成功复制到剪切板。链接为${text}`,
                    type: 'success',
                });
            }
        }
    } catch (err) {
        if (isMobileDevice) {
            showFailToast(`链接复制失败。${err}`);
        } else {
            ElMessage({
                message: `链接复制失败。${err}`,
                type: 'error',
            });
        }
    }

    document.body.removeChild(textArea);
};
