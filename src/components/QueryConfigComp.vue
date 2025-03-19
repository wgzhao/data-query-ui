<template>
  <div>
    <ToastInfo :toast="toastCtl" />
    <v-container fluid class="pa-4">
      <v-card flat class="mb-4">
        <v-card-text>
          <v-form
            ref="formRef"
            v-model="valid"
            fast-fail
            @submit.prevent="save"
            class="form-container"
          >
            <v-row dense>
              <!-- 左侧列：基本信息 -->
              <v-col cols="12" md="6">
                <v-text-field
                  :rules="[rules.required, rules.checkId]"
                  label="查询ID"
                  v-model="form.selectId"
                  density="compact"
                  variant="outlined"
                  required
                  :disabled="isEditing"
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

            <!-- 统一的按钮区域 -->
            <v-row class="mt-4">
              <v-col cols="12">
                <div class="d-flex justify-space-between align-center">
                  <div></div> <!-- 左侧占位，保持对称 -->

                  <div class="d-flex gap-3">
                    <v-btn
                      color="secondary"
                      variant="outlined"
                      size="small"
                      prepend-icon="mdi-close"
                      @click="cancel"
                    >
                      取消
                    </v-btn>
                    <v-btn
                      color="info"
                      variant="outlined"
                      size="small"
                      prepend-icon="mdi-play"
                      @click="testQuery"
                      :disabled="!form.querySql || !form.dataSource"
                    >
                      测试查询
                    </v-btn>
                    <v-btn
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

    <!-- 测试查询变量输入对话框 -->
    <v-dialog v-model="showVariableDialog" max-width="500px">
      <v-card>
        <v-card-title>请输入查询变量值</v-card-title>
        <v-card-text>
          <v-form ref="variableFormRef">
            <v-row v-for="(variable, index) in queryVariables" :key="index">
              <v-col cols="12">
                <v-text-field
                  :label="`${variable} 的值`"
                  v-model="variableValues[variable]"
                  density="compact"
                  variant="outlined"
                  required
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="outlined" @click="showVariableDialog = false">取消</v-btn>
          <v-btn color="primary" @click="executeTestQuery" :loading="testLoading">执行测试</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 测试结果对话框 -->
    <v-dialog v-model="showResultDialog" max-width="800px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          测试结果
          <v-chip
            :color="testSuccess ? 'success' : 'error'"
            size="small"
            class="ml-2"
          >
            {{ testSuccess ? '成功' : '失败' }}
          </v-chip>
        </v-card-title>
        <v-card-text>
          <div v-if="testError" class="text-error mb-3">
            <pre>{{ testError }}</pre>
          </div>
          <div v-if="testResult && testResult.length > 0">
            <v-table density="compact">
              <thead>
                <tr>
                  <th v-for="(value, key) in testResult[0]" :key="key">{{ key }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in testResult" :key="index">
                  <td v-for="(value, key) in item" :key="key">{{ value }}</td>
                </tr>
              </tbody>
            </v-table>
            <div class="text-caption text-right mt-2">共 {{ testResult.length }} 行记录</div>
          </div>
          <div v-else-if="testSuccess && (!testResult || testResult.length === 0)" class="text-center py-4">
            查询执行成功，但没有返回数据
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="outlined" @click="showResultDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import QueryConfigService from "@/services/queryconfig";
import { QueryConfig, type Toast } from "@/types";
import ToastInfo from "@/components/ToastInfo.vue";

const props = defineProps({
  configData: {
    type: Object as () => QueryConfig | null,
    default: null
  }
});

const emit = defineEmits(['saved', 'cancel']);

const defaultForm = {
  selectId: "",
  dataSource: "",
  enableCache: true,
  cacheTime: 600,
  querySql: "",
  enabled: true,
  note: ""
};

const valid = ref(false);
const loading = ref(false);
const formRef = ref(null);
const isEditing = computed(() => !!props.configData);

const rules = ref({
  required: (value: any) => !!value || "此字段为必填项",
  checkId: async (value: string) => {
    if (!value) return "此字段为必填项";
    if (!isEditing.value && (await QueryConfigService.exists(value))) {
      return "查询ID已存在";
    }
    return true;
  }
});

const form = ref({...defaultForm});

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

const dbsources = ref([]);
const sqlError = ref("");

const save = async () => {
  if (!formRef.value?.validate()) {
    setToast("请检查输入", true);
    return;
  }

  loading.value = true;
  try {
    const res = await QueryConfigService.save(form.value);
    if (res.code === 201 || res.code === 200) {
      const message = res.code === 201 ? "创建成功" : "更新成功";
      setToast(message, false);
      setTimeout(() => {
        emit('saved');
      }, 1000);
    } else {
      setToast(`操作失败: ${res.message}`, true);
    }
  } catch (error) {
    setToast(`保存失败: ${error.message}`, true);
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  emit('cancel');
};

// 监听外部传入的配置数据变化
watch(() => props.configData, (newVal) => {
  if (newVal) {
    form.value = { ...newVal };
  } else {
    form.value = { ...defaultForm };
  }
}, { immediate: true });

onMounted(async () => {
  try {
    const dbSources = await QueryConfigService.getDbSources();
    dbsources.value = dbSources;

    if (props.configData) {
      form.value = { ...props.configData };
    }
  } catch (error) {
    setToast(`加载数据失败: ${error.message}`, true);
  }
});

const showVariableDialog = ref(false);
const showResultDialog = ref(false);
const queryVariables = ref<string[]>([]);
const variableValues = ref<Record<string, string>>({});
const variableFormRef = ref(null);
const testLoading = ref(false);
const testResult = ref<any[]>([]);
const testSuccess = ref(false);
const testError = ref("");

// 提取SQL中的变量
const extractVariables = (sql: string): string[] => {
  const regex = /\${([^}]+)}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(sql)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }

  return variables;
};

// 替换SQL中的变量
const replaceVariables = (sql: string, values: Record<string, string>): string => {
  let result = sql;
  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
    result = result.replace(regex, value);
  });
  return result;
};

// 测试查询
const testQuery = () => {
  if (!form.value.querySql || !form.value.dataSource) {
    setToast('请先填写查询语句和选择数据源', true);
    return;
  }

  const vars = extractVariables(form.value.querySql);
  queryVariables.value = vars;

  if (vars.length > 0) {
    // 重置变量值
    variableValues.value = {};
    vars.forEach(variable => {
      variableValues.value[variable] = '';
    });
    showVariableDialog.value = true;
  } else {
    // 没有变量，直接执行测试
    executeTestQuery();
  }
};

// 执行测试查询
const executeTestQuery = async () => {
  if (queryVariables.value.length > 0) {
    // 检查变量值是否都已输入
    if (!variableFormRef.value?.validate()) {
      return;
    }
    showVariableDialog.value = false;
  }

  testLoading.value = true;
  testError.value = "";
  testResult.value = [];
  testSuccess.value = false;

  try {
    let finalSql = form.value.querySql;
    if (queryVariables.value.length > 0) {
      finalSql = replaceVariables(finalSql, variableValues.value);
    }

    // 调用后端测试API
    const res = await QueryConfigService.testQuery(
      form.value.dataSource,
      finalSql
    );

    if (res.status === 200) {
      testSuccess.value = true;
      testResult.value = res.data.result || [];
    } else {
      testError.value = res.message || '测试失败';
    }
  } catch (error) {
    testError.value = `执行测试查询出错: ${error.message}`;
  } finally {
    testLoading.value = false;
    showResultDialog.value = true;
  }
};
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

/* 确保按钮区域的美观性 */
.gap-3 {
  gap: 12px;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}
</style>
