<template>
  <v-data-table :headers="headers" :items="signs" class="striped-rows">
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
    <template v-slot:item.enabled="{ item }">
      <v-chip
        :color="item.enabled ? 'success' : 'error'"
        text-color="white"
        small
        >{{ item.enabled ? "已启用" : "已禁用" }}</v-chip
      >
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn type="button" class="primary" @click="deleteSign(item.appId)"
        >删除</v-btn
      >
      <v-btn type="button" class="primary" @click="toggle(item.appId)">
        {{ item.enabled ? "禁用" : "启用" }}
      </v-btn>
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
  { title: "申请人", value: "applier" },
  { title: "是否启用", value: "enabled" },
  {
    title: "操作",
    value: "actions",
    sortable: false
  }
]);

const addItem = () => {
  router.push(route.name?.toString() + "new");
};

const deleteSign = (appId: string) => {
  SignService.remove(appId).then(() => {
    alert("删除成功");
    signs.value = signs.value.filter(sign => sign.appId !== appId);
  });
};

const toggle = (appId: string) => {
  const sign = signs.value.find(sign => sign.appId === appId);
  if (sign) {
    sign.enabled = !sign.enabled;
    SignService.update(sign).then(() => {
      signs.value = signs.value.map(s => (s.appId === appId ? sign : s));
    });
  }
};
onMounted(() => {
  SignService.list().then(res => (signs.value = res));
});
</script>
<style></style>
