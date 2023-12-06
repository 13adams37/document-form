<script setup></script>

<template>
  <q-page class="full-width column flex flex-center">
    <h1>Главная страница</h1>
    <!-- здесь писать использование, используя компонент stepper -->
    <!-- <div>
      <div>Direct store</div>
      <div>{{ store.counter }}</div>

      <q-btn @click="store.counter = false">-</q-btn>
      <q-btn @click="store.increment()">+</q-btn>
    </div> -->
    <div class="column full-width flex-center" v-for="item in 50">
      blah blah
    </div>
    <div class="column full-width flex-center q-mb-xl">END LINE</div>
  </q-page>
</template>

<style scoped>
h1 {
  word-break: break-word;
  text-align: center;
}
</style>
