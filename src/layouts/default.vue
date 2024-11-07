<template>
  <v-app :theme="theme">
    <AppBar v-model="theme" />
    <!-- content-->
    <v-main class="mt-2">
      <router-view></router-view>
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppBar from "./default/AppBar.vue";
import Footer from "./default/Footer.vue";
const theme = ref("dark");
</script>
<style>
</style>
