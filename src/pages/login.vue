<template>
  <v-sheet class="bg-deep-dark pa-12" rounded>
    <v-card class="mx-auto px-6 py-8" max-width="344">
      <v-form
        v-model="form"
        @submit.prevent="login"
      >
        <v-text-field
          v-model="username"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          clearable
          label="Username/Email"
        ></v-text-field>

        <v-text-field
          type="password"
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          clearable
          label="Password"
          placeholder="Enter your password"
        ></v-text-field>

        <br>

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
<script setup>
  import { ref } from 'vue'
  import { useAuthStore } from "@/stores";
  import {get, post} from '@/util/request'

  const authStore = useAuthStore();
  const form = ref(false)
  const username = ref(null)
  const password = ref(null)
  const loading = ref(false)
  const sessionExpired = ref(false);

  function onSubmit () {
    if (!form.value) return
    loading.value = true
    setTimeout(() => (loading.value = false), 2000)
  }
  function required (v) {
    return !!v || 'Field is required'
  }

  async function login() {
  try {
    // reset the error message
    // clearMessages();

    // send the login request to the server
    const response = await post(
      "/login", // the endpoint
      form.value, // the request body
      { withCredentials: true },
    );

    console.log(response.data)

    // get the token from the response
    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;

    // set the token in local storage
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    // update the authorization header
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;

    // extract the user role from the token
    const userRole = extractUserRoleFromToken(accessToken);

    // call the stores login method this will update the stores state
    authStore.login(userRole);

    // redirect to the home page
    await router.push("/");
  } catch (error) {
    if (error.response) {
      // An error response was received from the server
      showErrorMessage(error.response.data.message);
    } else if (error.request) {
      // The request was made but no response was received.
      // For example, a CORS error
      showErrorMessage(
        "Unable to connect to the server. Please try again later.",
      );
    } else {
      // Something else went wrong
      showErrorMessage("An error occurred while processing your request.");
    }
  }
}
function extractUserRoleFromToken(token) {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  return decodedToken.role;
}

if (router.currentRoute.value.query.sessionExpired) {
  sessionExpired.value = true;
}
</script>