<template>
<v-card flag title="查询配置">
  <v-card-title>
       <router-link type="button" class="btn btn-ms btn-primary" variant="outlined" to="/admin/query_configs/new">
        <v-icon>mdi-plus</v-icon>
        新增
       </router-link>
  </v-card-title>
  <v-card-text>
    <v-data-table :headers="headers" :items="data" density="compact">
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.selectId }}</td>
          <td>{{ item.dataSource }}</td>
          <td><v-chip :color="item.enableCache ? 'success' : 'error'" dark>
            {{ item.enableCache ? '是' : '否' }}</v-chip></td>
          <td>{{ item.cacheTime }}</td>
          <td>{{ item.querySql }}</td>
          <td><v-chip :color="item.enable ? 'success' : 'error'" dark>
            {{ item.enable ? '是' : '否' }}</v-chip></td>
          <td>{{ item.createdAt }}</td>
          <td>{{ item.updatedAt }}</td>
          <td>{{ item.note }}</td>
          <td>
            <router-link :to="`/admin/query_configs/${item.selectId}`">
            <v-icon >mdi-pencil</v-icon>
            </router-link>
            <v-icon @click="deleteItem(item.selectId)">mdi-delete</v-icon>
            </td>
        </tr>
        </template>

    </v-data-table>
  </v-card-text>
</v-card>
</template>
<script setup lang="ts">
import {ref, onMounted} from 'vue'
import QueryconfigService from '@/services/queryconfig'
import QueryConfig from '@/types/query-config'

const data = ref<QueryConfig[]>([])

const headers = ref([
  {title: "查询ID", key: "selectId"},
  {title: "数据源", key: "dataSource"},
  {title: "是否启用缓存", key: "enableCache"},
  {title: "缓存时间", key: "cacheTime"},
  {title: "查询语句", key: "querySql", width: "50%"},
  {title: "是否启用", key: "enabled"},
  {title: "创建时间", key: "createdAt"},
  {title: "最后修改时间", key: "updatedAt"},
  {title: "备注", key:"note"},
  {title: "操作", key:"action"}
])
const deleteItem = (id: string) => {
  if (confirm("确认删除？")) {
    QueryconfigService.remove(id).then(res => {
      data.value = data.value.filter(item => item.selectId !== id);
      //QueryconfigService.list().then(res => data.value = res.data);
    })
  }
}

onMounted(() => {
  QueryconfigService.list().then(res => data.value = res.data);
});
</script>
