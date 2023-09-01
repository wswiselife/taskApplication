/*
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-29 16:02:30
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-01 15:04:35
 * @FilePath: \taskApplication\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue';
import App from './App.vue';
// normalize.css
import 'normalize.css/normalize.css';
import '@/assets/css/common.scss';
// router4
import router from '@/router/index';
// element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// element-icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// pinia
import { pinia } from './store';

const app = createApp(App);

// element-icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(router).use(ElementPlus).use(pinia).mount('#app');
