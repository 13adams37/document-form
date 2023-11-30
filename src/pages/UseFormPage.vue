<script setup>
import DragDropUploader from 'components/ui/DragDropUploader.vue';
import VariableInputs from 'src/components/ui/VariableInputs.vue';
import validateForm from '/src/ts/formJsonValidation';
import { useVariablesFillStore } from 'src/stores/variablesFillStore';
import { ref, watch, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const uploadedFile = ref(null);
const formData = ref(null);
const { variables } = useVariablesFillStore();

function replaceVariables() {
  window.myWindowAPI
    .variablesFilePatcher(
      JSON.stringify(variables.value),
      JSON.stringify(formData.value.paths)
    )
    .then((result) => {
      if (result) {
        $q.notify({
          message: 'Файл успешно сохранён',
          color: 'none',
        });
      } else {
        $q.notify({
          message: 'Ошибка при сохранении',
          color: 'none',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      $q.notify({
        message: 'Непредвиденная ошибка при сохранении',
        color: 'none',
      });
    });
}

function addKeyValue(list, key, value) {
  var temp = list;
  temp.forEach((element) => {
    element[key] = value;
  });
  return temp;
}

function readFile(files) {
  const fr = new FileReader();

  fr.onload = (e) => {
    const result = JSON.parse(e.target.result);
    if (validateForm(result)) {
      variables.value = addKeyValue(result.variables, 'value', '');
      delete result['variables'];
      formData.value = result;
    } else {
      $q.notify({
        message: 'Загруженный файл не относится к форме',
        color: 'none',
      });
      return;
    }
  };
  fr.readAsText(files);
}

watch(uploadedFile, () => {
  readFile(uploadedFile.value);
});

onUnmounted(() => {
  useVariablesFillStore().$reset();
});
</script>

<template>
  <q-page class="q-mx-md" style="word-break: break-word">
    <div class="column">
      <transition name="slide" mode="out-in">
        <!-- :duration="{ enter: 100, leave: 1000 }" -->
        <div v-if="!formData" class="full-width">
          <h3 class="text-center">Выберите форму</h3>
          <DragDropUploader
            v-model="uploadedFile"
            label="Загрузите форму"
            class=""
          />
        </div>

        <div v-else class="column items-center">
          <h3 class="text-center">{{ formData.name }}</h3>
          <span class="text-center text-body2 q-mb-md" style="white-space: pre">
            {{ formData.comment }}
          </span>
          <VariableInputs />
          <q-btn
            class="text-weight-bold q-mt-md"
            label="Продолжить"
            @click="replaceVariables()"
          />
        </div>
      </transition>
    </div>
  </q-page>
</template>

<style scoped>
.q-btn {
  width: auto;
}

h3 {
  font-size: min(max(1rem, 8vw), 3rem);
  line-height: normal;
}
</style>
