<template>
  <div>
    <v-snackbar
      v-model="toastCtl.showToast"
      multi-line
      location="top"
      :color="toastCtl.color"
    >
      {{ toastCtl.msg }}
    </v-snackbar>
  </div>
  <v-card class="p-2">
    <v-card-title>
      <span v-if="route.params.id == 'new'">新增查询</span>
      <span v-else>编辑查询</span>
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" fast-fail @submit.prevent="save">
        <v-row
          justify="space-evenly"
          align="start"
          align-content="center"
          dense
        >
          <v-col align-self="center">
            <v-checkbox label="是否启用" v-model="form.enabled"></v-checkbox>
          </v-col>
          <v-col align-self="center">
            <v-text-field
              id="selectId"
              label="查询ID"
              :rules="[rules.required]"
              v-model="form.selectId"
              required
              small
            ></v-text-field>
          </v-col>

          <v-col>
            <v-select
              id="dataSource"
              label="数据源"
              v-model="form.dataSource"
              :items="dbsources"
              item-title="name"
              item-value="no"
              single-line
              :rules="[rules.required]"
              required
            >
            </v-select>
          </v-col>
          <v-col align-self="center">
            <v-checkbox
              label="启用缓存"
              v-model="form.enableCache"
            ></v-checkbox>
          </v-col>

          <v-col>
            <v-text-field
              label="缓存时间(秒)"
              v-model="form.cacheTime"
              required
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-text-field
              label="备注"
              id="note"
              v-model="form.note"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" align-self="center">
            <v-label for="querySql">查询语句</v-label>
          </v-col>
          <v-col cols="11">
            <!-- <v-textarea
              :rules="[rules.required]"
              label="查询语句"
              v-model="form.querySql"
              required
              rows="5"
              :error-messages="sqlError"
            >
            </v-textarea> -->
            <codemirror
              v-model="form.querySql"
              placeholder="Code goes here..."
              :style="{ height: '400px' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="extensions"
            />
          </v-col>
          <v-col cols="12" class="d-flex gap-4">
            <v-btn type="submit" :disabled="!valid" color="primary">提交</v-btn>
            <v-btn
              type="button"
              color="secondary"
              variant="outlined"
              @click="$router.go(-1)"
              >返回</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import QueryConfigService from "@/services/queryconfig";
import { useRoute, useRouter } from "vue-router";
import { Codemirror } from "vue-codemirror";
import { sql } from "@codemirror/lang-sql";

const route = useRoute();
const router = useRouter();
const valid = ref(false);
const rules = ref({
  required: (value: any) => !!value || "Field is required"
});

const form = ref({
  selectId: "",
  dataSource: "",
  enableCache: true,
  cacheTime: 600,
  querySql: "",
  enabled: true,
  note: ""
});

const toastCtl = ref({
  showToast: false,
  msg: "",
  color: ""
});

const extensions = [sql()];

const setToast = (msg: str, isError: boolean = true) => {
  toastCtl.value = {
    color: isError ? "error" : "success",
    showToast: true,
    msg: msg
  };
};

const dbsources = ref([]);

const sqlError = ref("");

const save = () => {
  if (
    route.params.id === "new" &&
    QueryConfigService.exists(form.value.selectId)
  ) {
    setToast("查询ID已存在", true);
    return;
  }
  QueryConfigService.save(form.value).then(res => {
    alert("保存成功");
    router.push("/admin/query_configs");
    // setTimeout(() => {
    //   router.push("/admin/query_configs");
    // }, 1000);
  });
};

onMounted(async () => {
  QueryConfigService.getDbSources().then(res => {
    dbsources.value = res;
  });
  if (route.params.id === "new") return;
  QueryConfigService.get(route.params.id).then(res => {
    form.value = res;
  });
});
</script>
<style scoped>
pre {
  white-space: pre;
}

textarea {
  height: 240px !important;
}
</style>
