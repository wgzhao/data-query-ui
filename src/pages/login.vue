<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            登录
          </h1>
          <form class="space-y-4 md:space-y-6"  @submit.prevent="login">
            <div>
              <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username/Email</label>
              <input type="text" v-model="auth.username" name="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input type="password" v-model="auth.password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" >
                </div>
                <div class="ml-3 text-sm">
                  <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                </div>
              </div>
            </div>
            <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  </section>
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
