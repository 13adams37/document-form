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
</template>
<script setup>
const props = defineProps({
  title: String,
  caption: String,
  to: String,
  icon: String,
});
</script>
