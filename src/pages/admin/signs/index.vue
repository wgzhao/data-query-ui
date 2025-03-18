<template>
  <v-container fluid class="pa-4">
    <v-card flat class="mb-6">
      <v-card-text>
        <v-row dense align="center" class="mb-2">
          <v-col cols="auto">
            <v-toolbar-title class="text-h5 font-weight-bold">签名</v-toolbar-title>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn
              size="small"
              color="primary"
              variant="outlined"
              prepend-icon="mdi-plus"
              @click="addItem"
            >
              新增
            </v-btn>
          </v-col>
        </v-row>
        <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
          以下为当前的签名列表，您可以查看、编辑、启用/禁用或删除签名。
        </div>
      </v-card-text>
    </v-card>

    <v-card flat>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="signs"
          :search="search"
          density="compact"
          class="elevation-1"
          :items-per-page="10"
          :loading="loading"
        >
          <template v-slot:top>
            <v-toolbar density="compact" class="mb-2">
              <v-spacer />
              <v-text-field
                v-model="search"
                label="搜索"
                density="compact"
                single-line
                hide-details
                variant="outlined"
                clearable
                prepend-inner-icon="mdi-magnify"
                style="max-width: 300px;"
              />
            </v-toolbar>
          </template>

          <template v-slot:item.enabled="{ item }">
            <v-chip
              :color="item.enabled ? 'success' : 'error'"
              text-color="white"
              size="small"
            >
              {{ item.enabled ? "已启用" : "已禁用" }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center gap-2">
              <v-btn
                size="small"
                color="error"
                variant="text"
                @click="confirmDelete(item.appId)"
              >
                删除
              </v-btn>
              <v-btn
                size="small"
                color="primary"
                variant="text"
                @click="toggle(item.appId)"
              >
                {{ item.enabled ? "禁用" : "启用" }}
              </v-btn>
              <v-btn
                size="small"
                color="info"
                variant="text"
                @click="openQueryConfigsDialog(item.appId)"
              >
                关联查询
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title>确认删除</v-card-title>
        <v-card-text>确定要删除此签名吗？</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" variant="text" @click="confirmDialog = false">
            取消
          </v-btn>
          <v-btn color="primary" variant="text" @click="deleteSign">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 关联查询配置对话框 -->
    <v-dialog v-model="queryConfigsDialog" max-width="700">
      <QueryConfigSign :appId="currentSignAppId" @close="closeQueryConfigDialog" @save="closeQueryConfigDialog" />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SignService from "@/services/sign";
import { Sign } from "@/types";
import { useRoute, useRouter } from "vue-router";
import QueryConfigSign from "@/components/QueryConfigSign.vue";

const router = useRouter();
const route = useRoute();
const search = ref("");
const signs = ref<Sign[]>([]);
const loading = ref(false); // 添加加载状态
const confirmDialog = ref(false); // 确认对话框状态
const itemToDelete = ref<string>(""); // 待删除的 appId
// 查询配置管理相关
const queryConfigsDialog = ref(false);
const currentSignAppId = ref<string>("");


const headers = ref([
  { title: "App Id", value: "appId", width: "20%" },
  { title: "App Secret", value: "appKey", width: "30%" },
  { title: "申请人", value: "applier", width: "20%" },
  { title: "是否启用", value: "enabled", width: "15%" },
  {
    title: "操作",
    value: "actions",
    sortable: false,
    width: "15%",
    align: "center",
  },
]);

const addItem = () => {
  router.push(`${route.name?.toString()}/new`.replace(/\/+/g, "/"));
};

const confirmDelete = (appId: string) => {
  itemToDelete.value = appId;
  confirmDialog.value = true;
};

const deleteSign = () => {
  if (!itemToDelete.value) return;
  loading.value = true;
  SignService.remove(itemToDelete.value)
    .then(() => {
      signs.value = signs.value.filter((sign) => sign.appId !== itemToDelete.value);
      alert("删除成功");
    })
    .catch((err) => {
      alert(`删除失败: ${err.message}`);
    })
    .finally(() => {
      loading.value = false;
      confirmDialog.value = false;
      itemToDelete.value = "";
    });
};

const toggle = (appId: string) => {
  const sign = signs.value.find((sign) => sign.appId === appId);
  if (sign) {
    sign.enabled = !sign.enabled;
    loading.value = true;
    SignService.update(sign.appId, sign)
      .then(() => {
        signs.value = signs.value.map((s) =>
          s.appId === appId ? sign : s
        );
      })
      .catch((err) => {
        alert(`更新失败: ${err.message}`);
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const openQueryConfigsDialog = async (appId: string) => {
  currentSignAppId.value = appId;
  queryConfigsDialog.value = true;
};

// 新增：关闭查询配置对话框的方法
const closeQueryConfigDialog = () => {
  queryConfigsDialog.value = false;
};

onMounted(() => {
  loading.value = true;
  SignService.list()
    .then((res) => {
      signs.value = res;
    })
    .catch((err) => {
      console.error("Error fetching signs:", err);
      alert(`加载签名失败: ${err.message}`);
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>

<style scoped>
.striped-rows ::v-deep .v-data-table__tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.04) !important; /* 浅灰条纹，适配主题 */
}

.striped-rows ::v-deep .v-data-table__tr:nth-child(odd) {
  background-color: transparent !important;
}

/* 暗模式适配 */
@media (prefers-color-scheme: dark) {
  .striped-rows ::v-deep .v-data-table__tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.08) !important; /* 浅白条纹 */
  }
}
</style>
