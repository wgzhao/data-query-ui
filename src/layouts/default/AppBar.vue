<template>
  <v-app-bar :elevation="2" class="bg-primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </template>

    <!-- link -->
    <template v-slot:default>
      <v-app-bar-title>数据查询管理后台</v-app-bar-title>
      <!-- <v-toolbar-items class="hidden-sm-and-down"> -->
      <template v-for="item in urls">
        <v-btn flat :to="item.url"> {{ item.title }}</v-btn>
      </template>
      <!-- </v-toolbar-items> -->

      <div v-if="isLogin">
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
            >
              Admin
            </v-btn>
          </template>
          <v-list>
            <v-list-item to="/admin/profile">个人信息</v-list-item>
            <v-list-item to="/admin/change_password">修改密码</v-list-item>
            <v-list-item to="/logout">注销</v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else>
        <v-btn flat to="/login">登录</v-btn>
      </div>
    </template>
    <!--
<template v-slot:append>
<v-btn icon="mdi-heart"></v-btn>

<v-btn icon="mdi-magnify"></v-btn>

<v-btn icon="mdi-dots-vertical"></v-btn>
</template>
-->
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
  >
    <v-list>
      <template v-for="item in urls">
        <v-list-item :to="item.url" link>{{ item.title }}</v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import parseJwt from "@/util/jwt-util";

const urls = ref([
  {
    title: "首页",
    url: "/admin/home",
  },
  {
    title: "数据源管理",
    url: "/admin/data_sources",
  },
  {
    title: "查询配置管理",
    url: "/admin/query_configs",
  },
  {
    title: "签名管理",
    url: "/admin/signs",
  },
  {
    title: "查询日志管理",
    url: "/admin/query_logs",
  },
]);

const drawer = ref(false);
const group = ref(null);

watch(group, () => {
  drawer.value = false;
});

const isLogin = computed(() => {
  const token = localStorage.getItem("token");
  if (token && parseJwt(token)) {
    return true;
  }
  return false;
});
</script>
