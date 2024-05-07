<template>
<v-app-bar :elevation="2" class="bg-primary">
  <template v-slot:prepend>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
  </template>

  <!-- link -->
  <template v-slot:default>
    <v-app-bar-title>数据查询管理后台</v-app-bar-title>
    <!-- <v-toolbar-items class="hidden-sm-and-down"> -->
    <v-btn flat to="/admin/home">首页</v-btn>

    <v-btn flat to="/admin/data_sources">数据源管理</v-btn>
    <v-btn flat to="/admin/query_configs">查询配置管理</v-btn>
    <v-btn flat to="/admin/signs">签名管理</v-btn>
    <v-btn flat to="/admin/query_logs">查询日志管理</v-btn>
  <!-- </v-toolbar-items> -->
  </template>

  <template v-slot:append>
    <v-btn icon="mdi-heart"></v-btn>

    <v-btn icon="mdi-magnify"></v-btn>

    <v-btn icon="mdi-dots-vertical"></v-btn>
  </template>
</v-app-bar>
</template>

<script setup lang="ts">
  //
</script>
