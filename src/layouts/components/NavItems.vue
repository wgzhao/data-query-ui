<script lang="ts" setup>
import VerticalNavSectionTitle from "@/@layouts/components/VerticalNavSectionTitle.vue";
import VerticalNavGroup from "@layouts/components/VerticalNavGroup.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";
</script>

<template>
  <!-- 👉 Dashboards -->
  <VerticalNavGroup
    :item="{
      title: 'Dashboards',
      badgeContent: '5',
      badgeClass: 'bg-error',
      icon: 'ri-home-smile-line'
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Analytics',
        to: '/dashboard'
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'CRM',
        href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/dashboards/crm',
        target: '_blank',
        badgeContent: 'Pro',
        badgeClass: 'bg-light-primary text-primary'
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'ECommerce',
        href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/dashboards/ecommerce',
        target: '_blank',
        badgeContent: 'Pro',
        badgeClass: 'bg-light-primary text-primary'
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Academy',
        href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/dashboards/academy',
        target: '_blank',
        badgeContent: 'Pro',
        badgeClass: 'bg-light-primary text-primary'
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Logistics',
        href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/dashboards/logistics',
        target: '_blank',
        badgeContent: 'Pro',
        badgeClass: 'bg-light-primary text-primary'
      }"
    />
  </VerticalNavGroup>

  <!-- query admin -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Data Query Admin'
    }"
  />
  <VerticalNavLink
    :item="{
      title: '查询配置',
      icon: 'ri-settings-4-line',
      to: '/admin/query_configs'
    }"
  />
  <VerticalNavLink
    :item="{
      title: '数据源管理',
      icon: 'ri-database-2-line',
      to: '/admin/data_sources'
    }"
  />
  <VerticalNavLink
    :item="{
      title: '签名管理',
      icon: 'ri-key-2-line',
      to: '/admin/signs'
    }"
  />
  <VerticalNavLink
    :item="{
      title: '查询历史日志',
      icon: 'ri-article-line',
      to: '/admin/query_logs'
    }"
  />

  <!-- 👉 Apps & Pages -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Apps & Pages'
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Account Settings',
      icon: 'ri-user-settings-line',
      to: '/account-settings'
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Login',
      icon: 'ri-login-box-line',
      to: '/login'
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Register',
      icon: 'ri-user-add-line',
      to: '/register'
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Error',
      icon: 'ri-information-line',
      to: '/no-existence'
    }"
  />

  <!-- 👉 User Interface -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'User Interface'
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Typography',
      icon: 'ri-text',
      to: '/typography'
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Icons',
      icon: 'ri-remixicon-line',
      to: '/icons'
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Cards',
      icon: 'ri-bar-chart-box-line',
      to: '/cards'
    }"
  />

  <!-- 👉 Forms & Tables -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Forms & Tables'
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Form Layouts',
      icon: 'ri-layout-4-line',
      to: '/form-layouts'
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Tables',
      icon: 'ri-table-alt-line',
      to: '/tables'
    }"
  />
</template>
