<script setup>
import {
    ref,
    computed,
    defineEmits,
    watch,
    defineProps,
    watchEffect,
} from 'vue';
import { getFormattedDateThree } from '@/utils/format/formatDate';

/********************************\
 * 公共引入处理
\********************************/
const selectedHour = ref('12'); // 初始化为 '00'
const selectedMinute = ref('00'); // 初始化为 '00'

const combinedTime = computed(() => {
    return `${selectedHour.value}:${selectedMinute.value}`;
});

// 新增一个 ref 来存储选择的值
const selectedValue = ref(null);

watch(selectedValue, (newValue) => {
    if (typeof newValue === 'string' && newValue.includes(':')) {
        const [hour, minute] = newValue.split(':');
        selectedHour.value = hour;
        selectedMinute.value = minute;
    }
});

/********************************\
 * 父子之间通信（自定义事件）
\********************************/
const emit = defineEmits(['update-time']);
// 当数据发生变化时，发送一个自定义事件
const updateTime = () => {
    emit('update-time', combinedTime.value);
};

watch(combinedTime, updateTime);

/********************************\
 * 选择时间处理
\********************************/

function selectedHourFun(hour) {
    selectedHour.value = hour;
    selectedValue.value = `${hour}:${selectedMinute.value}`;
}

function selectedMinuteFun(min) {
    selectedMinute.value = min;
    selectedValue.value = `${selectedHour.value}:${min}`;
}

/********************************\
 * 逆显示处理
\********************************/
// 接收传入的 prop
const props = defineProps(['selectedTime']);

// 使用 watchEffect 来观察 props.selectedTime 的变化，并据此更新 selectedValue
watchEffect(() => {
    if (props.selectedTime) {
        selectedValue.value = getFormattedDateThree(props.selectedTime);
    }
});
/********************************\
 * 清空下拉框处理
\********************************/
</script>

<template>
    <div class="hourmin_container">
        <el-col :span="12">
            <el-select
                v-model="selectedValue"
                class="custom-time-select"
                placeholder="请选择时间"
                @focus="handleFocus"
            >
                <!-- 显示小时 -->
                <div class="hour-section">
                    <el-option
                        v-for="hour in Array.from(
                            { length: 11 },
                            (_, i) => i + 8,
                        )"
                        :key="hour"
                        :label="hour < 10 ? `0${hour}` : `${hour}`"
                        :value="hour < 10 ? `0${hour}` : `${hour}`"
                        @click="
                            selectedHourFun(hour < 10 ? `0${hour}` : `${hour}`)
                        "
                    ></el-option>
                </div>
            </el-select>
        </el-col>
        <el-col :span="12">
            <el-select>
                <!-- 显示分钟 -->
                <div class="minute-section">
                    <el-option
                        label="00"
                        value="00"
                        @click="selectedMinuteFun('00')"
                    ></el-option>
                    <el-option
                        label="30"
                        value="30"
                        @click="selectedMinuteFun('30')"
                    ></el-option>
                </div>
            </el-select>
        </el-col>
    </div>
</template>

<style scoped>
.hourmin_container {
    margin: 0;
    padding: 0;
    display: flex;
}

.show {
    display: flex;
    padding: 3px 5px;
}
.hour,
.min {
    flex: 1;
    text-align: center;
}

.content {
    display: flex;
}

.hour-section,
.minute-section {
    flex: 1;
    display: block;
    text-align: center;
}
.hour-section {
    height: 200px; /* 设置一个固定高度 */
    overflow-y: auto; /* 允许垂直滚动 */
}

.footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding-right: 10px;
    margin-top: 3px;

    .btn {
        padding: 3px 8px;
        cursor: pointer;
        /* border: 1px solid black; */
    }

    .sure {
        margin-left: 6px;
    }
}
</style>
