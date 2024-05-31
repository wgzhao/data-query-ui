<template>
    <v-card flat title="新增签名">
        <v-card-text>
            <v-sheet class="mx-auto" max-width="400">
                <v-form v-model="valid" @submit.prevent>
                    <v-text-field
                        :rules="[rules.required]"
                        label="App Id"
                        v-model="form.appId"
                        required
                    ></v-text-field>
                    <v-text-field
                        :rules="[rules.required]"
                        label="App Secret"
                        v-model="form.appKey"
                        required
                    ></v-text-field>
                    <v-text-field
                        :rules="[rules.required]"
                        label="申请人"
                        v-model="form.applier"
                        required
                    ></v-text-field>
                    <v-btn
                        type="submit"
                        :disabled="!valid"
                        block
                        class="mt-2"
                        @click="save"
                        >保存</v-btn
                    >
                </v-form>
            </v-sheet>
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, Router } from "vue-router";
import SignService from "@/services/sign";
const form = ref({
    appKey: "",
    appId: "",
    applier: "",
});
const valid = ref<boolean>(false);

const router: Router = useRouter();
const rules = ref({
    required: (value: any) => !!value || "Field is required",
});

const save = () => {
    SignService.save(form.value).then((res) => {
        if (res.data.success == true) {
            alert("保存成功");
            router.push({ name: "/admin/signs/" });
        } else {
            alert("保存失败:\n" + res.data.message);
        }
    });
};
onMounted(() => {
    //generate a new sign
    SignService.gen().then((res) => {
        form.value = res.data;
    });
});
</script>
