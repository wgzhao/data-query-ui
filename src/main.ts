/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import {useAuthStore} from "@/store/auth";

const app = createApp(App);

registerPlugins(app);

// 在应用初始化时加载本地存储中的 Token
const authStore = useAuthStore();
authStore.loadTokenFromStorage();

app.mount("#app");
