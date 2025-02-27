<template>
  <v-app-bar elevation="4" class="bg-primary px-3">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>

    <!-- link -->
    <template v-slot:default>
      <v-app-bar-title>数据查询管理后台</v-app-bar-title>
      <!-- <v-toolbar-items class="hidden-sm-and-down"> -->
      <template v-for="item in urls">
        <v-btn flat :to="item.url"> {{ item.title }}</v-btn>
      </template>
      <!-- </v-toolbar-items> -->
    </template>

    <template #append>
      <v-btn
        :prepend-icon="
          theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
        "
        slim
        @click="theme === 'light' ? (theme = 'dark') : (theme = 'light')"
      ></v-btn>
      <div v-if="curUser">
        <v-btn class="ms-1">
          {{ curUser }}
          <v-menu activator="parent" origin="top">
            <v-list>
              <v-list-item link to="/admin/profile" title="个人信息" />
              <v-list-item link to="/admin/change_password" title="修改密码" />
              <v-list-item link to="/logout" title="注销" />
            </v-list>
          </v-menu>
        </v-btn>
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
  <v-navigation-drawer v-model="drawer" color="primary" disable-resize-watcher>
    <v-list nav>
      <v-list-item
        v-for="(item, i) in urls"
        :key="i"
        :active="i === 0"
        :to="item.url"
        link
        :title="item.title"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import parseJwt from "@/util/jwt-util";
import { useAuthStore } from "@/store/auth.ts";

const theme = defineModel();
const authStore = useAuthStore();
const curUser = authStore.username;
const urls = ref([
  {
    title: "首页",
    url: "/admin/home"
  },
  {
    title: "数据源管理",
    url: "/admin/data-sources"
  },
  {
    title: "查询配置管理",
    url: "/admin/query-configs"
  },
  {
    title: "签名管理",
    url: "/admin/signs"
  },
  {
    title: "查询日志管理",
    url: "/admin/query-logs"
  }
]);

const drawer = ref(false);
const group = ref(null);

watch(group, () => {
  drawer.value = false;
});
</script>
