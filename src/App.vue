<script setup>
import { ref, computed } from "vue";
import HomePage from "./pages/HomePage.vue";
import DPSMeter from "./pages/DPSMeter.vue";

const currentPage = ref("dps");

const pages = [
  { id: "home", label: "Список орудий" },
  { id: "dps", label: "Калькулятор DPS" },
];

const currentComponent = computed(() => {
  return currentPage.value === "home" ? HomePage : DPSMeter;
});
</script>

<template>
  <div class="app">
    <!-- <nav class="navigation">
      <button
        v-for="page in pages"
        :key="page.id"
        @click="currentPage = page.id"
        :class="['nav-button', { active: currentPage === page.id }]"
      >
        {{ page.label }}
      </button>
    </nav> -->

    <component :is="currentComponent" />
  </div>
</template>

<style lang="scss" scoped>
.app {
  // min-height: 100vh;
  background: var(--color-background);
  width: 100%;
}
</style>
