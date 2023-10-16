// /*
//  * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
//  * @Date: 2023-08-29 16:02:30
//  * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
//  * @LastEditTime: 2023-09-01 09:04:33
//  * @FilePath: \taskApplication\vite.config.js
//  * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
//  */
// import { defineConfig } from 'vite';
// import vue from '@vitejs/plugin-vue';
// const babel = require('vite-babel-plugin');
// import eslintPlugin from 'vite-plugin-eslint'; //导入包
// import path from 'path';

// // https://vitejs.dev/config/
// export default defineConfig({
//     // server: {
//     //     proxy: {
//     //         '/jsy': {
//     //             target: 'http://120.25.121.36:8050',
//     //             changeOrigin: true,
//     //         },
//     //     },
//     // },
//     plugins: [
//         vue(),
//         eslintPlugin({
//             include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
//         }),
//         babel(),
//     ],
//     resolve: {
//         // 别名配置
//         alias: {
//             '@': path.resolve(__dirname, 'src'),
//         },
//     },
//     // 全局配置未完成
//     css: {
//         loaderOptions: {
//             scss: {
//                 prependData: '@import "~@/assets/css/variables.scss"',
//             },
//         },
//     },
//     build: {
//         target: 'es5',
//     },
// });

// 尝试1
const { defineConfig } = require('vite');
const vue = require('@vitejs/plugin-vue');
const babel = require('vite-babel-plugin').default;
const eslintPlugin = require('vite-plugin-eslint').default;
const path = require('path');

module.exports = defineConfig({
    base: './',
    plugins: [
        vue(),
        eslintPlugin({
            include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue'],
        }),
        babel(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    css: {
        loaderOptions: {
            scss: {
                additionalData: '@import "~@/assets/css/variables.scss";',
            },
        },
    },
    build: {
        target: 'es2015', // 使用es2015或其他更现代的版本
    },
});
