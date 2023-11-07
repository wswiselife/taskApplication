export const clearCacheFun = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authorityList');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
};
