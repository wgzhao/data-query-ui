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
          show-select
          select-strategy="single"
          return-object
          v-model="selectedItem"
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
              <v-spacer />
              <div class="d-flex gap-2">
                <v-btn
                  size="small"
                  color="primary"
                  variant="outlined"
                  class="mx-2"
                  @click="doAction('edit')"
                >
                  编辑
                </v-btn>
                <v-btn
                  size="small"
                  color="primary"
                  variant="outlined"
                  class="mx-2"
                  @click="doAction('delete')"
                >
                  删除
                </v-btn>
                <v-btn
                  size="small"
                  color="primary"
                  variant="outlined"
                  @click="doAction('deleteCache')"
                >
                  删除缓存
                </v-btn>
              </div>
            </v-toolbar>
          </template>

          <template v-slot:item.dataSource="{ item }">
            <router-link
              :to="`/admin/data_sources/${item.dataSource}`"
              target="_blank"
              class="text-decoration-none text-primary"
            >
              {{ item.dataSource }}
              <v-icon size="small" class="ml-1">mdi-open-in-new</v-icon>
            </router-link>
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
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import QueryconfigService from "@/services/queryconfig";
import { QueryConfig } from "@/types";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const data = ref<QueryConfig[]>([]);
const expanded = ref([]);
const headers = ref([
  { title: "查询ID", key: "selectId", width: "15%" },
  { title: "数据源", key: "dataSource", width: "15%" },
  { title: "启用缓存", key: "enableCache", width: "10%" },
  { title: "缓存时间(s)", key: "cacheTime", width: "10%" },
  { title: "启用", key: "enabled", width: "10%" },
  { title: "创建时间", key: "createdAt", width: "15%" },
  { title: "修改时间", key: "updatedAt", width: "15%" },
  { title: "备注", key: "note", width: "10%" },
  { title: "SQL", key: "data-table-expand", sortable: false, width: "15%" }
]);
const search = ref("");
const selectedItem = ref([]);
const loading = ref(false); // 添加加载状态

const addItem = () => {
  router.push(`${route.name?.toString()}/new`.replace(/\/+/g, "/"));
};

const doAction = (dtype: string) => {
  if (selectedItem.value.length > 0) {
    const id = selectedItem.value[0].selectId; // 确保获取 selectId
    if (dtype === "edit") {
      editItem(id);
    } else if (dtype === "delete") {
      deleteItem(id);
    } else if (dtype === "deleteCache") {
      deleteCache(id);
    }
  }
};

const editItem = (id: string) => {
  router.push(`${route.name?.toString()}/${id}`.replace(/\/+/g, "/"));
};

const deleteItem = (id: string) => {
  if (confirm("确认删除？")) {
    loading.value = true;
    QueryconfigService.remove(id)
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
  QueryconfigService.deleteCache(id)
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

onMounted(() => {
  loading.value = true;
  QueryconfigService.list()
    .then(res => {
      data.value = res;
    })
    .catch(err => {
      console.error("Error fetching query configs:", err);
      alert(`加载查询配置失败: ${err.message}`);
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>
