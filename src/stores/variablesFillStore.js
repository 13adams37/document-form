import { defineStore } from 'pinia';

export const useVariablesFillStore = defineStore('variables', {
  state: () => ({
    variables: [],
  }),
});
