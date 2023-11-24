import { defineStore } from 'pinia';

export const useVariablesTableStore = defineStore('tableData', {
  state: () => ({
    tableData: [],
  }),
});
