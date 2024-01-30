<template>
<!-- data sources-->
<v-card flat>
  <v-card-title>
    数据源
    <v-btn small class="btn btn-primary" variant="outlined" prepend-icon="mdi-plus" @click="add">新增</v-btn>
  </v-card-title>
  <v-card-text>
    <v-data-table :headers="headers" :search="search" :items="data" density="compact">
      <template v-slot:top>
        <v-text-field density="compact" v-model="search" label="搜索" single-line hide-details></v-text-field>
      </template>
      <template v-slot:item.actions="{ item }">
        <router-link :to="$route.name + item.no">
        <v-icon small >mdi-pencil</v-icon>
        </router-link>
        <v-icon small @click="remove(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-card-text>
</v-card>
</template>
<script setup>

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import DataSourcesService from '@/services/datasources';

const router = useRouter()
const route = useRoute()
const search = ref('');
const data = ref([]);

const headers = ref([
  { title: '#', value: 'no'},
  { title: '名称', value: 'name' },
  { title: '地址', value: 'url' },
  { title: '用户名', value: 'username' },
  { title: '密码', value: 'password' },
  // { title: "驱动类", value: 'driver'},
  // { title: "创建时间", value: 'createdAt'},
  // { title: "更新时间", value: 'updatedAt'},
  { title: '操作', value: 'actions', sortable: false },
]);

const add = () => {
  router.push(route.name + 'new');
};

const remove = (item) => {
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
