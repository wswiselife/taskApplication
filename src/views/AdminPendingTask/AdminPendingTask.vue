<script setup></script>

<template>
    <div class="admin_pending_container">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
        </el-table>
    </div>
</template>

<style scoped lang="scss">
._container {
}
</style>
