import { defineStore } from "pinia";

export const useVariablesTableStore = defineStore("tableData", {
  state: () => ({
    tableData: [],
  }),
  actions: {
    reset() {
      Object.assign(this, []);
    },
  },
});
