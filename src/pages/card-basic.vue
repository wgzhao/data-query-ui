<script setup lang="ts">
import CardBasic from '@/views/pages/cards/card-basic/CardBasic.vue'
import CardNavigation from '@/views/pages/cards/card-basic/CardNavigation.vue'
import CardSolid from '@/views/pages/cards/card-basic/CardSolid.vue'
</script>

<template>
  variant card from ./src/pages/card-basic.vue
  <div>
    <p class="text-2xl mb-6">Basic Cards</p>

    <CardBasic />

    <p class="text-2xl mb-6 mt-14">Navigation Cards</p>

    <CardNavigation />

    <p class="text-2xl mt-14 mb-6">Solid Cards</p>

    <CardSolid />
  </div>
</template>
