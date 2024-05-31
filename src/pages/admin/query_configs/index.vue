<template>
    <v-card flat>
        <v-card-title>
            查询配置
            <v-btn
                type="button"
                small
                class="btn btn-primary"
                variant="outlined"
                prepend-icon="mdi-plus"
                to="/admin/query_configs/new"
                >新增</v-btn
            >
        </v-card-title>
        <v-card-text>
            <v-data-table
                :headers="headers"
                :search="search"
                :items="data"
                density="compact"
            >
                <template v-slot:top>
                    <v-text-field
                        density="compact"
                        v-model="search"
                        label="搜索"
                        single-line
                        hide-details
                    ></v-text-field>
                </template>
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.selectId }}</td>
                        <td>{{ item.dataSource }}</td>
                        <td>
                            <v-chip
                                :color="item.enableCache ? 'success' : 'error'"
                                dark
                            >
                                {{ item.enableCache ? "是" : "否" }}</v-chip
                            >
                        </td>
                        <td>{{ item.cacheTime }}</td>
                        <td>{{ item.querySql }}</td>
                        <td>
                            <v-chip
                                :color="item.enable ? 'success' : 'error'"
                                dark
                            >
                                {{ item.enable ? "是" : "否" }}</v-chip
                            >
                        </td>
                        <td>{{ item.createdAt }}</td>
                        <td>{{ item.updatedAt }}</td>
                        <td>{{ item.note }}</td>
                        <td>
                            <router-link
                                :to="`/admin/query_configs/${item.selectId}`"
                            >
                                <v-icon>mdi-pencil</v-icon>
                            </router-link>
                            <v-icon @click="deleteItem(item.selectId)"
                                >mdi-delete</v-icon
                            >
                            <v-icon @click="deleteCache(item.selectId)"
                                >mdi-cash-remove
                                <v-tooltip activator="parent" location="top">
                                    删除缓存
                                </v-tooltip>
                            </v-icon>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import QueryconfigService from "@/services/queryconfig";
import QueryConfig from "@/types/query-config";

const data = ref<QueryConfig[]>([]);

const headers = ref([
    { title: "查询ID", key: "selectId", width: "100px" },
    { title: "数据源", key: "dataSource", width: "100px" },
    { title: "启用缓存", key: "enableCache", width: "100px" },
    { title: "缓存时间(s)", key: "cacheTime", width: "100px" },
    { title: "查询语句", key: "querySql", width: "60%" },
    { title: "启用", key: "enabled", width: "100px" },
    { title: "创建时间", key: "createdAt", width: "100px" },
    { title: "修改时间", key: "updatedAt", width: "100px" },
    { title: "备注", key: "note", width: "100px" },
    { title: "操作", key: "action", width: "300px", fixed: true },
]);
const search = ref();

const deleteItem = (id: string) => {
    if (confirm("确认删除？")) {
        QueryconfigService.remove(id).then((res) => {
            data.value = data.value.filter((item) => item.selectId !== id);
            //QueryconfigService.list().then(res => data.value = res.data);
        });
    }
};

const deleteCache = (id: string) => {
    QueryconfigService.deleteCache(id).then((res) => {
        alert("缓存已删除, 删除数量:" + res.data);
    });
};

onMounted(() => {
    QueryconfigService.list().then((res) => (data.value = res.data));
});
</script>
