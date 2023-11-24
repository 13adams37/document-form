<script setup>
import { useVariablesFillStore } from 'src/stores/variablesFillStore';

const { variables } = useVariablesFillStore();
</script>

<template>
  <div
    :key="variable.name"
    v-for="variable in variables.value"
    class="column items-center full-width"
  >
    <span class="input__text text-center text-h5 q-pb-sm">
      {{ variable.text }}</span
    >
    <q-input
      v-model="variable.value"
      debounce="200"
      class="q-mb-md"
      outlined
      autogrow
    />
  </div>
</template>

<style lang="scss" scoped>
body.screen--xs .q-field,
body.screen--xs .input__text {
  width: 100%;
}

.q-field,
.input__text {
  width: 70%;
}
</style>
