<template>
  <v-sheet class="bg-deep-dark pa-12" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form v-model="form" @submit.prevent="login">
        <v-text-field
          v-model="auth.username"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          label="Username/Email"
          focused
        ></v-text-field>

        <v-text-field
          type="password"
          v-model="auth.password"
          :readonly="loading"
          :rules="[required]"
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
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter, useRoute } from "vue-router";
import authService from "@/services/auth.service";
import parseJwt from "@/util/jwt-util.ts";

const form = ref(false);
const auth = ref({
  username: "",
  password: ""
});

const loading = ref<boolean>(false);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

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
  authService.login(auth.value).then(res => {
    if (res.code != 200) {
      alert("登录失败: " + res.message);
    } else {
      authStore.setToken(res.result.token);
      const  info = parseJwt(res.result.token);
      authStore.setUserName(info['sub']);
      const redirectPath = route.query.redirect || "/admin/home";
      router.push(redirectPath);
    }
  });

  // extract the user role from the token
  // const userRole = extractUserRoleFromToken(accessToken);

  // call the stores login method this will update the stores state
  // authStore.login(userRole);

  // redirect to the home page
  // await router.push("/");
}
</script>
