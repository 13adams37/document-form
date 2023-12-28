<script setup>
import { ref, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useFormDataStore } from 'src/stores/formDataStore';
import Sortable from 'sortablejs';

const $q = useQuasar();
const show_dialog = ref(false);
const editedIndex = ref(-1);
const nameRef = ref(null);
const textRef = ref(null);

const defaultItem = ref({
  name: '',
  text: '',
  value: '',
});

const editedItem = ref({
  name: '',
  text: '',
  value: '',
});

const formStore = useFormDataStore();
const tableData = formStore.variables;
const instance = getCurrentInstance().proxy;
let sortable;

const columns = [
  {
    name: 'drag-handle',
    label: '',
    align: 'left',
    field: 'drag-handle',
  },
  {
    name: 'name',
    required: true,
    label: 'Название переменной',
    align: 'center',
    field: (row) => row.name,
  },
  {
    name: 'text',
    required: true,
    label: 'Отображаемый текст',
    align: 'center',
    field: (row) => row.text,
  },
  {
    name: 'actions',
    label: 'Действия',
    field: 'actions',
  },
];

function moveItemInArray(array, fromIndex, toIndex) {
  function clamp(value, max) {
    return Math.max(0, Math.min(max, value));
  }

  const from = clamp(fromIndex, array.length - 1);
  const to = clamp(toIndex, array.length - 1);

  if (from === to) {
    return;
  }

  const target = array[from];
  const delta = to < from ? -1 : 1;

  for (let i = from; i !== to; i += delta) {
    array[i] = array[i + delta];
  }

  array[to] = target;
}

function addRow() {
  nameRef.value.validate();
  textRef.value.validate();
  if (!nameRef.value.hasError && !textRef.value.hasError) {
    if (editedIndex.value > -1) {
      Object.assign(tableData[editedIndex.value], editedItem.value);
    } else {
      tableData.push(editedItem.value);
    }
    close();
  }
}

function deleteItem(item) {
  $q.dialog({
    title: 'Подтверждение',
    message: `Вы действительно хотите удалить ${item.name}?`,
    class: 'text-center',
    ok: {
      flat: true,
      color: 'none',
      label: 'Да',
    },
    cancel: {
      flat: true,
      color: 'none',
      label: 'Нет',
    },
    persistent: true,
  }).onOk(() => {
    tableData.splice(tableData.indexOf(item), 1);
  });
}

function editItem(item) {
  editedIndex.value = tableData.indexOf(item);
  editedItem.value = Object.assign({}, item);
  show_dialog.value = true;
}

function close() {
  show_dialog.value = false;
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  }, 300);
}

onMounted(() => {
  const tableBody = instance.$el.querySelector('.q-table > tbody');
  sortable = Sortable.create(tableBody, {
    handle: '.drag-handle',
    animation: 150,
    onUpdate({ oldIndex, newIndex }) {
      moveItemInArray(tableData, oldIndex, newIndex);
    },
  });
});

onUnmounted(() => {
  sortable.destroy();
});
</script>

<template>
  <div class="q-pa-sm q-gutter-sm" style="width: 100%">
    <q-table
      flat
      bordered
      title="Переменные"
      :rows="tableData"
      :columns="columns"
      row-key="name"
      :rows-per-page-options="[0]"
      no-data-label="Нет данных"
      hide-pagination
    >
      <template #top>
        <q-btn
          class="text-weight-bold q-pa-sm"
          dense
          label="Добавить"
          @click="show_dialog = true"
        />

        <div class="q-pa-sm q-gutter-sm">
          <q-dialog v-model="show_dialog" @before-hide="close">
            <q-card>
              <q-card-section>
                <div class="text-h6 text-center">Действие</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <q-input
                    class="q-mr-xs full-width"
                    ref="nameRef"
                    v-model="editedItem.name"
                    label="Название переменной"
                    :rules="[
                      (val) => !!val || 'Поле обязательно',
                      (val) =>
                        (editedIndex > -1 &&
                          tableData[editedIndex].name == val) ||
                        tableData.every((row) => row.name != val) ||
                        `Переменная '${val}' уже существует`,
                    ]"
                    autogrow
                  />

                  <q-space />

                  <q-input
                    class="full-width"
                    ref="textRef"
                    v-model="editedItem.text"
                    label="Отображаемый текст"
                    :rules="[(val) => !!val || 'Поле обязательно']"
                    autogrow
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  flat
                  label="OK"
                  v-close-popup="!show_dialog"
                  @click="addRow"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </template>

      <template #body-cell-drag-handle="props">
        <q-td key="drag-handle" :props="props">
          <q-icon name="drag_handle" class="drag-handle" />
        </q-td>
      </template>
      <template #body-cell-name="props">
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
      </template>
      <template #body-cell-text="props">
        <q-td key="text" :props="props">
          {{ props.row.text }}
          <q-popup-edit v-model="props.row.text">
            <q-input v-model="props.row.text" dense autofocus autogrow />
          </q-popup-edit>
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td key="actions" :props="props">
          <q-btn
            class="q-mr-xs"
            @click="editItem(props.row)"
            size="sm"
            icon="edit"
          />
          <q-btn icon="delete" @click="deleteItem(props.row)" size="sm" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<style>
.q-table__container .q-table__top {
  justify-content: center;
}

.body--light .q-table__card {
  color: #00000099;
  background-color: #e3e3e3;
}

tr > th.text-center {
  white-space: break-spaces;
}

tr > td.text-center {
  white-space: break-spaces;
  word-break: break-all;
}

.drag-handle {
  cursor: move;
  cursor: -webkit-grabbing;
}
</style>
