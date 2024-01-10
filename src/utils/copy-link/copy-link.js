// 确保已经导入 ClipboardJS
import ClipboardJS from 'clipboard';
import {
    showFailMessage,
    showSuccessMessage,
} from '../show-message/showSFmessage';

// 生成链接
const generateLink = (id) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}/#/?taskApplyId=${id}`;
};

export const copyLinkToClipboard = (id) => {
    const link = generateLink(id);

    // 创建一个临时的按钮用于复制操作
    const tempButton = document.createElement('button');
    tempButton.setAttribute('data-clipboard-text', link);
    document.body.appendChild(tempButton);

    // 使用 clipboard.js 复制链接
    const clipboard = new ClipboardJS(tempButton);
    clipboard.on('success', function (e) {
        showSuccessMessage(`链接已成功复制到剪切板，链接为${link}`);
        e.clearSelection();
        clipboard.destroy();
        document.body.removeChild(tempButton);
    });

    clipboard.on('error', function () {
        showFailMessage('链接复制失败。');
        clipboard.destroy();
        document.body.removeChild(tempButton);
    });

    // 触发复制操作
    tempButton.click();
};
