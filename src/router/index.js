/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'

const router = createRouter({
  extendRoutes: (routes) => {
    const adminRoute = routes.find((r) => r.name === '/admin')
    if (adminRoute) {
      adminRoute.meta ??= {}
      adminRoute.meta.requiresAuth = true
    }
    // completely optional since we are modifying the routes in place
    return routes
  },
  history: createWebHistory(process.env.BASE_URL),
})

export default router
