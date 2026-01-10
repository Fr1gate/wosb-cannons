<template>
  <div class="home-page">
    <h1>Калькулятор эффективности орудий в World of Sea Battle</h1>
    <CannonsTable />
  </div>
</template>

<script setup>
import CannonsTable from "../components/CannonsTable.vue";
</script>

<style lang="scss" scoped>
.home-page {
  padding: 2rem;

  h1 {
    color: var(--color-heading);
    margin-bottom: 2rem;
    text-align: center;
  }
}
</style>
