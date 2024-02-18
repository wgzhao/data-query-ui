<template>
  <v-row>
    <v-col cols="12">
      <v-card flat title="编辑查询">
        <v-sheet class="mx-auto" max-width="800">
          <v-form v-model="valid" fast-fail @submit.prevent="save">
            <v-text-field :rules="[rules.required]" label="查询ID" v-model="form.selectId" required></v-text-field>
            <v-select label="数据源"
              v-model="form.dataSource"
              :items="dbsources"
              item-title="name"
              item-value="no"
              single-line
              :rules="[rules.required]"
              required>
            </v-select>
            <v-checkbox label="是否启用缓存" v-model="form.enableCache"></v-checkbox>
            <v-text-field v-if="form.enableCache" label="缓存时间" v-model="form.cacheTime" required></v-text-field>
            <v-textarea :rules="[rules.required]" label="查询语句"
              v-model="form.querySql" required rows="5"
              :error-messages="sqlError"
              ></v-textarea>
            <v-checkbox label="是否启用" v-model="form.enabled"></v-checkbox>
            <v-text-field label="备注" v-model="form.note" required></v-text-field>
            <v-btn type="submit" :disabled="!valid" color="primary">提交</v-btn>
          </v-form>
        </v-sheet>
      </v-card>
    </v-col>
  </v-row>

</template>
<script setup lang="ts">
import {ref, onMounted} from 'vue'
import QueryConfigService from '@/services/queryconfig'
import {useRoute } from 'vue-router'
const route = useRoute()
const valid=ref(false)
const rules = ref({
        required: value => !!value || 'Field is required',
      })

const form=ref({
  selectId: "",
  dataSource: "",
  enableCache: true,
  cacheTime: 600,
  querySql: "",
  enabled: true,
  note: ""
})


const dbsources = ref([])

const sqlError = ref("")

const save = () => {
  QueryConfigService.save(form.value).then(res => {
    alert("保存成功");
  })
}

onMounted(async ()=>{
  QueryConfigService.getDbSources().then(res=>{
    dbsources.value = res.data
  })
  if (route.params.id === "new") return;
  QueryConfigService.get(route.params.id).then(res => {form.value = res.data});

})

// const parserSql = (sql) => {
//   // parser sql , extract all params with ${} format
//   // return params
//   const pattern = /\$\{(.*?)\}/gm
//   const params = []
//   let m;
//   while ((m = pattern.exec(sql)) !== null) {
//     // This is necessary to avoid infinite loops with zero-width matches
//     params.push(m[1])
//     if (m.index === pattern.lastIndex) {
//       pattern.lastIndex++;
//     }
//   }
//   return params;
// }
</script>
<style scoped>
pre { white-space: pre; }

textarea {
  height: 240px !important;
}
</style>
