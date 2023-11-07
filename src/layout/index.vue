<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 10:39:19
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-11 17:49:47
 * @FilePath: \taskApplication\src\layout\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 10:39:19
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-08-31 14:21:58
 * @FilePath: \taskApplication\src\layout\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import Navbar from './navBar/NavBar.vue';
import sidebar from './sideBar/SideBar.vue';
// import AppMain from './appMain/AppMain.vue';
// 设备检测
import { isMobileDevice } from '@/utils/device/isMobile';
// 链接审批数据共享
import { useIsLinkApprovalStore } from '@/store/public';
import { storeToRefs } from 'pinia';
const isLinkApprovalStore = useIsLinkApprovalStore();
const { isLinkApproval } = storeToRefs(isLinkApprovalStore);
</script>

<template>
    <div class="layout_container">
        <!-- NavBar -->
        <div class="navbar" v-if="!isMobileDevice">
            <Navbar></Navbar>
        </div>

        <div
            class="sidebar_appmain_container"
            :style="{ height: isMobileDevice ? '100%' : 'calc(100vh - 70px)' }"
        >
            <!-- SideBar -->
            <div class="sidebar" v-if="!isMobileDevice && !isLinkApproval">
                <sidebar></sidebar>
            </div>
            <!-- AppMain -->

            <div class="app_main">
                <!-- <AppMain>
                    <component :is="currentComponent"></component>
                </AppMain> -->

                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '../assets/css/variables.scss';

.layout_container {
    height: 100vh;
    width: 100vw;
    // background-color: $color-four;

    .navbar {
        width: auto;
        background: #ffffff;
        z-index: 999;
        // border-bottom: 1px solid black;
    }

    .sidebar_appmain_container {
        display: flex;
        justify-content: flex-start;
    }

    .sidebar {
        // display: none;
        height: 100%;
        min-width: 160px;
        background: #ffffff;
    }

    .app_main {
        // width: calc(100vw - 160px);
        width: 100%;
        height: 100%;
        background: #f3f7ff;
    }
}
</style>
