<script setup>
import { ref } from "vue";
import PageLink from "components/PageLink.vue";
import { useQuasar } from "quasar";

const linksList = [
  {
    title: "Создать",
    caption: "Создание формы",
    icon: "post_add",
    to: "/CreateFormPage",
  },
  {
    title: "Редактировать",
    caption: "Редактирование формы",
    icon: "create",
    to: "/EditFormPage",
  },
  {
    title: "Использовать",
    caption: "Создание объекта по форме",
    icon: "description",
    to: "/CreateObjectPage",
  },
  {
    title: "Изменить",
    caption: "Измение содержания объекта",
    icon: "edit_document",
    to: "/EditObjectPage",
  },
  // tms
];

const leftDrawerOpen = ref(false);
const pageLinks = ref(linksList);
const darkMode = ref(false);
const $q = useQuasar();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleDarkMode() {
  $q.dark.toggle();
}

function minimize() {
  if (process.env.MODE === "electron") {
    window.myWindowAPI.minimize();
  }
}

function toggleMaximize() {
  if (process.env.MODE === "electron") {
    window.myWindowAPI.toggleMaximize();
  }
}

function closeApp() {
  if (process.env.MODE === "electron") {
    window.myWindowAPI.close();
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-electron-drag title__bar">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Проект Сатурна </q-toolbar-title>

        <q-toggle
          class="q-mr-sm q-electron-drag--exception"
          dense
          v-model="darkMode"
          @click="toggleDarkMode"
          color="grey-9"
          label="Тёмный режим"
        />

        <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
        <q-btn dense flat icon="close" @click="closeApp" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      behavior="mobile"
      class="q-electron-drag--exception q__drawer"
    >
      <q-list>
        <q-item-label header> Возможности </q-item-label>

        <PageLink v-for="link in pageLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container class="">
      <transition name="slide" mode="out-in">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </transition>
    </q-page-container>
  </q-layout>
</template>

<style>
body.body--light {
  color: #202020;
  background-color: #f3f3f3;
}

.body--light .title__bar {
  color: #738b9c;
  background-color: #dddddd;
}

.body--light main .q-btn {
  color: #ffffff;
  background-color: #d2d2d2;
}

.body--light .q__drawer {
  background-color: #f3f3f3;
}

body.body--dark {
  color: #e2e2e2;
}

.body--dark .title__bar {
  color: #e4e4d5;
  background-color: #252526;
}

.body--dark main .q-btn {
  color: #e4e4d5;
  background-color: #252526;
}

.body--dark .q__drawer {
  background-color: #333333;
}

.body--dark .q__drawer .q-item__section {
  color: #9b9b9b;
}

.body--dark .q__drawer .q-router-link--active .q-item__section {
  color: #fafafa;
}
</style>
