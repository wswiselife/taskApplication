export const validateURLInput = (URL) => {
    if (URL) {
        const urlRegex =
            /^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+([\/\w .-]*[\w\/#%?=&.-]*)?$/;

        const isValid = urlRegex.test(URL);
        if (isValid) {
            return {
                isValid: true,
                message: '输入的网址有效。',
            };
        } else {
            return {
                isValid: false,
                message: '输入的网址无效。',
            };
        }
    } else {
        return {
            isValid: false,
            message: '网址不能为空。',
        };
    }
};
