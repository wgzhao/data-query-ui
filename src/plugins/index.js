/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import { createPinia } from "pinia";
import router from "@/router";
// import '@/styles/index.css'

// highlight syntax in code block

import HljsVuePlugin from "@highlightjs/vue-plugin";
import "highlight.js/styles/github-dark.css";
import "highlight.js/lib/common";

const pinia = createPinia();
export function registerPlugins(app) {
  app.use(router).use(pinia).use(vuetify).use(HljsVuePlugin);
}
