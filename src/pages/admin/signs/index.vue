<template>
  <v-card flat>
    <v-card-title>
      <v-icon>mdi-key</v-icon>
       签名
      <v-spacer></v-spacer>
       <a type="button" class="btn btn-ms btn-primary" variant="outlined" href="/admin/signs/new">
        <v-icon>mdi-plus</v-icon>
        新增
      </a>
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="signs">
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import SignService from '@/services/sign';

const signs = ref([])
const headers = ref([
  {title: "App Id", value: "appId"},
  {title: "App Secret", value: "appKey"},
  {titlt: "申请人", value: "applier"},
  {title: "申请时间", value: "createdAt"}
])

const add = () => {
  this.$router.push({name: "admin-signs-new"})
}
onMounted(() => {
  SignService.list().then(res => signs.value = res.data);
});
</script>
