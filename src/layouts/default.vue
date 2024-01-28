<template>
  <v-app>
    <AppBar />
  <!-- content-->
  <v-main>
    <router-view></router-view>
  </v-main>
  </v-app>
</template>

<script setup>
import AppBar from './default/AppBar.vue';
</script>
