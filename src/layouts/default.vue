<template>
  <v-app>
    <div id="wrapper">
      <AppBar />
      <!-- content-->
      <v-main class="mt-1">
        <router-view></router-view>
      </v-main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import AppBar from './default/AppBar.vue';
</script>
<style>
</style>
