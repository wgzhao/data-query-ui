<template>
  <v-card title="查询配置">
    <v-card-text>
      <v-row justify="end" gutters="2">
        <v-col cols="3" md="5">
          <v-text-field
            density="compact"
            v-model="search"
            label="搜索"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="3" md="1"
          ><v-btn class="bg-primary" @click="doAction('edit')"
            >编辑</v-btn
          ></v-col
        >
        <v-col cols="3" md="1"
          ><v-btn class="bg-primary" @click="doAction('delete')"
            >删除</v-btn
          ></v-col
        >
        <v-col cols="3" md="1"
          ><v-btn class="bg-primary" @click="doAction('deleteCache')"
            >删除存储</v-btn
          ></v-col
        >

        <v-col cols="3" md="1"
          ><v-btn class="bg-primary" @click="addItem"> 新增 </v-btn></v-col
        >
      </v-row>
    </v-card-text>
  </v-card>

  <v-data-table
    :headers="headers"
    :search="search"
    :items="data"
    density="compact"
    :expanded="expanded"
    item-value="selectId"
    class="bg-transparent"
    striped
    show-expand
    show-select
    select-strategy="single"
    fixed-header
    v-model="selectedItem"
  >
    <template v-slot:item.dataSource="{ item }">
      <router-link
        :to="`/admin/data_sources/${item.dataSource}`"
        type="button"
        target="_blank"
        class="text-decoration-none"
      >
        {{ item.dataSource }}
        <v-icon>mdi-open-in-new</v-icon>
      </router-link>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <highlightjs language="sql" :code="item.querySql" />
        </td>
      </tr>
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import QueryconfigService from "@/services/queryconfig";
import { QueryConfig } from "@/types";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const data = ref<QueryConfig[]>([]);
const expanded = ref([]);
const headers = ref([
  { title: "查询ID", key: "selectId" },
  { title: "数据源", key: "dataSource" },
  { title: "启用缓存", key: "enableCache" },
  { title: "缓存时间(s)", key: "cacheTime" },
  // { title: "查询语句", key: "querySql", width: "60%" },
  { title: "启用", key: "enabled" },
  { title: "创建时间", key: "createdAt" },
  { title: "修改时间", key: "updatedAt" },
  { title: "备注", key: "note" },
  { title: "SQL", key: "data-table-expand" }
]);
const search = ref();

const selectedItem = ref([]);

const addItem = () => {
  router.push(route.name?.toString() + "new");
};

function doAction(dtype: string) {
  if (selectedItem.value.length > 0) {
    let id = selectedItem.value[0];
    if (dtype === "edit") {
      editItem(id);
    } else if (dtype === "delete") {
      deleteItem(id);
    } else if (dtype === "deleteCache") {
      deleteCache(id);
    }
  } else {
    return;
  }
}

function editItem(id: string) {
  router.push(route.name?.toString() + id);
}

function deleteItem(id: string) {
  if (confirm("确认删除？")) {
    QueryconfigService.remove(id).then(() => {
      data.value = data.value.filter(item => item.selectId !== id);
    });
  }
}

function deleteCache(id: string) {
  QueryconfigService.deleteCache(id).then(res => {
    alert("缓存已删除, 删除数量: " + res);
  });
}

onMounted(() => {
  QueryconfigService.list().then(res => (data.value = res));
});
</script>
