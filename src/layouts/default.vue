<template>
  <v-app>
    <div id="wrapper">
    <AppBar />
  <!-- content-->
  <v-main>
    <router-view></router-view>
  </v-main>
  </div>
  </v-app>
</template>

<script setup>
import AppBar from './default/AppBar.vue';
</script>
<style>
.v-main {
  margin-left: 1cap;
  margin-right: 1cap;
}
</style>
