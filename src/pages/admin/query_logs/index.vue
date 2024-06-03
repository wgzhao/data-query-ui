<template>
    <!-- query logs-->
    <v-card flat>
        <v-card-title>
            查询日志
            <v-text-field
                v-model="q"
                label="搜索"
                single-line
                hide-details
                @keyup.enter="searchLogs"
            ></v-text-field>
        </v-card-title>
        <v-card-text>
            <v-data-table-server
                v-model:items-per-page="itemsPerPage"
                :headers="headers"
                :items-length="totalItems"
                :items="logs"
                :loading="loading"
                item-value="id"
                @update:options="loadItems"
                :expanded="expanded"
                show-expand
            >
                <!-- <template v-slot:item.querySql="{ item }">
                    <pre>{{ item.querySql }}</pre>
                </template> -->
                <template v-slot:expanded-row="{ columns, item }">
                    <tr>
                        <td :colspan="columns.length">
                            <pre>{{ item.querySql }}</pre>
                        </td>
                    </tr>
                </template>
            </v-data-table-server>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import QueryLogService from "@/services/querylog";
import { ref } from "vue";
const logs = ref([]);
const totalItems = ref(10);
const itemsPerPage = ref(10);
const loading = ref(false);
const q = ref("");
// const sortBy =  ref([{ key: 'createdAt', order: 'desc' }])
const headers = ref([
    { title: "编号", key: "id" },
    { title: "应用ID", key: "appId" },
    { title: "查询ID", key: "selectId" },
    // { title: "查询SQL", key: "querySql" },
    { title: "查询时间", key: "createdAt" },
    { title: "查询SQL", key: "data-table-expand" },
]);
const expanded = ref([]);

const createSort = (sortBy) => {
    let sortKey: Array<string> = [];
    let sortOrder: Array<string> = [];
    if (sortBy.length) {
        for (let i = 0; i < sortBy.length; i++) {
            sortKey.push(sortBy[i].key);
            sortOrder.push(sortBy[i].order);
        }
    } else {
        // add createdAt as default sort
        sortKey.push("createdAt");
        sortOrder.push("desc");
    }
    // merge sorkKey and sortOrder a dict
    return { sortKey: sortKey.join(), sortOrder: sortOrder.join() };
};
const loadItems = ({ page, itemsPerPage, sortBy }) => {
    const sorts = createSort(sortBy);
    loading.value = true;
    if (q.value != "") {
        QueryLogService.search(q.value, page - 1, itemsPerPage, sorts).then(
            (res) => {
                logs.value = res.data["content"];
                totalItems.value = res.data["totalElements"];
                loading.value = false;
            },
        );
        return;
    }
    QueryLogService.list(page - 1, itemsPerPage, sorts).then((res) => {
        logs.value = res.data["content"];
        totalItems.value = res.data["totalElements"];
        loading.value = false;
    });
};

const searchLogs = () => {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
};
</script>
