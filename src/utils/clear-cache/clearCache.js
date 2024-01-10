export const clearCacheFun = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authorityList');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('deptId');
    localStorage.removeItem('myUserId');
    localStorage.removeItem('chineseName');
    localStorage.removeItem('approverUserId');
};
