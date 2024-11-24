<template>
  <v-snackbar
    v-model="toast.showToast"
    multi-line
    vertical
    location="top"
    :color="toast.color"
  >
    {{ toast.msg }}
  </v-snackbar>
</template>
<script setup lang="ts">
import type { Toast } from "@/types";

defineProps<{
  toast: Toast;
}>();
</script>
