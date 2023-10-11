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
const selectedHour = ref('00'); // 初始化为 '00'
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
function selectedMinuteFun(min) {
    selectedMinute.value = min;
    selectedValue.value = `${selectedHour.value}:${min}`;
}

function selectedHourFun(hour) {
    selectedHour.value = hour;
    selectedValue.value = `${hour}:${selectedMinute.value}`;
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
</script>

<template>
    <div class="hourmin_container">
        <el-select
            v-model="selectedValue"
            class="custom-time-select"
            placeholder="请选择时间"
        >
            <div class="content">
                <!-- 显示小时 -->
                <div class="hour-section">
                    <div>小时</div>
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

                <!-- 显示分钟 -->
                <div class="minute-section">
                    <div>分钟</div>
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
            </div>
        </el-select>
    </div>
</template>

<style scoped>
.hourmin_container {
    margin: 0;
    padding: 0;
}

.content {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
}

.hour-section,
.minute-section {
    width: 80px;
    text-align: center;
}
.hour-section {
    text-align: center;
    height: 200px; /* 设置一个固定高度 */
    overflow-y: auto; /* 允许垂直滚动 */
}

.hour-section > div:first-child,
.minute-section > div:first-child {
    line-height: 2; /* 调整行高以与选项对齐 */
    margin-bottom: 5px; /* 根据需要微调间距 */
}

.minute-section {
    width: 70px; /* 调整宽度 */
    text-align: center;
}
</style>
