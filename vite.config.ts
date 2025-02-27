import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";

// 插件
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import VueRouter from "unplugin-vue-router/vite";
import Layouts from "vite-plugin-vue-layouts";
import Components from "unplugin-vue-components/vite";
import ViteFonts from "unplugin-fonts/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      // Vue Router 插件
      VueRouter(),

      // 布局插件
      Layouts(),

      // Vue 核心插件
      Vue({
        template: { transformAssetUrls }
      }),

      // Vuetify 插件
      Vuetify({
        autoImport: true,
        styles: {
          configFile: "src/styles/settings.scss"
        }
      }),

      // 组件自动导入
      Components(),

      // 字体插件
      ViteFonts({
        google: {
          families: [
            {
              name: "Roboto",
              styles: "wght@100;300;400;500;700;900"
            }
          ]
        }
      })
    ],

    // 定义全局常量
    define: {
      "process.env": {}
    },

    // 解析配置
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      },
      extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]
    },

    // 开发服务器配置
    server: {
      port: 3000,
      host: "0.0.0.0",
      proxy: {
        [env.VITE_API_BASE_URL]: {
          target: env.VITE_API_HOST,
          changeOrigin: false
        }
      }
    },

    // 构建选项
    build: {
      // 源码映射，便于调试
      sourcemap: mode !== "production",
      // 生产环境优化选项
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            vuetify: ["vuetify"]
          }
        }
      }
    },

    // 优化依赖预构建
    optimizeDeps: {
      include: ["vue", "vue-router", "pinia", "vuetify"]
    }
  };
});
