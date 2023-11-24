import { defineStore } from 'pinia';

export const usePathTableStore = defineStore('pathData', {
  state: () => ({
    pathData: [],
  }),
});
