<script setup>
import { ref, computed } from "vue";
import HomePage from "./pages/HomePage.vue";
import DPSMeter from "./pages/DPSMeter.vue";

const currentPage = ref("home");

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
    <nav class="navigation">
      <button
        v-for="page in pages"
        :key="page.id"
        @click="currentPage = page.id"
        :class="['nav-button', { active: currentPage === page.id }]"
      >
        {{ page.label }}
      </button>
    </nav>

    <component :is="currentComponent" />
  </div>
</template>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  background: var(--color-background);
}

.navigation {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;

  .nav-button {
    padding: 0.75rem 1.5rem;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text);
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
    font-weight: 500;

    &:hover {
      background: var(--color-background-mute);
      border-color: var(--color-border-hover);
    }

    &.active {
      background: var(--color-heading);
      color: var(--color-background);
      border-color: var(--color-heading);
    }
  }
}

@media (max-width: 768px) {
  .navigation {
    padding: 1rem;

    .nav-button {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }
}
</style>
