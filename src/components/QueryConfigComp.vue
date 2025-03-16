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
</style>
