<!--
 * @Author: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @Date: 2023-08-31 15:40:06
 * @LastEditors: ouyang 12731841+OuYangChilam@user.noreply.gitee.com
 * @LastEditTime: 2023-08-31 16:18:45
 * @FilePath: \taskApplication\src\views\PendingTask\PendingTask.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup></script>

<template>
    <div class="pending_container">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
        </el-table>
    </div>
</template>

<style scoped lang="scss">
.pending_container {
    padding: 5px;
}
</style>
