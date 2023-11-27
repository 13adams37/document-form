<script setup>
import { ref } from 'vue';
import { useLayoutStore } from 'stores/layoutStore';

import PageLink from 'components/common/PageLink.vue';
import ToolBar from 'components/globals/ToolBar.vue';

const linksList = [
  {
    title: 'Создать',
    caption: 'Создание формы',
    icon: 'post_add',
    to: '/CreateFormPage',
  },
  {
    title: 'Редактировать',
    caption: 'Редактирование формы',
    icon: 'create',
    to: '/EditFormPage',
  },
  {
    title: 'Использовать',
    caption: 'Использование по форме',
    icon: 'description',
    to: '/UseFormPage',
  },
  {
    title: 'Изменить',
    caption: 'Измение содержания',
    icon: 'edit_document',
    to: '/EditUsedFormPage',
  },
  // tms link
];

const drawerStore = useLayoutStore();
const pageLinks = ref(linksList);
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <ToolBar />
    <!-- toolbar -->
    <q-drawer
      v-model="drawerStore.leftDrawerOpen"
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
      <router-view v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <q-page-sticky
      v-if="$route.path !== '/'"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn fab icon="home" class="title__bar" to="/" />
    </q-page-sticky>
  </q-layout>
</template>

<style lang="scss">
body.body--light {
  color: $light-text;
  background-color: $light-body;
}

.body--light .title__bar {
  color: #738b9c;
  background-color: #dddddd;
}

.body--light main .q-btn {
  color: #353333;
  background-color: #e0dedc;
}

.body--light .q__drawer {
  background-color: $light-drawer;
}

.body--light .q__drawer .q-separator {
  background-color: #dddddd;
}

.body--light .q__drawer .q-item.q-router-link--active {
  color: inherit;
}

.body--light .q__drawer .q-item {
  color: #575b5f;
}

.q-dark {
  color: $dark-text;
}

body.body--dark {
  color: $light-body;
}

.body--dark .title__bar,
.body--dark main .q-btn {
  // color: #e4e4d5;
  color: $dark-text;
  background-color: #252526;
}

.body--dark .q__drawer {
  background-color: #333333;
}

.body--dark .q__drawer .q-separator {
  background-color: #434040;
}

.body--dark .q__drawer .q-item__section {
  color: #9b9b9b;
}

.body--dark .q__drawer .q-router-link--active .q-item__section {
  color: #fafafa;
}
</style>
