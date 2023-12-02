<script setup>
import { ref, watch } from 'vue';
import { useVariablesTableStore } from 'src/stores/variablesTableStore';
import CreateFormPage from './CreateFormPage.vue';
import validateForm from '/src/ts/formJsonValidation';
import DragDropUploader from 'components/ui/DragDropUploader.vue';

const uploadedFile = ref(null);
const formData = ref(null);
const variables = useVariablesTableStore();

function readFile(files) {
  const fr = new FileReader();

  fr.onload = (e) => {
    const result = JSON.parse(e.target.result);
    if (validateForm(result)) {
      variables.$patch({
        tableData: result.variables,
      });
      delete result['variables'];
      formData.value = result;
    } else {
      $q.notify({
        message: 'Загруженный файл не относится к форме',
      });
      return;
    }
  };
  fr.readAsText(files);
}

watch(uploadedFile, () => {
  readFile(uploadedFile.value);
});
</script>

<template>
  <q-page class="q-mx-md" style="word-break: break-word">
    <div class="column">
      <transition name="slide" mode="out-in">
        <div v-if="!formData" class="full-width">
          <h3 class="text-center">Выберите форму</h3>
          <DragDropUploader
            v-model="uploadedFile"
            label="Загрузите форму для редактирования"
            class=""
          />
        </div>
        <CreateFormPage v-else v-bind="formData" />
      </transition>
    </div>
  </q-page>
</template>

<style scoped>
h3 {
  word-break: break-word;
  text-align: center;
}
</style>
