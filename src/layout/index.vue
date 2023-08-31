<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 10:39:19
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-08-31 16:13:30
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
import Navbar from './NavBar/NavBar.vue';
import SideBar from './SideBar/SideBar.vue';
import AppMain from './AppMain/AppMain.vue';
</script>

<template>
    <div class="layout_container">
        <!-- NavBar -->
        <div class="navbar">
            <Navbar></Navbar>
        </div>

        <div class="sidebar_appmain_container">
            <!-- SideBar -->
            <div class="sidebar">
                <SideBar></SideBar>
            </div>
            <!-- AppMain -->
            <div class="app_main">
                <AppMain>
                    <router-view></router-view>
                </AppMain>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.layout_container {
    height: 100vh;
    width: 100vw;

    .navbar {
        width: 100%;
        height: 50px;
        border-bottom: 1px solid black;
        background-color: #2d3a4b;
    }

    .sidebar_appmain_container {
        height: calc(100vh - 50px);
        background-color: #2d3a4b;
        display: flex;
        justify-content: flex-start;
    }

    .sidebar {
        width: 250px;
        max-width: 250px;
        height: 100%;
        border-right: 1px solid black;
    }
}
</style>
