<template>
<!-- query logs-->
<v-card flat title="查询日志">
  <div class="v-row">
    <v-col cols="4" md="4">
      <v-select
        v-model="selected"
        :items="searchType"
        item-title="text"
        item-value="value"
        label="搜索类型"
      >
      </v-select>
      </v-col>
    <v-col cols="6" md="6">
      <v-text-field v-model="search" label="搜索" single-line hide-details
      @keyup.enter="searchLogs"
      ></v-text-field>
    </v-col>
  </div>
  <v-card-text>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items-length="totalItems"
    :items="logs"
    :loading="loading"
    item-value="name"
    @update:options="loadItems"
  >
  <template v-slot:item.querySql="{ item }">
    <pre>{{ item.querySql }}</pre>
    </template>
</v-data-table-server>
</v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import QueryLogService from '@/services/querylog'
import {ref} from 'vue'
const logs = ref([])
const totalItems = ref(10)
const itemsPerPage = ref(10)
const loading = ref(false)
const search = ref('')
const headers = ref([
  {title: "应用ID", key: "appId"},
  {title: "查询ID", key: "selectId"},
  {title: "查询SQL", key: "querySql"},
  {title: "查询时间", key: "createdAt"}
])
const selected = ref("")
const searchType = ref([
  {
    text: "应用ID",
    value: "appId"
  },
  {
    text: "查询ID",
    value: "selectId"
  }
])

const loadItems =  ({page, itemsPerPage, sortBy}) => {
    loading.value = true;
    if (selected.value != "" && search.value != "") {
      if (selected.value == "appId") {
        QueryLogService.searchAppId(search.value, page -1, itemsPerPage).then(res => {
          logs.value = res.data["content"];
          totalItems.value = res.data["totalElements"];
          loading.value = false;
        });
        return;
      } else if (selected.value == "selectId") {
        QueryLogService.searchSelectId(search.value, page -1, itemsPerPage).then(res => {
          logs.value = res.data["content"];
          totalItems.value = res.data["totalElements"];
          loading.value = false;
        });
        return;
      }
      return;
    }
    QueryLogService.list(page -1, itemsPerPage).then(res => {
      logs.value = res.data["content"];
        totalItems.value = res.data["totalPages"];
        loading.value = false;
    });

}

const searchLogs = () => {
  loadItems({page: 1, itemsPerPage: itemsPerPage.value, sortBy: []})
}
</script>
