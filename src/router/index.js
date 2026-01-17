import { createRouter, createWebHashHistory } from "vue-router";
import DPSMeter from "../pages/DPSMeter.vue";

const routes = [
  { path: "/", redirect: { name: "dps" } },
  { path: "/dps", name: "dps", component: DPSMeter },
  { path: "/:pathMatch(.*)*", redirect: { name: "dps" } },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
