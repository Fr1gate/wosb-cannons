<template>
  <div class="app">
    <PageHeader />
    <SideMenu />
    <div class="page-wrapper">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import PageHeader from "./components/PageHeader.vue";
import SideMenu from "./components/SideMenu.vue";
</script>

<style lang="scss" scoped>
.app {
  // min-height: 100vh;
  background: var(--color-background);
  width: 100%;
}
.page-wrapper {
  padding-top: 0.5rem;
}
</style>
