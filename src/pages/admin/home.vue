<template>
  <v-card class="mx-auto text-center" color="green" max-width="800" dark>
    <v-card-text>
      <v-sheet>
        <v-sparkline :model-value="QueryByDate.value" :labels="QueryByDate.labels" line-width="1" padding="0" min="0"
          smooth>
        </v-sparkline>
      </v-sheet>
    </v-card-text>

    <v-card-text>
      <div class="text-h4 font-weight-thin">
        Query(s) Last 1 week
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Statistic from '@/services/statistic'
const QueryByDate = ref({
  labels: [],
  value: [],
  datasets: [
    { data: [] }
  ]
})

onMounted(() => {
  Statistic.byDate().then((res) => {
    res.data.forEach((item: Map<string, number>) => {
      QueryByDate.value.labels.push(item.d)
      QueryByDate.value.value.push(item.num)
      // QueryByDate.value.datasets[0].data.push(item.num)
    })
    console.log(QueryByDate.value)
  }
  )
})
</script>
