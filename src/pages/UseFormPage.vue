<script setup>
import DragDropUploader from "components/ui/DragDropUploader.vue";
import VariableInputs from "src/components/ui/VariableInputs.vue";
import { useVariablesFillStore } from "src/stores/variablesFillStore";
import { ref, watch, onUnmounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
// import form data, draw fields v-for, get datas from fields, exec ts Word filler, show progressbar, show information window.

// all center "column justify-center items-center content-around"

const uploadedFile = ref(null);
const formData = ref(null);
const { variables } = useVariablesFillStore();

// after uploading validate => set loading state, after loading set page loading state, transition after loading is done.
// upload file => set uploading state => validate ! throw error text => prepare dom elements => render dom elements => transition.

// низкая читаемость инпутов, нужно исправить?

function replaceVariables() {
  console.log(variables.value);
  console.log(formData.value.paths);
  formData.value = null; // to clear
  // replaceVariablesInDocuments ...
}

function addKeyValue(list, key, value) {
  var temp = list;
  console.log("list", list);
  temp.forEach((element) => {
    element[key] = value;
  });
  return temp;
}

function readFile(files) {
  const fr = new FileReader();

  fr.onload = (e) => {
    const result = JSON.parse(e.target.result);
    try {
      variables.value = addKeyValue(result.variables, "value", "");
    } catch (error) {
      $q.notify({
        message: "Загруженный файл не относится к форме.",
        color: "none",
      });
      return false;
    }
    delete result["variables"];
    formData.value = result;
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
</style>