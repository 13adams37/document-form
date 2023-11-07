<script setup>
const props = defineProps({
  text: String,
});
</script>

<template>
  <q-dialog persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">{{ text }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Ок"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
