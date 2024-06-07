<template></template>

<script setup lang="ts">
import { onMounted } from "vue";
const logout = () => {
    localStorage.removeItem("token");
    location.href = "/login";
};
onMounted(() => {
    // logout
    logout();
});
</script>
