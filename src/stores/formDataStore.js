import { defineStore } from 'pinia';

export const useFormDataStore = defineStore('formData', {
  state: () => ({
    name: '',
    comment: '',
    variables: [],
    paths: [],
  }),
});
