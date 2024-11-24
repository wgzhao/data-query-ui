<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <span class="headline">数据源</span>
      <v-spacer></v-spacer>
      <v-btn
        class="text-none"
        color="primary"
        rounded="md"
        text="新增"
        variant="flat"
        @click="add"
      />
    </v-card-title>

    <v-data-table
      :headers="headers"
      :search="search"
      :items="data"
      class="bg-transparent"
      hide-default-footer
    >
      <template v-slot:item.actions="{ item }">
        <div class="d-flex mx-auto">
          <v-btn
            class="text-none"
            color="primary"
            min-width="0"
            slim
            text="编辑"
            variant="text"
            @click="edit(item)"
          />
          <v-btn
            class="text-none"
            color="primary"
            min-width="0"
            slim
            text="删除"
            variant="text"
            @click="remove(item)"
          />
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import DataSourcesService from "@/services/datasources";
import { DataSource } from "@/types";

const router = useRouter();
const route = useRoute();
const search = ref("");
const data = ref<DataSource[]>([]);

const headers = ref([
  { title: "编号", value: "no", width: "5%" },
  { title: "名称", value: "name", width: "5%" },
  { title: "地址", value: "url", width: "20%" },
  { title: "用户名", value: "username", width: "5%" },
  {
    title: "操作",
    value: "actions",
    sortable: false,
    width: "5%",
    align: "center"
  }
]);

const add = () => {
  console.log("route", route.path);
  router.push(`${route.path}new`);
};

const edit = (item: DataSource) => {
  router.push(`${route.path}${item.no}`);
};
const remove = (item: DataSource) => {
  // remove from data
  const index = data.value.indexOf(item);
  if (index > -1) {
    data.value.splice(index, 1);
  }
  //then post to api
  DataSourcesService.remove(item.no)
    .then(res => {
      if (res.code == 200) {
        alert("删除成功");
      } else {
        alert("删除失败:\n" + res.message);
      }
    })
    .catch(err => alert("删除失败" + err));
};
onMounted(() => {
  DataSourcesService.list().then(res => (data.value = res));
});
</script>
