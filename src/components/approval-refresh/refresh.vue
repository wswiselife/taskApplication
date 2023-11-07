<script setup>
/********************************\
 * 公共引入处理
\********************************/
</script>

<template>
    <div class="refresh_container">
        <el-button @click="dialogFormVisibleFun" class="refresh">
            刷新
        </el-button>
    </div>
</template>

<style scoped lang="scss">
.refresh_container {
    .refresh {
        width: 80px;
        height: 32px;
        background: #1768e4;
        border-radius: 4px;
        border: none;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        margin-top: 16px;
        margin-left: 40px;
        margin-bottom: 11px;
    }
    .refresh:hover {
        background: #2b8aec;
    }
}
</style>
