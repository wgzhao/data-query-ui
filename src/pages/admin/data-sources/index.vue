<template>
  <v-container fluid class="pa-4">
    <v-card flat class="mb-6">
      <v-card-text>
        <v-row dense align="center" class="mb-2">
          <v-col cols="auto">
            <h3 class="text-subtitle-1 font-weight-bold">数据源</h3>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn
              class="text-none"
              color="primary"
              prepend-icon="mdi-plus"
              rounded="md"
              size="small"
              variant="flat"
              @click="add"
            >
              新增
            </v-btn>
          </v-col>
        </v-row>
        <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
          以下为当前的数据源列表，您可以查看、编辑或删除数据源。
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
          item-value="no"
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

          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center gap-2">
              <v-btn
                class="text-none"
                color="primary"
                size="small"
                variant="text"
                @click="edit(item)"
              >
                编辑
              </v-btn>
              <v-btn
                class="text-none"
                color="primary"
                size="small"
                variant="text"
                @click="remove(item)"
              >
                删除
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- 对话框组件 -->
    <v-dialog v-model="dialog" max-width="1200px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between pt-4 px-4">
          {{ currentItem ? "编辑数据源" : "新增数据源" }}
          <v-btn icon @click="closeDialog" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <DataSourceComp
            :data-source="currentItem"
            @saved="onSaved"
            @cancel="closeDialog"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import DataSourcesService from "@/services/data-sources";
import { DataSource } from "@/types";
import DataSourceComp from "@/components/DataSource.vue";

const router = useRouter();
const route = useRoute();
const search = ref("");
const data = ref<DataSource[]>([]);
const loading = ref(false);
const dialog = ref(false);
const currentItem = ref<DataSource | null>(null);

const headers = ref([
  { title: "编号", value: "no", width: "10%" },
  { title: "名称", value: "name", width: "15%" },
  { title: "地址", value: "url", width: "40%" },
  { title: "用户名", value: "username", width: "15%" },
  {
    title: "操作",
    value: "actions",
    sortable: false,
    width: "20%",
    align: "center"
  }
]);

const add = () => {
  currentItem.value = null;
  dialog.value = true;
};

const edit = (item: DataSource) => {
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

const remove = (item: DataSource) => {
  const index = data.value.indexOf(item);
  if (index > -1) {
    data.value.splice(index, 1); // 立即从本地数据移除
  }
  loading.value = true; // 显示加载状态
  DataSourcesService.remove(item.no)
    .then(res => {
      if (res.code === 200) {
        alert("删除成功");
      } else {
        alert(`删除失败:\n${res.message}`);
        // 如果删除失败，恢复数据
        data.value.splice(index, 0, item);
      }
    })
    .catch(err => {
      alert(`删除失败: ${err.message}`);
      // 错误时恢复数据
      data.value.splice(index, 0, item);
    })
    .finally(() => {
      loading.value = false; // 隐藏加载状态
    });
};

const loadData = () => {
  loading.value = true;
  DataSourcesService.list()
    .then(res => {
      // 直接更新数据，Vue 会根据 item-value="no" 识别唯一键
      data.value = res;
    })
    .catch(err => {
      console.error("Error fetching data sources:", err);
      alert(`加载数据失败: ${err.message}`);
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* 自定义样式保持最小化 */
.v-data-table ::v-deep .v-data-table-header th {
  background-color: transparent !important; /* 保持透明，依赖 Vuetify 主题 */
}
</style>
