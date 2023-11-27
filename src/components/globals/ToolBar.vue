<script setup>
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useLayoutStore } from 'stores/layoutStore';

// TODO: Store darkMode var in cookies

const store = useLayoutStore();
const darkMode = ref(false);
const $q = useQuasar();

function toggleDarkMode() {
  $q.dark.toggle();
}

function minimize() {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.minimize();
  }
}

function toggleMaximize() {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.toggleMaximize();
  }
}

function closeApp() {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.close();
  }
}
</script>

<template>
  <q-header class="q-electron-drag title__bar">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="store.toggleLeftDrawer"
      />

      <q-toolbar-title> Форма </q-toolbar-title>

      <q-toggle
        v-model="darkMode"
        class="q-mr-sm q-electron-drag--exception"
        dense
        color="grey-9"
        label="Тёмный режим"
        @click="toggleDarkMode"
      />

      <q-btn dense flat icon="minimize" @click="minimize" />
      <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
      <q-btn dense flat icon="close" @click="closeApp" />
    </q-toolbar>
  </q-header>
</template>
