<template>
  <div>
    <ToastInfo :toast="toastCtl" />
    <v-container fluid class="pa-4">
      <v-card flat class="mb-6" rounded="lg">
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
                  v-model="formData.no"
                  label="编号"
                  density="compact"
                  variant="outlined"
                  required
                  spellcheck="false"
                  :disabled="isEditing || viewOnly"
                />
                <v-text-field
                  :rules="[rules.required]"
                  v-model="formData.name"
                  label="名称"
                  density="compact"
                  variant="outlined"
                  required
                  spellcheck="false"
                  :disabled="viewOnly"
                />
                <v-text-field
                  :rules="[rules.required, rules.validJdbcUrl]"
                  v-model="formData.url"
                  label="JDBC 地址"
                  density="compact"
                  variant="outlined"
                  required
                  spellcheck="false"
                  :append-inner-icon="connFlag"
                  :disabled="viewOnly"
                />
              </v-col>

              <!-- 右侧列：认证和驱动 -->
              <v-col cols="12" md="6">
                <v-text-field
                  :rules="[rules.required]"
                  v-model="formData.username"
                  label="用户名"
                  density="compact"
                  variant="outlined"
                  required
                  spellcheck="false"
                  :disabled="viewOnly"
                />
                <v-text-field
                  v-model="formData.password"
                  label="密码"
                  density="compact"
                  variant="outlined"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  :disabled="viewOnly"
                />
                <v-select
                  :rules="[rules.required]"
                  v-model="formData.driver"
                  label="驱动类"
                  :items="drivers"
                  density="compact"
                  variant="outlined"
                  required
                  :disabled="viewOnly"
                />
              </v-col>
            </v-row>

            <!-- 统一的按钮区域 -->
            <v-row class="mt-4">
              <v-col cols="12">
                <div class="d-flex justify-space-between align-center">
                  <v-btn
                    v-if="!viewOnly"
                    color="primary"
                    variant="text"
                    size="small"
                    prepend-icon="mdi-connection"
                    @click="testConn"
                    :loading="testingConnection"
                  >
                    测试连接
                  </v-btn>
                  <div v-else></div>

                  <div class="d-flex gap-3">
                    <v-btn
                      color="secondary"
                      variant="outlined"
                      size="small"
                      prepend-icon="mdi-close"
                      @click="cancel"
                    >
                      {{ viewOnly ? "关闭" : "取消" }}
                    </v-btn>
                    <v-btn
                      v-if="!viewOnly"
                      type="submit"
                      :disabled="!valid"
                      color="primary"
                      variant="elevated"
                      size="small"
                      prepend-icon="mdi-content-save"
                      :loading="loading"
                    >
                      保存
                    </v-btn>
                  </div>
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
import { ref, onMounted, computed, watch } from "vue";
import DataSourcesService from "@/services/data-sources";
import { DataSource, type Toast } from "@/types";
import ToastInfo from "@/components/ToastInfo.vue";

const props = defineProps({
  dataSource: {
    type: Object as () => DataSource | null,
    default: null
  },
  viewOnly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["saved", "cancel"]);

const defaultFormData = {
  no: "",
  name: "",
  url: "",
  username: "",
  password: "",
  driver: "com.mysql.cj.jdbc.Driver"
};

const formData = ref<DataSource>({ ...defaultFormData } as DataSource);
const connFlag = ref<string>();
const valid = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const loading = ref(false);
const form = ref(null);
const isEditing = computed(() => !!props.dataSource);

const drivers = ref<string[]>([
  "com.mysql.jdbc.Driver",
  "com.mysql.cj.jdbc.Driver",
  "org.postgresql.Driver",
  "oracle.jdbc.OracleDriver",
  "io.trino.jdbc.TrinoDriver",
  "com.clickhouse.jdbc.ClickHouseDriver",
  "io.prestosql.jdbc.PrestoDriver",
  "com.microsoft.sqlserver.jdbc.SQLServerDriver",
  "org.apache.hive.jdbc.Hive2Driver"
]);

const rules = ref({
  required: (value: any) => !!value || "Field is required",
  validJdbcUrl: (value: string) =>
    value.startsWith("jdbc:") || "URL must start with jdbc:",
  checkNo: async (value: string) => {
    if (!value) return "Field is required";
    if (!isEditing.value && (await DataSourcesService.exists(value))) {
      return "编号已存在";
    }
    return true;
  }
});

const toastCtl = ref<Toast>({
  showToast: false,
  msg: "",
  color: ""
});

const setToast = (msg: string, isError: boolean = true) => {
  toastCtl.value = {
    color: isError ? "error" : "success",
    showToast: true,
    msg
  };
};

const testingConnection = ref(false); // 新增变量用于测试连接的加载状态

const testConn = async () => {
  if (!formData.value.url) {
    setToast("JDBC 地址不能为空", true);
    return;
  }
  testingConnection.value = true; // 使用专门的测试连接加载状态
  try {
    const res = await DataSourcesService.testConnection(formData.value);
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
    testingConnection.value = false; // 恢复测试连接加载状态
  }
};

const save = async () => {
  if (!form.value?.validate()) {
    setToast("请检查输入", true);
    return;
  }
  loading.value = true;
  try {
    DataSourcesService.save(formData.value).then(res => {
      setToast("保存成功！", false);
      setTimeout(() => {
        emit("saved");
      }, 1000);
    });
  } catch (err) {
    setToast(`保存失败: ${err.message}`, true);
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  emit("cancel");
};

// 监听外部传入的数据源变化
watch(
  () => props.dataSource,
  newVal => {
    if (newVal) {
      formData.value = { ...newVal };
    } else {
      formData.value = { ...defaultFormData } as DataSource;
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.dataSource) {
    formData.value = { ...props.dataSource };
  }
});
</script>

<style scoped>
.form-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 新增样式，确保按钮区域的美观性 */
.gap-3 {
  gap: 12px;
}
</style>
