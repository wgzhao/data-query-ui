<template>
    <v-card flat>
        <v-card-title>
            <v-icon>mdi-key</v-icon>
            签名
            <v-btn
                type="button"
                small
                class="btn btn-primary"
                variant="outlined"
                prepend-icon="mdi-plus"
                to="/admin/signs/new"
                >新增</v-btn
            >
        </v-card-title>
        <v-card-text>
            <v-data-table :headers="headers" :items="signs"> </v-data-table>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import SignService from "@/services/sign";

const signs = ref([]);
const headers = ref([
    { title: "App Id", value: "appId" },
    { title: "App Secret", value: "appKey" },
    { title: "申请人", value: "applier" },
]);

// const add = () => {
//   this.$router.push({name: "admin-signs-new"})
// }
onMounted(() => {
    SignService.list().then((res) => (signs.value = res.data));
});
</script>
