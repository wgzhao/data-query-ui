<template>
  <div>
    <v-snackbar
      v-model="toastCtl.showToast"
      multi-line
      location="top"
      :color="toastCtl.color"
      timeout="3000"
    >
      {{ toastCtl.msg }}
    </v-snackbar>
  </div>
  <v-container fluid class="pa-4">
    <v-card flat title="编辑查询" class="mb-4">
      <v-card-text>
        <v-form
          v-model="valid"
          fast-fail
          @submit.prevent="save"
          class="form-container"
        >
          <v-row dense>
            <!-- 左侧列：基本信息 -->
            <v-col cols="12" md="6">
              <v-text-field
                :rules="[rules.required]"
                label="查询ID"
                v-model="form.selectId"
                density="compact"
                variant="outlined"
                required
              />
              <v-select
                label="数据源"
                v-model="form.dataSource"
                :items="dbsources"
                item-title="name"
                item-value="no"
                density="compact"
                variant="outlined"
                :rules="[rules.required]"
                required
              />
              <v-checkbox
                label="是否启用缓存"
                v-model="form.enableCache"
                density="compact"
                hide-details
              />
              <v-text-field
                v-if="form.enableCache"
                label="缓存时间"
                v-model="form.cacheTime"
                density="compact"
                variant="outlined"
                type="number"
                suffix="秒"
                required
              />
            </v-col>

            <!-- 右侧列：查询语句和备注 -->
            <v-col cols="12" md="6">
              <v-textarea
                :rules="[rules.required]"
                label="查询语句"
                v-model="form.querySql"
                density="compact"
                variant="outlined"
                rows="8"
                :error-messages="sqlError"
                auto-grow
              />
              <v-checkbox
                label="是否启用"
                v-model="form.enabled"
                density="compact"
                hide-details
                class="mt-2"
              />
              <v-text-field
                label="备注"
                v-model="form.note"
                density="compact"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <!-- 按钮区域 -->
          <v-row dense class="mt-4">
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                type="submit"
                :disabled="!valid"
                color="primary"
                variant="elevated"
                size="large"
              >
                提交
              </v-btn>
              <v-btn
                type="button"
                color="secondary"
                variant="outlined"
                size="large"
                class="ml-4"
                @click="$router.go(-1)"
              >
                返回
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import QueryConfigService from "@/services/queryconfig";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const valid = ref(false);
const rules = ref({
  required: (value: any) => !!value || "Field is required",
});

const form = ref({
  selectId: "",
  dataSource: "",
  enableCache: true,
  cacheTime: 600,
  querySql: "",
  enabled: true,
  note: "",
});

const toastCtl = ref({
  showToast: false,
  msg: "",
  color: "",
});

const setToast = (msg: string, isError: boolean = true) => {
  toastCtl.value = {
    color: isError ? "error" : "success",
    showToast: true,
    msg,
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
  QueryConfigService.save(form.value)
    .then((res) => {
      setToast("保存成功", false);
      setTimeout(() => {
        router.push("/admin/query_configs");
      }, 1000);
    })
    .catch((error) => {
      setToast(`保存失败: ${error.message}`, true);
    });
};

onMounted(async () => {
  try {
    const dbSources = await QueryConfigService.getDbSources();
    dbsources.value = dbSources;
    if (route.params.id === "new") return;
    const config = await QueryConfigService.get(route.params.id);
    form.value = config;
  } catch (error) {
    setToast(`加载数据失败: ${error.message}`, true);
  }
});
</script>

<style scoped>
.form-container {
  max-width: 1200px;
  margin: 0 auto;
}

.v-textarea.v-text-field--outlined:not(.v-input--dense) .v-input__control {
  min-height: auto !important; /* 覆盖默认高度 */
}

.v-textarea textarea {
  height: auto !important; /* 确保自动增长 */
}
</style>
