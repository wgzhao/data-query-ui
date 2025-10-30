<template></template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const router = useRouter();
const authStore = useAuthStore();

const logout = () => {
  // 调用 authStore 的 logout 方法来清理所有认证状态
  authStore.logout();
  router.push("/login");
};

onMounted(() => {
  // logout
  logout();
});
</script>
