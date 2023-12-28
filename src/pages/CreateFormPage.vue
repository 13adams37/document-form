<script setup>
import { reactive, ref, watch, onUnmounted } from 'vue';
import { useFormDataStore } from 'src/stores/formDataStore';
import { useQuasar } from 'quasar';
import { pick as _pick, map as _map } from 'lodash';
import { useFileSystemAccess } from '@vueuse/core';
import TabButtons from 'components/common/TabButtons.vue';
import VTable from 'components/ui/VTable.vue';
import validateForm from 'src/ts/formJsonValidation';

const panelName = ref('name'),
  tabPanel = ref(null),
  $q = useQuasar(),
  nameRef = ref(null),
  allowedPanels = reactive(new Set()),
  formStore = useFormDataStore(),
  goPreviousTab = () => tabPanel.value.previous();

const res = useFileSystemAccess({
  types: [
    {
      description: 'JSON',
      accept: {
        'application/json': ['.json'],
      },
    },
  ],
  excludeAcceptAllOption: true,
});

if (validateForm(formStore.$state) && formStore.name) {
  allowedPanels.add('name');
  allowedPanels.add('content');
}

function goNextTab() {
  if (allowedPanels.has(panelName.value)) {
    tabPanel.value.next();
  } else if (panelName.value === 'name') {
    nameRef.value.validate();
  } else if (panelName.value === 'content') {
    $q.notify({
      message: 'Нет данных',
    });
  } else {
    throw new Error('Unknown tab.');
  }
}

function save() {
  const data = {
    name: formStore.name,
    comment: formStore.comment,
    variables: formStore.variables,
    paths: formStore.paths.map((file) => _pick(file, ['name', 'path'])),
  };

  if (process.env.MODE === 'electron') {
    window.myWindowAPI
      .saveFile(JSON.stringify(data), formStore.name.trim().split(' ').join(''))
      .then((result) => {
        if (result) {
          $q.notify({
            message: 'Файл успешно сохранён',
          });
        } else {
          $q.notify({
            message: 'Ошибка при сохранении',
          });
        }
      })
      .catch((err) => {
        console.log(err);
        $q.notify({
          message: 'Непредвиденная ошибка при сохранении',
        });
      });
  } else {
    res.data.value = JSON.stringify(data);
    res.saveAs({ suggestedName: data.name });
  }
}

watch(formStore.variables, () => {
  if (formStore.variables.length) {
    formStore.variables.forEach((value) => {
      value.name && value.text
        ? allowedPanels.add('content')
        : allowedPanels.delete('content');
    });
  } else {
    allowedPanels.delete('content');
  }
});

onUnmounted(() => {
  useFormDataStore().$reset();
});
</script>

<template>
  <q-page>
    <div class="q-mx-md">
      <q-tabs
        v-model="panelName"
        dense
        align="justify"
        narrow-indicator
        inline-label
        outside-arrows
        mobile-arrows
      >
        <q-tab name="name" label="Название" />
        <q-tab
          :disable="allowedPanels.has('name') ? false : true"
          name="content"
          label="Содержание"
        />
        <q-tab
          :disable="
            allowedPanels.has('content') && allowedPanels.has('name')
              ? false
              : true
          "
          name="path"
          label="Файлы"
        />
      </q-tabs>

      <q-separator />
    </div>

    <div class="justify-center">
      <q-tab-panels ref="tabPanel" v-model="panelName" animated>
        <q-tab-panel
          id="namePanel"
          class="column items-center overflow-hidden"
          name="name"
        >
          <q-input
            class="q-mb-md"
            name="name"
            label="Название формы"
            ref="nameRef"
            v-model="formStore.name"
            :rules="[(val) => !!val || 'Поле обязательно']"
            @update:model-value="
              (value) =>
                value ? allowedPanels.add('name') : allowedPanels.delete('name')
            "
            clearable
            outlined
          />

          <q-input
            label="Комментарий"
            v-model="formStore.comment"
            outlined
            autogrow
          />

          <TabButtons displayButtons="next" v-on="{ next: goNextTab }" />
        </q-tab-panel>

        <q-tab-panel class="column items-center overflow-hidden" name="content">
          <VTable />

          <TabButtons
            displayButtons="both"
            v-on="{ next: goNextTab, prev: goPreviousTab }"
          />
        </q-tab-panel>

        <q-tab-panel class="column items-center overflow-hidden" name="path">
          <q-file
            v-model="formStore.paths"
            label="Выберите файлы"
            accept=".docx"
            outlined
            multiple
            append
            use-chips
          />

          <q-btn
            v-if="formStore.paths.length > 0"
            class="q-mt-md text-weight-bold"
            label="Сохранить"
            @click="save"
          />

          <TabButtons displayButtons="prev" v-on="{ prev: goPreviousTab }" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<style lang="scss">
.q-tabs__content--align-justify .q-tab,
.q-tabs__content {
  flex: 1 1 0;
}

body.screen--xs .q-tab-panels .q-field {
  width: 100%;
}

.q-tab-panels .q-field {
  width: 65%;
}

.body--light .q-tab {
  color: #738b9c;
}

.body--light .q-field__control {
  color: #95afc1;
}

.body--light .q-tab-panels {
  background-color: $light-body;
}

.body--light .q-card {
  background: $light-drawer;
}

.body--dark .q-field__control {
  // color: $light-body;
  color: $dark-text;
}

.body--dark .q-tab-panels {
  background-color: $dark-page;
}

.body--dark .q-card--dark {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
  background-color: $dark-page;
}
</style>
