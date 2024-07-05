<template>
  <v-sparkline
    :auto-line-width="autoLineWidth"
    :fill="fill"
    :gradient="gradient"
    :gradient-direction="gradientDirection"
    :line-width="width"
    :model-value="value"
    :padding="padding"
    :smooth="radius || false"
    :stroke-linecap="lineCap"
    :type="type"
  ></v-sparkline>
</template>

<script setup lang="ts">
import { ref } from "vue";
const gradients = ref([
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"]
]);

const width = ref(2);
const radius = ref(10);
const padding = ref(8);
const lineCap = ref("round");
const gradient = ref(gradients.value[5]);
const value = ref([0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]);
const gradientDirection = ref("top");
const fill = ref(false);
const type = ref("trend");
const autoLineWidth = ref(false);
</script>
