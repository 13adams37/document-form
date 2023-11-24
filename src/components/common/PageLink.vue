<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <q-item clickable :to="to">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
  <q-separator inset />
</template>
