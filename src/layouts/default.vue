<template>
  <div class="bg-gray-200 dark:bg-gray-600">
    <AppBar/>
    <!-- content-->
    <section class="bg-gray-50 dark:bg-gray-900 p-5 mt-1">
      <router-view></router-view>
    </section>
  </div>
</template>

<script setup lang="ts">
import AppBar from './default/AppBar.vue';
</script>
<style>
.v-main {
  margin-left: 1cap;
  margin-right: 1cap;
}
</style>
