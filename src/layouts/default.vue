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
import { ref, onMounted } from "vue";
import AppBar from "./default/AppBar.vue";
import Footer from "./default/Footer.vue";
const theme = ref("dark");
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();
// check if user is logged in
onMounted(() => {
  if (localStorage.getItem("token") === null) {
    // router.push("/login");
    console.log(location.href);
  }
});
</script>
<style></style>
