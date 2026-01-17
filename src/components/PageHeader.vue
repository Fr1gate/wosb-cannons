<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "../stores/app";

const appStore = useAppStore();
const { locale, t } = useI18n();

const isRuActive = computed(() => locale.value === "ru");
const isEnActive = computed(() => locale.value === "en");

const setLocale = (nextLocale) => {
  locale.value = nextLocale;
};
</script>

<template>
  <header class="app-header">
    <button class="menu-button" type="button" @click="appStore.toggleMenu">
      ☰
    </button>
    <div class="header-title">{{ t(appStore.pageTitleKey) }}</div>
    <div class="header-actions">
      <button
        class="lang-button"
        :class="{ active: isRuActive }"
        type="button"
        @click="setLocale('ru')"
      >
        {{ t("language.ru") }}
      </button>
      <button
        class="lang-button"
        :class="{ active: isEnActive }"
        type="button"
        @click="setLocale('en')"
      >
        {{ t("language.en") }}
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
  position: sticky;
  top: 0;
  z-index: 10;
}

.menu-button {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: 4px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
}

.header-title {
  font-size: 20px;
  text-align: center;
  font-weight: 600;
  color: var(--color-heading);
}

.header-actions {
  display: flex;
  gap: 0.25rem;
}

.lang-button {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: 4px;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
  font-size: 0.85rem;
}

.lang-button.active {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
  color: var(--color-heading);
  font-weight: 600;
}

@media (max-width: 640px) {
  .header-title {
    font-size: 0.95rem;
  }
}
</style>
