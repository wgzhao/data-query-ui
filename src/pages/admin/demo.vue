<template>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div class="pb-4 dark:bg-gray-900">
            <label for="table-search" class="sr-only">Search</label>
            <div class="relative mt-1">
                <div
                    class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none"
                >
                    <svg
                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    id="table-search"
                    class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search for items"
                />
            </div>
        </div>
        <table
            class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
            <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr v-for="item in headers">
                    <th scope="col" class="p-4">{{ item.title }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    v-for="item in data"
                    :key="no"
                >
                    <td class="px-6 py-4">{{ item.no }}</td>
                    <td class="px-6 py-4">{{ item.name }}</td>
                    <td class="px-6 py-4">{{ item.url }}</td>
                    <td class="px-6 py-4">{{ item.username }}</td>
                    <td class="px-6 py-4">
                        <a
                            href="#"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >Edit</a
                        >
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
// import {FilterMatchMode} from "primevue/api";
// import DataTable from 'primevue/datatable';
// import Column from 'primevue/column';
import DataSourcesService from "@/services/datasources.ts";
import DataSource from "@/types/data-source.ts";

// const filters = ref({
//   global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//   name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//   'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//   representative: { value: null, matchMode: FilterMatchMode.IN },
//   status: { value: null, matchMode: FilterMatchMode.EQUALS },
//   verified: { value: null, matchMode: FilterMatchMode.EQUALS }
// });

const headers = ref([
    { title: "#", value: "no", width: "5%" },
    { title: "名称", value: "name", width: "5%" },
    { title: "地址", value: "url", width: "20%" },
    { title: "用户名", value: "username", width: "5%" },
    { title: "操作", value: "actions", sortable: false, width: "5%" },
]);

const data = ref<DataSource[]>([]);

onMounted(() => {
    DataSourcesService.list().then((res) => (data.value = res.data));
});
</script>
