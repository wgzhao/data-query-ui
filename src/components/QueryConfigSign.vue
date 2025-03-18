<template>
  <v-card>
    <v-card-title>关联查询配置</v-card-title>
    <v-card-text>
      <div v-if="loadingQueryConfigs" class="d-flex justify-center my-5">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else>
        <div class="mb-4 d-flex align-center">
          <v-text-field v-model="queryConfigSearch" label="搜索查询配置" density="compact" hide-details variant="outlined"
            clearable prepend-inner-icon="mdi-magnify" class="mb-2" />
        </div>

        <v-alert v-if="queryConfigsError" type="error" density="compact" variant="tonal" class="mb-3">
          {{ queryConfigsError }}
        </v-alert>

        <v-data-table v-model="selectedQueryConfigs" :headers="queryConfigHeaders" :items="allQueryConfigs"
          :search="queryConfigSearch" item-value="selectId" density="compact" class="elevation-1" show-select return-object>
          <template v-slot:item.note="{ item }">
            <div class="text-truncate" style="max-width: 200px;" :title="item.note">
              {{ item.note }}
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="secondary" variant="text">
        取消
      </v-btn>
      <v-btn color="primary" variant="text" @click="saveQueryConfigRelations" :loading="savingRelations"
        :disabled="loadingQueryConfigs || savingRelations">
        保存
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import SignService from "@/services/sign";
import QueryConfigService from "@/services/queryconfig";
import type { QueryConfig } from "@/types";

const props = defineProps<{
  appId: string;
}>();

const relations = ref([]);
const queryConfigSearch = ref("");
const loadingQueryConfigs = ref(false);
const savingRelations = ref(false);
const queryConfigsError = ref("");
const allQueryConfigs = ref<QueryConfig[]>([]);
const selectedQueryConfigs = ref<QueryConfig[]>([]);

const queryConfigHeaders = ref([
  { title: "selectId", key: "selectId", width: "15%" },
  { title: "描述", key: "note", width: "55%" },
]);

function getQueryConfigSignByAppId(appId: string) {
  loadingQueryConfigs.value = true;
  try {
    // 获取当前签名已关联的查询配置
    SignService.getSignQueryRelations(appId).then(res => {
      console.log("res", res);
      relations.value = res;

      // 拿到relations数据后，更新选中的查询配置
      updateSelectedConfigs();
    })
  } catch (err: any) {
    queryConfigsError.value = `加载数据失败: ${err.message}`;
    console.error("Error loading query configs:", err);
  } finally {
    // 注意：这里可能过早结束loading状态，因为异步请求可能尚未完成
  }
}

// 新增：更新选中的配置项函数
function updateSelectedConfigs() {
  if (relations.value.length && allQueryConfigs.value.length) {
    const relatedIds = relations.value.map(item => item.selectId);
    selectedQueryConfigs.value = allQueryConfigs.value.filter(config =>
      relatedIds.includes(config.selectId)
    );
    console.log("已自动选择匹配的查询配置", selectedQueryConfigs.value);
  }
}

const saveQueryConfigRelations = async () => {
  savingRelations.value = true;
  queryConfigsError.value = "";

  try {
    const queryConfigIds = selectedQueryConfigs.value.map(item => item.selectId);
    console.log("queryConfigIds", queryConfigIds);
    await SignService.updateSignQueryRelations(props.appId, queryConfigIds);
    alert("关联关系已更新");
  } catch (err: any) {
    queryConfigsError.value = `保存失败: ${err.message}`;
    console.error("Error saving query config relations:", err);
  } finally {
    savingRelations.value = false;
  }
};

onMounted(() => {
  getQueryConfigSignByAppId(props.appId);

  QueryConfigService.list().then(res => {
    allQueryConfigs.value = res;
    // 获取查询配置后也要尝试更新选中项
    updateSelectedConfigs();
  }).finally(() => {
    loadingQueryConfigs.value = false;
  });

});

</script>
