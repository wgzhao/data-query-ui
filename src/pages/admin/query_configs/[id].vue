<template>
  <v-row>
    <v-col cols="6">
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
            <v-text-field label="缓存时间" v-model="form.cacheTime" required></v-text-field>
            <v-textarea :rules="[rules.required]" label="查询语句"
              v-model="form.querySql" required rows="5"
              :error-messages="sqlError"
              ></v-textarea><v-btn type="button" class="btn btn-primary" @click="extractParams(form.querySql)">提取参数</v-btn>

            <v-checkbox label="是否启用" v-model="form.isEnable"></v-checkbox>
            <v-text-field label="备注" v-model="form.note" required></v-text-field>
            <v-btn type="submit" :disabled="!valid" color="primary">提交</v-btn>
          </v-form>
        </v-sheet>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card flat title="当前查询参数">
        <v-btn type="button" class="btn btn-primary" @click="dialog=true">新增参数</v-btn>
        <v-data-table-virtual
          height="400"
          :headers="paramHeader"
          :items="params"
          :items-per-page="5"
          class="elevation-1">
          <template v-slot:top>
          <!-- edit/new form -->
          <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                  <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                      <v-text-field :rules="[rules.required]" v-model="paramForm.paramName" label="参数名称" required></v-text-field>
                      <v-select label="参数类型"
                        v-model="paramForm.paramType"
                        :items="['string','int','long','float','double','date','datetime','boolean']"
                        single-line
                        :rules="[rules.required]"
                        required>
                        </v-select>
                      <!-- <v-text-field :rules="[rules.required]" v-model="paramForm.paramType" label="参数类型" required></v-text-field> -->
                      <v-checkbox v-model="paramForm.isRequired" label="是否必须"></v-checkbox>
                  </v-card-text>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue-darken-1" variant="text" @click="close">
                          Cancel
                      </v-btn>
                      <v-btn color="blue-darken-1" variant="text" @click="saveParam">
                          Save
                      </v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
        </v-data-table-virtual>

      </v-card>
    </v-col>
  </v-row>

</template>
<script setup>
import {ref, onMounted} from 'vue'
import QueryConfigService from '@/services/queryconfig'
import { useRouter, useRoute } from 'vue-router'
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
  querySql: "select * from odsuf.branch where logdate=${logdate} and branchid=${branchid}",
  isEnable: true,
  note: ""
})

const params = ref([])
const paramHeader = ref([
  { title: '参数名称', value: 'paramName' },
  { title: '参数类型', value: 'paramType' },
  { title: '是否必须', value: 'isRequired' },
  { title: "Action", value: "action", sortable: false },
])

const paramForm = ref({
  paramName: "",
  paramType: "",
  isRequired: false,
})
const dialog = ref(false)
const dbsources = ref([])
const formTitle = ref('新增参数')
const sqlError = ref("")

const extractParams = (sql) => {
  // 自动从 SQL 里解析参数，并填充到 params 里
  // first, clear current params
  params.value = []
  const sqlParams = parserSql(sql)
  sqlParams.forEach(param=>{
    const p = params.value.find(p=>p.paramName === param)
    if (!p) {
      params.value.push({
        paramName: param,
        paramType: "string",
        isRequired: false,
      })
    }
  })
}
const editItem = (item) => {
  formTitle.value = "编辑参数"
  dialog.value = true
  paramForm.value = item
}
const deleteItem = (item) => {
  const index = params.value.indexOf(item)
  if (index > -1) {
    params.value.splice(index, 1)
  }
}

const save = () => {
  const sqlParams = parserSql(form.value.querySql)
  let valid = true;
  let result = "SQL中的参数 "
  sqlParams.forEach(param=>{
    const p = params.value.find(p=>p.paramName === param)

    if (!p) {
      valid = false
      result += `${param}, `
      // alert(`SQL中的参数 ${param} 在参数列表中不存在`)
      // return
    }
  })
  result += " 在参数列表中不存在"
  if (! valid) {
    sqlError.value = result
    return
  }
  // save query_config and query_params

  QueryConfigService.save(form.value).then(res => {
    const selectId = form.value.selectId
    params.value.forEach(param=>{
      param.selectId = selectId
    })
    QueryConfigService.saveParams(params.value).then(res=>{
      alert("保存成功")
    })
  })
}

const parserSql = (sql) => {
  // parser sql , extract all params with ${} format
  // return params
  const pattern = /\$\{(.*?)\}/gm
  const params = []
  let m;
  while ((m = pattern.exec(sql)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    params.push(m[1])
    if (m.index === pattern.lastIndex) {
      pattern.lastIndex++;
    }
  }
  return params;
}

const close = () => {
  dialog.value = false
}
const saveParam = () => {
  params.value = params.value.filter(p=>p.paramName !== paramForm.value.paramName)
  params.value.push(paramForm.value)
  dialog.value = false
  sqlError.value = ""
  paramForm.value = {
    paramName: "",
    paramType: "",
    isRequired: false,
  }
}
onMounted(async ()=>{
  QueryConfigService.get(route.params.id).then(res => {form.value = res.data});
  QueryConfigService.getParams(route.params.id).then(res => {params.value = res.data});
  QueryConfigService.getDbSources().then(res=>{
    dbsources.value = res.data
  })
})
</script>
