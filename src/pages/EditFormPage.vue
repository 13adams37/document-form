<script setup>
import { ref, watch } from 'vue';
import { useFormDataStore } from 'src/stores/formDataStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import validateForm from '/src/ts/formJsonValidation';
import DragDropUploader from 'components/ui/DragDropUploader.vue';

const uploadedFile = ref(null);
const formData = useFormDataStore();
const router = useRouter();
const $q = useQuasar();

function readFile(files) {
  const fr = new FileReader();

  fr.onload = (e) => {
    const result = JSON.parse(e.target.result);
    if (validateForm(result)) {
      formData.$patch(result);
      router.push({
        path: '/CreateFormPage',
      });
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
  <q-page class="q-mx-md column" style="word-break: break-word">
    <div>
      <h3 class="text-center">Выберите форму</h3>
      <DragDropUploader
        v-model="uploadedFile"
        label="Загрузите форму для редактирования"
        class=""
      />
    </div>
  </q-page>
</template>

<style scoped>
h3 {
  font-size: min(max(1rem, 8vw), 3rem);
  line-height: normal;
}
</style>
