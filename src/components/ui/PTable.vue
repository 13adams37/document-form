<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { usePathTableStore } from "stores/pathTableStore";

const $q = useQuasar();
const show_dialog = ref(false);
const editedIndex = ref(-1);
const pathRef = ref(null);

const defaultItem = ref([
  {
    path: "",
  },
]);

const editedItem = ref({
  path: "",
});

// const { tableData } = useVariablesTableStore();
const { pathData } = usePathTableStore();

const columns = [
  {
    name: "path",
    required: true,
    label: "Путь",
    align: "center",
    field: (row) => row.path,
  },
  {
    name: "actions",
    label: "Действия",
    field: "actions",
  },
];

function addRow() {
  pathRef.value.validate();
  if (!pathRef.value.hasError) {
    if (editedIndex.value > -1) {
      Object.assign(pathData[editedIndex.value], editedItem.value);
    } else {
      pathData.push(editedItem.value);
    }
    close();
  }
}

function deleteItem(item) {
  $q.dialog({
    title: "Подтверждение",
    message: `Вы действительно хотите удалить ${item.path}?`,
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
    pathData.splice(pathData.indexOf(item), 1);
  });
}

function editItem(item) {
  editedIndex.value = pathData.indexOf(item);
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
      title="Пути"
      :rows="pathData"
      :columns="columns"
      row-key="name"
      :rows-per-page-options="[0]"
      no-data-label="Нет данных"
      hide-pagination
    >
      <template v-slot:top>
        <q-btn dense label="Добавить" @click="show_dialog = true" />

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
                    ref="pathRef"
                    v-model="editedItem.path"
                    label="Путь"
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
          <q-td key="path" :props="props">
            {{ props.row.path }}
            <q-popup-edit v-model="props.row.path">
              <q-input v-model="props.row.path" dense autofocus />
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
