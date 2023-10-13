const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/CreateFormPage",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/CreateFormPage.vue") }],
  },
  {
    path: "/EditFormPage",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/EditFormPage.vue") }],
  },
  {
    path: "/CreateObjectPage",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/CreateObjectPage.vue") }],
  },
  {
    path: "/EditObjectPage",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/EditObjectPage.vue") }],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
