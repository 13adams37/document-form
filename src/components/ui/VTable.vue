<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useVariablesTableStore } from "stores/variablesTableStore";

const $q = useQuasar();
const show_dialog = ref(false);
const editedIndex = ref(-1);
const nameRef = ref(null);
const textRef = ref(null);

const defaultItem = ref([
  {
    name: "",
    text: "",
  },
]);

const editedItem = ref({
  name: "",
  text: "",
});

const { tableData } = useVariablesTableStore();

const columns = [
  {
    name: "name",
    required: true,
    label: "Название переменной",
    align: "center",
    field: (row) => row.name,
  },
  {
    name: "text",
    required: true,
    label: "Отображаемый текст",
    align: "center",
    field: (row) => row.text,
  },
  {
    name: "actions",
    label: "Действия",
    field: "actions",
  },
];

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
    title: "Подтверждение",
    message: `Вы действительно хотите удалить ${item.name}?`,
    ok: {
      flat: true,
      color: "none",
      label: "Да",
    },
    cancel: {
      flat: true,
      color: "none",
      label: "Нет",
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
      <template v-slot:top>
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
                    :rules="[(val) => !!val || 'Поле обязательно']"
                  />

                  <q-space />

                  <q-input
                    class="full-width"
                    ref="textRef"
                    v-model="editedItem.text"
                    label="Отображаемый текст"
                    :rules="[(val) => !!val || 'Поле обязательно']"
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

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name">
              <q-input v-model="props.row.name" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="text" :props="props">
            {{ props.row.text }}
            <q-popup-edit v-model="props.row.text">
              <q-input v-model="props.row.text" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              class="q-mr-xs"
              @click="editItem(props.row)"
              size="sm"
              icon="edit"
            />
            <q-btn icon="delete" @click="deleteItem(props.row)" size="sm" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<style>
.q-table__top {
  justify-content: center;
}

.body--light .q-table__card {
  color: #00000099;
  background-color: #e3e3e3;
}
</style>
