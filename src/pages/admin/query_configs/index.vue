<template>
    <v-data-table
        :headers="headers"
        :search="search"
        :items="data"
        density="compact"
        :expanded="expanded"
        item-value="selectId"
        show-expand
    >
        <template v-slot:top>
            <v-toolbar density="compact">
                <v-toolbar-title>查询配置</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                    density="compact"
                    v-model="search"
                    label="搜索"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn
                    small
                    class="btn btn-primary"
                    variant="outlined"
                    prepend-icon="mdi-plus"
                    @click="addItem"
                >
                    新增
                </v-btn>
            </v-toolbar>
        </template>
        <template v-slot:item.dataSource="{ item }">
            <router-link
                :to="`/admin/data_sources/${item.dataSource}`"
                type="button"
                target="_blank"
            >
                {{ item.dataSource }}
                <v-icon>mdi-open-in-new</v-icon>
            </router-link>
        </template>
        <template v-slot:expanded-row="{ columns, item }">
            <tr>
                <td :colspan="columns.length">
                    <highlightjs language="sql" :code="item.querySql" />
                </td>
            </tr>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-icon size="small" @click="editItem(item.selectId)"
                >mdi-pencil</v-icon
            >
            <v-icon @click="deleteItem(item.selectId)">mdi-delete</v-icon>
            <v-tooltip location="bottom" activator="parent" text="删除缓存">
                <template v-slot:activator="{ props }">
                    <v-icon @click="deleteCache(item.selectId)" v-bind="props"
                        >mdi-cached</v-icon
                    >
                </template>
            </v-tooltip>
        </template>
    </v-data-table>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import QueryconfigService from "@/services/queryconfig";
import QueryConfig from "@/types/query-config";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const data = ref<QueryConfig[]>([]);
const expanded = ref([]);
const headers = ref([
    { title: "查询ID", key: "selectId" },
    { title: "数据源", key: "dataSource" },
    { title: "启用缓存", key: "enableCache" },
    { title: "缓存时间(s)", key: "cacheTime" },
    // { title: "查询语句", key: "querySql", width: "60%" },
    { title: "启用", key: "enabled" },
    { title: "创建时间", key: "createdAt" },
    { title: "修改时间", key: "updatedAt" },
    { title: "备注", key: "note" },
    { title: "操作", key: "actions", fixed: true },
    { title: "SQL", key: "data-table-expand" },
]);
const search = ref();

const addItem = () => {
    router.push(route.name?.toString() + "new");
};
const editItem = (id: string) => {
    router.push(route.name?.toString() + id);
};
const deleteItem = (id: string) => {
    if (confirm("确认删除？")) {
        QueryconfigService.remove(id).then((res) => {
            data.value = data.value.filter((item) => item.selectId !== id);
        });
    }
};

const deleteCache = (id: string) => {
    QueryconfigService.deleteCache(id).then((res) => {
        alert("缓存已删除, 删除数量: " + res.data);
    });
};

onMounted(() => {
    QueryconfigService.list().then((res) => (data.value = res.data));
});
</script>
