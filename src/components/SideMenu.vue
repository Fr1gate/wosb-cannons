<script setup>
import { useI18n } from "vue-i18n";
import { useAppStore } from "../stores/app";

const appStore = useAppStore();
const { t } = useI18n();
</script>

<template>
  <div
    v-if="appStore.isMenuOpen"
    class="menu-overlay"
    @click="appStore.closeMenu"
  />
  <aside :class="['side-menu', { open: appStore.isMenuOpen }]">
    <nav class="menu-list">
      <RouterLink
        class="menu-link"
        active-class="menu-link-active"
        to="/dps"
        @click="appStore.closeMenu"
      >
        {{ t("menu.dps") }}
      </RouterLink>
      <span class="menu-link disabled">{{ t("menu.boardingSim") }}</span>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
.side-menu {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 240px;
  background: var(--color-background);
  border-right: 1px solid var(--color-border);
  transform: translateX(-100%);
  transition: transform 0.2s ease-in-out;
  z-index: 11;
  padding: 4.5rem 1rem 1rem;
}

.side-menu.open {
  transform: translateX(0);
}

.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 10;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.menu-link {
  color: var(--color-text);
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: background-color 0.2s, border-color 0.2s;
}

.menu-link:hover {
  background: var(--color-background-mute);
  border-color: var(--color-border);
}

.menu-link-active {
  background: var(--color-background-mute);
  border-color: var(--color-border);
  color: var(--color-heading);
  font-weight: 600;
}

.menu-link.disabled {
  color: var(--color-text-muted, rgba(255, 255, 255, 0.4));
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
  border-color: var(--color-border);
  border-style: dashed;
}
</style>
