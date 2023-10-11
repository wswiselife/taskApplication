import { request } from '../index';

// 获取url
export const getURLListData = () => {
    return request.get('/jsy/URLList/GetURLList');
};

// 新增url
export const addURLListData = (data) => {
    return request.post('/jsy/URLList/AddURL', {
        url: data.url,
        description: data.description,
    });
};

// 修改url
export const updateURLListData = (data) => {
    return request.post('/jsy/URLList/UpdateURL', {
        id: data.id,
        url: data.url,
        description: data.description,
    });
};

// 删除url
export const deleteURLListData = (currentId) => {
    return request.post('/jsy/URLList/DeleteURL', { id: currentId });
};
