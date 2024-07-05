<template>
  <v-app :theme="theme">
    <AppBar v-model="theme" />
    <!-- content-->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppBar from "./default/AppBar.vue";
const theme = ref("dark");
</script>
<style></style>
