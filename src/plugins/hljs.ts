import type { App } from "vue";
import HljsVuePlugin from "@highlightjs/vue-plugin";
import "highlight.js/styles/github-dark.css";
import "highlight.js/lib/common";

export default function (app: App) {
  app.use(HljsVuePlugin);
}
