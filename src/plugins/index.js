/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import { createPinia } from "pinia";
import router from "@/router";

// highlight syntax in code block

import HljsVuePlugin from "@highlightjs/vue-plugin";
import "highlight.js/styles/github.css";
import "highlight.js/lib/common";

const pinia = createPinia();
export function registerPlugins(app) {
    app.use(vuetify).use(router).use(pinia).use(HljsVuePlugin);
}
