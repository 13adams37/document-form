<script setup>
const props = defineProps({
  text: String,
});

function returnTrue() {
  return true;
}

function returnFalse() {
  return false;
}
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
          label="Нет"
          color="primary"
          v-close-popup
          @click="returnFalse"
        />
        <q-btn
          flat
          label="Да"
          color="primary"
          v-close-popup
          @click="returnTrue"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
