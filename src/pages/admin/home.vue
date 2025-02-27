<template>
  <v-card>
    <v-card-title class="text-center">日访问量统计</v-card-title>
    <v-card-text>
      <v-sparkline
        v-if="queryByDate.length > 0"
        :model-value="values"
        :labels="labels"
        :gradient="gradient"
        :smooth="10"
        :padding="8"
        :line-width="1"
        :auto-line-width="false"
        stroke-linecap="round"
        type="trend"
        :auto-draw="true"
        :auto-draw-duration="2000"
        :auto-draw-easing="easing"
        :show-labels="true"
        label-size="5"
      ></v-sparkline>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Statistic from "@/services/statistic";

const gradient = ["#1867C0", "#5CBBF6"];
const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

const gradientDirection = ref("top");
const autoLineWidth = ref(false);
const queryByDate = ref([]);

// 提取 num 值作为图表数据
const values = computed(() => queryByDate.value.map(item => item.num));

// 提取日期作为标签
const labels = computed(() =>
  queryByDate.value.map(item => {
    // 格式化日期，只显示日期部分 (MM-DD)
    const date = new Date(item.d);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  })
);

onMounted(async () => {
  const result = await Statistic.byDate();
  queryByDate.value = result;
});
</script>
