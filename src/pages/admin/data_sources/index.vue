<template>
  <v-container class="p-0 md-0">
    <section>
      <h3
        class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold"
      >
        数据源

        <v-btn
          class="text-none"
          color="primary"
          prepend-icon="mdi-plus"
          rounded="md"
          slim
          text="新增"
          variant="flat"
          @click="add"
        />
      </h3>
      <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
        以下为当前的数据源列表，您可以查看、编辑或删除数据源。
      </div>
      <!-- data sources-->
      <v-data-table
        :headers="headers"
        :search="search"
        :items="data"
        class="bg-transparent"
        hide-default-footer
      >
        <!-- <template v-slot:top>
          <v-toolbar density="compact">
            <v-spacer></v-spacer>
            <v-text-field
              density="compact"
              v-model="search"
              label="搜索"
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>
        </template> -->
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
    </section>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import DataSourcesService from "@/services/datasources";
import DataSource from "@/types/data-source";

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
  router.push(route.name?.toString() + "new");
};

const edit = (item: DataSource) => {
  router.push(route.name?.toString() + item.no);
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
      if (res.data.success) {
        alert("删除成功");
      } else {
        alert("删除失败:\n" + res.data.message);
      }
    })
    .catch(err => alert("删除失败" + err));
};
onMounted(() => {
  DataSourcesService.list().then(res => (data.value = res.data));
});
</script>
