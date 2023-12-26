<script setup>
import { useVariablesFillStore } from 'src/stores/variablesFillStore';
import { ref, onUnmounted } from 'vue';
import { QFile, useQuasar } from 'quasar';
import DragDropUploader from 'components/ui/DragDropUploader.vue';
import VariableInputs from 'src/components/ui/VariableInputs.vue';
import validateForm from '/src/ts/formJsonValidation';
import filePatcher from 'src/ts/filePatcher';
import JSZip from 'jszip';
import saveAs from 'file-saver';

const $q = useQuasar();
const uploadedFile = ref(null);
const uploadedContent = ref([]); // user`s uploaded templates (docx)
const filesToUpload = ref([]);
const uploadedResult = ref(null);
const uploderDialog = ref(null);
const formData = ref(null);
const { variables } = useVariablesFillStore();

function replaceVariables() {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI
      .variablesFilePatcher(JSON.stringify(formData.value))
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
          message: 'Ошибка при сохранении,\nфайл возможно защищён от записи',
        });
      });
  } else {
    filePatcher(formData.value, uploadedContent.value)
      .then((result) => {
        console.log(result);
        var zip = new JSZip();
        const folder = zip.folder(formData.value.name);
        for (const res of result) {
          console.log(res);
          folder.file(res.name, res.data);
        }
        folder.file(
          `${formData.value.name}.json`,
          JSON.stringify(formData.value)
        );
        zip.generateAsync({ type: 'blob' }).then(function (content) {
          saveAs(content, `${formData.value.name}.zip`);
        });
        $q.notify({
          message: 'Файл успешно сохранён',
        });
      })
      .catch((err) => {
        console.log(err);
        $q.notify({
          message: 'Ошибка при работе сохранении',
        });
      });
  }
}

function readFile(files) {
  const fr = new FileReader();

  fr.onload = (e) => {
    const result = JSON.parse(e.target.result);
    uploadedResult.value = result;
    if (validateForm(result)) {
      variables.value = result.variables;
      if (result.paths.some((obj) => obj.hasOwnProperty('path'))) {
        formData.value = result;
      } else {
        filesToUpload.value = [];
        if (result.paths.length) {
          for (const item of result.paths) {
            filesToUpload.value.push({ name: item.name, status: false });
          }
          uploderDialog.value.toggle();
        }
      }
    } else {
      $q.notify({
        message: 'Загруженный файл не относится к форме',
      });
    }
  };

  fr.readAsText(files);
}

function validateUpload() {
  for (const item of filesToUpload.value) {
    if (uploadedContent.value.some((e) => e.name == item.name)) {
      item.status = true;
    } else {
      item.status = false;
    }
  }
  if (filesToUpload.value.every((item) => item.status)) {
    formData.value = uploadedResult.value;
  }
}

onUnmounted(() => {
  useVariablesFillStore().$reset();
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
            label="Загрузите форму"
            @update:model-value="readFile(uploadedFile)"
          />
          <q-dialog ref="uploderDialog" flat>
            <q-card>
              <q-card-section>
                <div class="text-h6 text-center">Загрузите файлы</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                Требуется загрузить следующие файлы:
                <div v-for="item in filesToUpload" class="q-ma-xs">
                  {{ item.name }}
                  <q-checkbox
                    v-model="item.status"
                    checked-icon="done"
                    unchecked-icon="close"
                    color="teal"
                    disable
                    dense
                  />
                </div>
                <div
                  v-if="
                    uploadedContent.length !== 0 &&
                    filesToUpload.length != uploadedContent.length
                  "
                  class="text-red-8"
                >
                  Загружены не все файлы, или их больше
                </div>
                <q-file
                  v-model="uploadedContent"
                  label="Выберите файлы"
                  class="q-mt-md"
                  outlined
                  multiple
                  append
                  use-chips
                  @update:model-value="validateUpload()"
                />
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" @click="uploderDialog.toggle()" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>

        <div v-else class="column items-center">
          <h3 class="text-center text-body2">{{ formData.name }}</h3>
          <span
            class="text-center text-caption q-mb-md"
            style="white-space: pre"
          >
            {{ formData.comment }}
          </span>
          <VariableInputs />
          <q-btn
            class="text-weight-bold q-mb-lg"
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
