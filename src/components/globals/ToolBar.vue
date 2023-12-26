<script setup>
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useLayoutStore } from 'stores/layoutStore';

const store = useLayoutStore();
const $q = useQuasar();
const darkMode = ref($q.dark.mode);

function toggleDarkMode() {
  $q.dark.toggle();
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.setThemeSetting(!darkMode.value ? 'white' : 'dark');
  } else {
    window.localStorage.setItem('dark', darkMode.value);
  }
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
        :icon="!darkMode ? 'light_mode' : 'dark_mode'"
        v-model="darkMode"
        class="q-mr-md q-electron-drag--exception"
        dense
        color="grey-9"
        @click="toggleDarkMode"
      />

      <div v-if="$q.platform.is.electron === true">
        <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
        <q-btn dense flat icon="close" @click="closeApp" />
      </div>
    </q-toolbar>
  </q-header>
</template>
