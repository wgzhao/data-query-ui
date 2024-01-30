<template>
<v-card flat title="新增查询">
  <v-sheet>
    <v-form @submit.prevent>
      <v-text-field label="查询ID" v-model="form.selectId" required></v-text-field>
      <v-text-field label="数据源" v-model="form.dataSource" required></v-text-field>
      <v-checkbox label="是否启用缓存" v-model="form.enableCache"></v-checkbox>
      <v-text-field label="缓存时间" v-model="form.cacheTime" required></v-text-field>
      <v-text-field label="查询语句" v-model="form.querySql" required></v-text-field>
      <v-checkbox label="是否启用" v-model="form.isEnable"></v-checkbox>
      <v-text-field label="备注" v-model="form.note" required></v-text-field>
      <v-btn type="submit" color="primary">提交</v-btn>
    </v-form>
  </v-sheet>
</v-card>
</template>
<script setup>
const form=ref({
  selectId: "",
  dataSource: "",
  enableCache: true,
  cacheTime: 600,
  querySql: "",
  isEnable: true,
  note: ""
})
</script>
