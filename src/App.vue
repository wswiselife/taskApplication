<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-29 16:02:30
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-09-01 17:22:07
 * @FilePath: \taskApplication\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-29 16:02:30
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-08-29 16:45:18
 * @FilePath: \taskApplication\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { isMobileDevice } from '@/utils/device/isMobile.js';
console.log('isMobileDevice ===', isMobileDevice);
</script>

<template>
    <div class="app">
        <RouterView></RouterView>
    </div>
</template>

<style scoped lang="scss">
.app {
    width: 100vw;
    height: 100vh;
}
</style>
