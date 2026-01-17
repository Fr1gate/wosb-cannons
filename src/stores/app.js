import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    pageTitle: "Калькулятор DPS",
    isMenuOpen: false,
  }),
  actions: {
    setPageTitle(title) {
      this.pageTitle = title;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
  },
});

