<template>
<DefaultLayout />
</template>

<script setup lang="ts">

import DefaultLayout from '@/layouts/default.vue'
import {onMounted} from "vue";
import {initFlowbite} from "flowbite";

onMounted(() => {
  initFlowbite();
})
</script>
