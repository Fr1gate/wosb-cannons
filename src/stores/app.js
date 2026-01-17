import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    pageTitleKey: "pages.dps.title",
    isMenuOpen: false,
  }),
  actions: {
    setPageTitle(key) {
      this.pageTitleKey = key;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
  },
});

