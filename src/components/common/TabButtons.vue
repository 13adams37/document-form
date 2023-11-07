<script setup>
// next, prev, both
const props = defineProps({
  displayButtons: { type: String, required: true },
});
const emits = defineEmits(["prev", "next"]);
</script>

<template>
  <div class="row q-gutter-sm q-mt-md justify-center">
    <q-btn
      v-if="props.displayButtons === 'prev' || props.displayButtons === 'both'"
      class="text-weight-bold"
      icon="chevron_left"
      label="Назад"
      @click="emits('prev')"
    />

    <q-btn
      v-if="props.displayButtons === 'next' || props.displayButtons === 'both'"
      class="text-weight-bold"
      icon-right="chevron_right"
      label="Далее"
      @click="emits('next')"
    />
  </div>
</template>
