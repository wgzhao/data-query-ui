<template>
  <v-footer height="40" app>
    <a
      class="text-decoration-none on-surface mx-2 d-inline-block hover:primary"
      href="https://github.com/wgzhao/data-query-ui/"
      rel="noopener noreferrer"
      target="_blank"
    >
      <v-icon icon="mdi-github" size="24" />
    </a>
    <div
      class="text-caption text-disabled"
      style="position: absolute; right: 16px"
    >
      &copy; 2022-{{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block">wgzhao </span>
    </div>
  </v-footer>
</template>
<script setup lang="ts"></script>
