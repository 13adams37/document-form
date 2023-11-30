<script setup>
import CreateFormPage from './CreateFormPage.vue';
import { useVariablesTableStore } from 'src/stores/variablesTableStore';

// testData
function prepareFiles(filesString) {
  let result = [];

  filesString.forEach((fileString) => {
    const emptyFile = new File([''], fileString.name);
    Object.defineProperty(emptyFile, 'path', {
      value: fileString.path,
    });
    result.push(emptyFile);
  });

  return result;
}

const myProps = {
    formName: 'test',
    formComment: 'comment',
    formFiles: prepareFiles([{ name: 'testFile.txt', path: 'relpath//' }]),
  },
  tableData = useVariablesTableStore();

tableData.$patch({
  tableData: [
    { name: 'test_patch', text: 'test_patch named' },
    { name: 'test_patch_second', text: 'test_patch_second named' },
  ],
});
</script>

<template>
  <q-page class="q-mx-md">
    <CreateFormPage v-bind="myProps" />
  </q-page>
</template>

<style scoped>
h3 {
  word-break: break-word;
  text-align: center;
}
</style>
