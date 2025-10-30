<template>
  <v-container fluid class="pa-4">
    <v-card flat class="mb-6">
      <v-card-text>
        <v-row dense align="center" class="mb-2">
          <v-col cols="auto">
            <v-toolbar-title class="text-h5 font-weight-bold"
              >查询配置</v-toolbar-title
            >
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
          以下为当前的查询配置列表，您可以查看、编辑、删除或管理缓存。
        </div>
      </v-card-text>
    </v-card>

    <v-card flat>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :search="search"
          :items="data"
          density="compact"
          class="elevation-1"
          :items-per-page="10"
          :loading="loading"
          :expanded="expanded"
          item-value="selectId"
          striped
          show-expand
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
                style="max-width: 300px"
              />
            </v-toolbar>
          </template>

          <template v-slot:item.dataSource="{ item }">
            <a
              href="#"
              class="text-decoration-none text-primary"
              @click.prevent="viewDataSource(item.dataSource)"
            >
              {{ item.dataSource }}
              <v-icon size="small" class="ml-1">mdi-eye</v-icon>
            </a>
          </template>

          <template v-slot:item.enableCache="{ item }">
            <v-icon :color="item.enableCache ? 'success' : 'error'">
              {{ item.enableCache ? "mdi-check-circle" : "mdi-close-circle" }}
            </v-icon>
          </template>

          <template v-slot:item.enabled="{ item }">
            <v-icon :color="item.enabled ? 'success' : 'error'">
              {{ item.enabled ? "mdi-check-circle" : "mdi-close-circle" }}
            </v-icon>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex gap-1 justify-center">
              <v-btn
                size="x-small"
                color="primary"
                variant="text"
                icon
                @click="editItem(item)"
                title="编辑"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                size="x-small"
                color="error"
                variant="text"
                icon
                @click="deleteItem(item.selectId)"
                title="删除"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn
                size="x-small"
                color="warning"
                variant="text"
                icon
                @click="deleteCache(item.selectId)"
                title="删除缓存"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </div>
          </template>

          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length" class="pa-4">
                <highlightjs language="sql" :code="item.querySql" />
              </td>
            </tr>
          </template>

          <template v-slot:no-data>
            <v-alert type="info" class="mt-2">暂无查询配置数据</v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- 对话框组件 -->
    <v-dialog v-model="dialog" max-width="1200px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between pt-4 px-4">
          {{ currentItem ? "编辑查询配置" : "新增查询配置" }}
          <v-btn icon @click="closeDialog" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <QueryConfigComp
            :config-data="currentItem"
            @saved="onSaved"
            @cancel="closeDialog"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 数据源查看对话框 -->
    <v-dialog v-model="dataSourceDialog" max-width="1200px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between pt-4 px-4">
          查看数据源详情
          <v-btn icon @click="closeDataSourceDialog" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <DataSourceComp
            :data-source="dataSourceItem"
            :view-only="true"
            @cancel="closeDataSourceDialog"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import queryConfigService from "@/services/query-configs";
import DataSourcesService from "@/services/data-sources";
import { QueryConfig, DataSource } from "@/types";
import QueryConfigComp from "@/components/QueryConfigComp.vue";
import DataSourceComp from "@/components/DataSource.vue";

// 移除 tableKey
const data = ref<QueryConfig[]>([]);
const expanded = ref([]);
const headers = ref([
  { title: "查询ID", key: "selectId", width: "18%" },
  { title: "数据源", key: "dataSource", width: "15%" },
  { title: "启用缓存", key: "enableCache", width: "8%", align: "center" },
  { title: "缓存时间(s)", key: "cacheTime", width: "10%" },
  { title: "启用", key: "enabled", width: "8%", align: "center" },
  { title: "创建时间", key: "createdAt", width: "12%" },
  { title: "修改时间", key: "updatedAt", width: "12%" },
  { title: "备注", key: "note", width: "10%" },
  {
    title: "操作",
    key: "actions",
    sortable: false,
    width: "7%",
    align: "center"
  }
]);
const search = ref("");
const loading = ref(false);
const dialog = ref(false);
const currentItem = ref<QueryConfig | null>(null);

const addItem = () => {
  currentItem.value = null;
  dialog.value = true;
};

const editItem = (item: QueryConfig) => {
  currentItem.value = { ...item };
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  currentItem.value = null;
};

const onSaved = () => {
  loadData();
  closeDialog();
};

const deleteItem = (id: string) => {
  if (confirm("确认删除？")) {
    loading.value = true;
    queryConfigService
      .remove(id)
      .then(() => {
        data.value = data.value.filter(item => item.selectId !== id);
      })
      .catch(err => {
        alert(`删除失败: ${err.message}`);
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const deleteCache = (id: string) => {
  loading.value = true;
  queryConfigService
    .deleteCache(id)
    .then(res => {
      alert(`缓存已删除, 删除数量: ${res}`);
    })
    .catch(err => {
      alert(`删除缓存失败: ${err.message}`);
    })
    .finally(() => {
      loading.value = false;
    });
};

const loadData = () => {
  loading.value = true;
  queryConfigService
    .list()
    .then(res => {
      // 直接更新数据，Vue 会根据 item-value="selectId" 识别唯一键
      data.value = res;
    })
    .catch(err => {
      console.error("Error fetching query configs:", err);
      alert(`加载查询配置失败: ${err.message}`);
    })
    .finally(() => {
      loading.value = false;
    });
};

// 数据源查看相关
const dataSourceDialog = ref(false);
const dataSourceItem = ref<DataSource | null>(null);

const viewDataSource = async (sourceId: string) => {
  try {
    loading.value = true;
    // 修复：确保从服务器获取完整的数据源对象
    const source = await DataSourcesService.get(sourceId);
    if (source && typeof source === "object") {
      dataSourceItem.value = source;
      dataSourceDialog.value = true;
    } else {
      alert(`数据源信息无效: ${sourceId}`);
    }
  } catch (err) {
    console.error("Error fetching data source:", err);
    alert(`加载数据源失败: ${err.message}`);
  } finally {
    loading.value = false;
  }
};

const closeDataSourceDialog = () => {
  dataSourceDialog.value = false;
  dataSourceItem.value = null;
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.gap-1 {
  gap: 4px;
}
</style>
