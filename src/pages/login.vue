<script setup lang="ts">
import { useTheme } from "vuetify";
import { useAuthStore } from "@/store";
import authService from "@/services/auth.service";
// import AuthProvider from "@/views/pages/authentication/AuthProvider.vue";
import logo from "@images/logo.svg?raw";
import authV1MaskDark from "@images/pages/auth-v1-mask-dark.png";
import authV1MaskLight from "@images/pages/auth-v1-mask-light.png";
import { router } from "@/plugins/router";

const authStore = useAuthStore();
const form = ref({
  username: "",
  password: "",
  remember: false
});

const vuetifyTheme = useTheme();

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === "light"
    ? authV1MaskLight
    : authV1MaskDark;
});

const isPasswordVisible = ref(false);

function login() {
  // reset the error message
  // clearMessages();
  authService.login(form.value).then(res => {
    if (res.code != 200) {
      alert("登录失败: " + res.message);
    } else {
      authStore.login(res.result);
      router.push("/");
    }
  });
}
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <!-- <VCardItem class="justify-center">
        <RouterLink to="/" class="d-flex align-center gap-3"> -->
      <!-- <div class="d-flex" v-html="logo" />
          <h2 class="font-weight-medium text-2xl text-uppercase">Materio</h2>
        </RouterLink>
      </VCardItem> -->

      <VCardText class="pt-2">
        <h4 class="text-h4 mb-1 justify-center">欢迎登录接口查询系统 👋🏻</h4>
        <p class="mb-0">请输入用户名和密码登录到您的帐户</p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="login">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.username"
                label="Username"
                type="email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="
                  isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'
                "
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div
                class="d-flex align-center justify-space-between flex-wrap my-6"
              >
                <VCheckbox v-model="form.remember" label="Remember me" />

                <a class="text-primary" href="javascript:void(0)">
                  Forgot Password?
                </a>
              </div>

              <!-- login button -->
              <VBtn block type="submit"> Login </VBtn>
            </VCol>

            <!-- create account -->
            <VCol cols="12" class="text-center text-base">
              <span>New on our platform?</span>
              <RouterLink class="text-primary ms-2" to="/register">
                Create an account
              </RouterLink>
            </VCol>

            <!-- <VCol cols="12" class="d-flex align-center">
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
            </VCol> -->

            <!-- auth providers -->
            <!-- <VCol cols="12" class="text-center">
              <AuthProvider />
            </VCol> -->
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
