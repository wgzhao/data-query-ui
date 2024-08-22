<template>
  <v-data-table :headers="headers" :items="signs">
    <template v-slot:top>
      <v-toolbar density="compact">
        <v-toolbar-title>签名</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-btn
          small
          class="btn btn-primary"
          variant="outlined"
          prepend-icon="mdi-plus"
          @click="addItem"
        >
          新增
        </v-btn>
      </v-toolbar>
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import SignService from "@/services/sign";
import { Sign } from "@/types";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const signs = ref<Sign[]>([]);
const headers = ref([
  { title: "App Id", value: "appId" },
  { title: "App Secret", value: "appKey" },
  { title: "申请人", value: "applier" }
]);

const addItem = () => {
  router.push(route.name?.toString() + "new");
};
onMounted(() => {
  SignService.list().then(res => (signs.value = res.data));
});
</script>
