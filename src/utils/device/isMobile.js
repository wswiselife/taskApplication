const userAgent = navigator.userAgent;

// 列举一些移动设备的关键字
const mobileKeywords = [
    'Android',
    'iPhone',
    'iPad',
    'iPod',
    'Windows Phone',
    'BlackBerry',
];

// 检查用户代理字符串中是否包含上述关键字之一
export const isMobileDevice = mobileKeywords.some((keyword) =>
    userAgent.includes(keyword),
);
