<template>
<v-card flag title="查询配置">
  <v-card-title>
       <router-link type="button" class="btn btn-ms btn-primary" variant="outlined" to="/admin/query_configs/new">
        <v-icon>mdi-plus</v-icon>
        新增
       </router-link>
  </v-card-title>
  <v-card-text>
    <v-data-table :headers="headers" :items="data">
    </v-data-table>
  </v-card-text>
</v-card>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import QueryconfigService from '@/services/queryconfig'

const data = ref([])

const headers = ref([
  {title: "查询ID", key: "selectId"},
  {title: "数据源", key: "dataSource"},
  {title: "是否启用缓存", key: "enableCache"},
  {title: "缓存时间", key: "cacheTime"},
  {title: "查询语句", key: "querySql"},
  {title: "是否启用", key: "isEnable"},
  {title: "备注", key:"note"}
])
onMounted(() => {
  QueryconfigService.list().then(res => data.value = res.data);
});
</script>
