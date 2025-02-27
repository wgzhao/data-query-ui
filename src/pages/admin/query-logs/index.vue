<template>
  <v-container fluid class="pa-4">
    <v-card flat class="mb-6">
      <v-card-text>
        <v-row dense align="center" class="mb-2">
          <v-col cols="auto">
            <v-toolbar-title class="text-h5 font-weight-bold">查询日志</v-toolbar-title>
          </v-col>
        </v-row>
        <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
          以下为当前的查询日志列表，您可以查看或搜索日志详情。
        </div>
      </v-card-text>
    </v-card>

    <v-card flat>
      <v-card-text>
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items-length="totalItems"
          :items="logs"
          :loading="loading"
          item-value="id"
          density="compact"
          class="elevation-1"
          @update:options="loadItems"
          :expanded="expanded"
          show-expand
        >
          <template v-slot:top>
            <v-toolbar density="compact" class="mb-2">
              <v-spacer />
              <v-text-field
                v-model="q"
                label="搜索"
                density="compact"
                single-line
                hide-details
                variant="outlined"
                clearable
                prepend-inner-icon="mdi-magnify"
                style="max-width: 300px;"
                @keyup.enter="searchLogs"
              />
            </v-toolbar>
          </template>

          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length" class="pa-4">
                <highlightjs language="sql" :code="item.querySql" />
              </td>
            </tr>
          </template>

          <template v-slot:no-data>
            <v-alert type="info" class="mt-2">暂无查询日志数据</v-alert>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import QueryLogService from "@/services/querylog";
import { ref } from "vue";

const logs = ref([]);
const totalItems = ref(10);
const itemsPerPage = ref(10);
const loading = ref(false);
const q = ref("");
const expanded = ref([]);

const headers = ref([
  { title: "编号", key: "id", width: "15%" },
  { title: "应用ID", key: "appId", width: "20%" },
  { title: "查询ID", key: "selectId", width: "20%" },
  { title: "查询时间", key: "createdAt", width: "25%" },
  {
    title: "查询SQL",
    key: "data-table-expand",
    sortable: false,
    width: "20%",
  },
]);

const createSort = (sortBy) => {
  let sortKey = [];
  let sortOrder = [];
  if (sortBy.length) {
    for (let i = 0; i < sortBy.length; i++) {
      sortKey.push(sortBy[i].key);
      sortOrder.push(sortBy[i].order);
    }
  } else {
    sortKey.push("createdAt");
    sortOrder.push("desc");
  }
  return { sortKey: sortKey.join(), sortOrder: sortOrder.join() };
};

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true;
  const sorts = createSort(sortBy);
  try {
    const res = q.value
      ? await QueryLogService.search(q.value, page - 1, itemsPerPage, sorts)
      : await QueryLogService.list(page - 1, itemsPerPage, sorts);
    logs.value = res.content;
    totalItems.value = res.totalElements;
  } catch (err) {
    console.error("Error loading logs:", err);
    alert(`加载日志失败: ${err.message}`);
  } finally {
    loading.value = false;
  }
};

const searchLogs = () => {
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
};
</script>
