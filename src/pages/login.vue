<template>
    <v-sheet class="bg-deep-dark pa-12" rounded>
        <v-card class="mx-auto px-6 py-8" max-width="344">
            <v-form v-model="form" @submit.prevent="login">
                <v-text-field
                    v-model="auth.username"
                    :readonly="loading"
                    :rules="[required]"
                    class="mb-2"
                    clearable
                    label="Username/Email"
                ></v-text-field>

                <v-text-field
                    type="password"
                    v-model="auth.password"
                    :readonly="loading"
                    :rules="[required]"
                    clearable
                    label="Password"
                    placeholder="Enter your password"
                ></v-text-field>

                <br />

                <v-btn
                    :disabled="!form"
                    :loading="loading"
                    block
                    color="primary"
                    size="large"
                    type="submit"
                    variant="elevated"
                >
                    Sign In
                </v-btn>
            </v-form>
        </v-card>
    </v-sheet>
</template>
<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useAuthStore } from "@/store";
import router from "@/router";

import authService from "@/services/auth.service";

const form = ref(false);
const auth = ref({
    username: "",
    password: "",
});

const loading = ref<boolean>(false);
const sessionExpired = ref<boolean>(false);

function onSubmit() {
    if (!form.value) return;
    loading.value = true;
    setTimeout(() => (loading.value = false), 2000);
}
function required(v: string): boolean | string {
    return !!v || "Field is required";
}

function login() {
    // reset the error message
    // clearMessages();
    const authStore = useAuthStore();
    authService.login(auth.value).then((res) => {
        console.log(res.data);
        if (res.data.code != 200) {
            alert("登录失败: " + res.data.message);
        } else {
            authStore.login(res.data);
            localStorage.setItem("token", res.data.result.token);
            // // update the authorization header
            axios.defaults.headers.common["Authorization"] =
                `Bearer ${res.data.result.token}`;
        }
        location.href = "/admin/home";
    });

    // extract the user role from the token
    // const userRole = extractUserRoleFromToken(accessToken);

    // call the stores login method this will update the stores state
    // authStore.login(userRole);

    // redirect to the home page
    // await router.push("/");
}
</script>
