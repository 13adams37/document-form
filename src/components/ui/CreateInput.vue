<script setup>
import { ref, watch } from 'vue';

const { modelValue } = defineProps({
  modelValue: String,
  name: String,
  label: String,
});

const value = ref(modelValue);

const emits = defineEmits(['update:modelValue']);

watch(value, () => {
  emits('update:modelValue', value.value);
});
</script>

<template>
  <q-input
    :name="name"
    v-model="value"
    :label="label"
    clearable
    :rules="[(val) => !!val || 'Поле обязательно']"
  />
</template>
