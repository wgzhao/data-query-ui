<template></template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
onMounted(() => {
  // logout
  logout();
});
</script>
