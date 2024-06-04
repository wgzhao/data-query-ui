<template></template>

<script setup lang="ts">
import { onMounted } from "vue";
import router from "@/router";

const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
};
onMounted(() => {
    // logout
    logout();
});
</script>
