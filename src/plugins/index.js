/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "@/router";
// import '@/styles/index.css'

// highlight syntax in code block

import HljsVuePlugin from "@highlightjs/vue-plugin";
import "highlight.js/styles/github-dark.css";
import "highlight.js/lib/common";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
export function registerPlugins(app) {
  app.use(router).use(pinia).use(vuetify).use(HljsVuePlugin);
}
