<template>
  <!-- data sources-->
  <v-data-table :headers="headers" :search="search" :items="data" density="compact" class="bg-grey-darken-5">
    <template v-slot:top>
      <v-toolbar density="compact">
        <v-toolbar-title>数据源</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field density="compact" v-model="search" label="搜索" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-btn small class="btn btn-primary" variant="outlined" prepend-icon="mdi-plus" @click="add" v-bind="props">
          新增
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:activator="{props}">
      <v-btn small class="flex btn btn-primary" variant="outlined" prepend-icon="mdi-plus" @click="add" v-bind="props">
        新增
      </v-btn>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="edit(item)">mdi-pencil</v-icon>
      <v-icon small @click="remove(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>
<script setup lang="ts">

import {ref, onMounted} from 'vue';
import {useRouter, useRoute} from 'vue-router'
import DataSourcesService from '@/services/datasources';
import DataSource from '@/types/data-source';

const router = useRouter()
const route = useRoute()
const search = ref('');
const data = ref<DataSource[]>([]);

const headers = ref([
  {title: '#', value: 'no', width: "5%"},
  {title: '名称', value: 'name', width: "5%"},
  {title: '地址', value: 'url', width: "20%"},
  {title: '用户名', value: 'username', width: "5%"},
  {title: '操作', value: 'actions', sortable: false, width: "5%"},
]);

const add = () => {
  router.push(route.name + 'new');
};

const edit = (item: DataSource) => {
  router.push(route.name + item.no);
}
const remove = (item: DataSource) => {
  // remove from data
  const index = data.value.indexOf(item);
  if (index > -1) {
    data.value.splice(index, 1);
  }
  //then post to api
  DataSourcesService.remove(item.no)
    .then(res => {
      if (res.data.success == false) {
        alert("删除失败:\n" + res.data.message)
      } else {
        alert("删除成功")
      }
    })
    .catch(err => alert("删除失败" + err))
}
onMounted(() => {
  DataSourcesService.list().then(res => data.value = res.data);
});
</script>
