<template>
  <div>
    <ToastInfo :toast="toastCtl" />
    <v-container fluid class="pa-4">
      <v-card flat class="mb-6" rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          数据源
          <v-btn
            icon
            size="small"
            variant="outlined"
            color="secondary"
            @click="$router.go(-1)"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            fast-fail
            @submit.prevent="save"
            class="form-container"
          >
            <v-row dense>
              <!-- 左侧列：基本信息 -->
              <v-col cols="12" md="6">
                <v-text-field
                  :rules="[rules.required, rules.checkNo]"
                  v-model="data.no"
                  label="编号"
                  density="compact"
                  variant="outlined"
                  required
                  spellcheck="false"
                />
                <v-text-field
                  :rules="[rules.required]"
                  v-model="data.name"
                  label="名称"
                  density="compact"
                  variant="outlined"
                  required
                  spellcheck="false"
                />
                <v-text-field
                  :rules="[rules.required, rules.validJdbcUrl]"
                  v-model="data.url"
                  label="JDBC 地址"
                  density="compact"
                  variant="outlined"
                  required
                  spellcheck="false"
                  :append-inner-icon="connFlag"
                />
                <v-btn
                  color="primary"
                  variant="text"
                  size="small"
                  class="mt-2"
                  @click="testConn"
                >
                  测试连接
                </v-btn>
              </v-col>

              <!-- 右侧列：认证和驱动 -->
              <v-col cols="12" md="6">
                <v-text-field
                  :rules="[rules.required]"
                  v-model="data.username"
                  label="用户名"
                  density="compact"
                  variant="outlined"
                  required
                  spellcheck="false"
                />
                <v-text-field
                  v-model="data.password"
                  label="密码"
                  density="compact"
                  variant="outlined"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                />
                <v-select
                  :rules="[rules.required]"
                  v-model="data.driver"
                  label="驱动类"
                  :items="drivers"
                  density="compact"
                  variant="outlined"
                  required
                />

                <!-- 按钮区域 -->
                <div class="d-flex justify-space-between mt-4">
                  <v-btn
                    type="reset"
                    color="secondary"
                    variant="outlined"
                    size="large"
                    @click="$router.go(-1)"
                  >
                    取消
                  </v-btn>
                  <v-btn
                    type="submit"
                    :disabled="!valid"
                    color="primary"
                    variant="elevated"
                    size="large"
                  >
                    保存
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DataSourcesService from "@/services/datasources";
import { DataSource, type Toast } from "@/types";
import { useRouter, useRoute } from "vue-router";
import ToastInfo from "@/components/ToastInfo.vue";

const data = ref<DataSource>({
  no: "",
  name: "",
  url: "",
  username: "",
  password: "",
  driver: "",
} as DataSource);
const route = useRoute();
const router = useRouter();
const connFlag = ref<string>();
const valid = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const loading = ref(false); // 添加加载状态
const form = ref(null); // 表单引用

const drivers = ref<string[]>([
  "com.mysql.jdbc.Driver",
  "com.mysql.cj.jdbc.Driver",
  "org.postgresql.Driver", // 修正拼写错误
  "oracle.jdbc.OracleDriver",
  "io.trino.jdbc.TrinoDriver",
  "com.clickhouse.jdbc.ClickHouseDriver",
  "io.prestosql.jdbc.PrestoDriver",
  "com.microsoft.sqlserver.jdbc.SQLServerDriver",
  "org.apache.hive.jdbc.Hive2Driver",
]);

const rules = ref({
  required: (value: any) => !!value || "Field is required",
  validJdbcUrl: (value: string) =>
    value.startsWith("jdbc:") || "URL must start with jdbc:",
  checkNo: async (value: string) => {
    if (!value) return "Field is required";
    if (route.params.id === "new" && (await DataSourcesService.exists(value))) {
      return "编号已存在";
    }
    return true;
  },
});

const toastCtl = ref<Toast>({
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

const testConn = async () => {
  if (!data.value.url) {
    setToast("JDBC 地址不能为空", true);
    return;
  }
  loading.value = true;
  try {
    const res = await DataSourcesService.testConnection(data.value);
    if (res.code !== 200) {
      connFlag.value = "mdi-close";
      setToast(res.message, true);
    } else {
      connFlag.value = "mdi-check";
      setToast("连接成功", false);
    }
  } catch (err) {
    connFlag.value = "mdi-close";
    setToast(`连接失败: ${err.message}`, true);
  } finally {
    loading.value = false;
  }
};

const save = async () => {
  if (!form.value?.validate()) {
    setToast("请检查输入", true);
    return;
  }
  loading.value = true;
  try {
    const res = await DataSourcesService.save(data.value);
    if (res.code === 201) {
      setToast("保存成功", false);
      setTimeout(() => {
        router.push("/admin/data_sources");
      }, 1000);
    } else {
      setToast(`保存失败: ${res.message}`, true);
    }
  } catch (err) {
    setToast(`保存失败: ${err.message}`, true);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    if (route.params.id === "new") {
      console.log("创建新数据源");
    } else {
      const res = await DataSourcesService.get(route.params.id);
      data.value = res;
    }
  } catch (err) {
    setToast(`加载数据失败: ${err.message}`, true);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.form-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
