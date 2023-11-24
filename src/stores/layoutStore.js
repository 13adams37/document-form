import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('leftDrawerOpen', {
  state: () => ({
    leftDrawerOpen: false,
  }),
  actions: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
});
