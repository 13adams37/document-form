<script setup>
import { useQuasar } from 'quasar';

const $q = useQuasar();

if (process.env.MODE === 'electron') {
  window.myWindowAPI.getThemeSetting().then((res) => {
    $q.dark.set(res === 'dark' ? true : false);
  });
} else {
  $q.dark.set(true); // default, get from localStorage
}
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="slide" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
.slide-enter-active {
  animation: slide-in 200ms ease-out forwards;
}

.slide-leave-active {
  animation: slide-out 200ms ease-out forwards;
}

@keyframes slide-in {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-30px);
    opacity: 0;
  }
}
</style>
