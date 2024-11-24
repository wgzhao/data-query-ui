export const routes = [
  { path: "/", redirect: "/dashboard" },
  {
    path: "/",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "dashboard",
        component: () => import("@/pages/dashboard.vue")
      },
      {
        path: "account-settings",
        component: () => import("@/pages/account-settings.vue")
      },
      {
        path: "typography",
        component: () => import("@/pages/typography.vue")
      },
      {
        path: "icons",
        component: () => import("@/pages/icons.vue")
      },
      {
        path: "cards",
        component: () => import("@/pages/cards.vue")
      },
      {
        path: "tables",
        component: () => import("@/pages/tables.vue")
      },
      {
        path: "form-layouts",
        component: () => import("@/pages/form-layouts.vue")
      }
    ]
  },
  {
    path: "/",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "admin/data_sources",
        component: () => import("@/pages/admin/data_sources/index.vue")
      },
      {
        path: "admin/data_sources/:id",
        component: () => import("@/pages/admin/data_sources/[id].vue")
      },
      {
        path: "admin/query_configs",
        component: () => import("@/pages/admin/query_configs/index.vue")
      },
      {
        path: "admin/query_configs/:id",
        component: () => import("@/pages/admin/query_configs/[id].vue")
      },
      {
        path: "admin/signs",
        component: () => import("@/pages/admin/signs/index.vue")
      },
      {
        path: "admin/signs/new",
        component: () => import("@/pages/admin/signs/new.vue")
      },
      {
        path: "admin/query_logs",
        component: () => import("@/pages/admin/query_logs/index.vue")
      }
    ]
  },
  {
    path: "/",
    component: () => import("@/layouts/blank.vue"),
    children: [
      {
        path: "login",
        component: () => import("@/pages/login.vue")
      },
      {
        path: "register",
        component: () => import("@/pages/register.vue")
      },
      {
        path: "/:pathMatch(.*)*",
        component: () => import("@/pages/[...error].vue")
      }
    ]
  }
];
