/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import { routes } from "vue-router/auto-routes";
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path.startsWith("/admin")) {
    if (!to.meta.requiresAuth) {
      to.meta.requiresAuth = true;
    }
  }
  next();
});

router.beforeEach((to, from, next) => {
  console.log("to.meta = " + JSON.stringify(to.meta));
  // console.log("route = " + JSON.stringify(router.options.routes));
  const isAuthenticated = localStorage.getItem("token") != null; // Replace with your actual authentication check
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log("prepare redirect to login");
    next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
});

export default router;
