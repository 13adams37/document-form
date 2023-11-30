<script setup>
import { watch, ref } from 'vue';
import { useQuasar } from 'quasar';

const { modelValue } = defineProps({
  modelValue: [File, String],
  label: String,
  id: String,
});

const emits = defineEmits(['update:modelValue']);
const value = ref(modelValue);
const $q = useQuasar();

const uploadFile = (e) => {
  const [file] = e.target.files;
  value.value = file;
};

function onDragEnter(e) {
  e.target.classList.add('drag-enter');
}

function onDragLeave(e) {
  e.target.classList.remove('drag-enter');
}

function onDragOver(e) {
  e.preventDefault();
}

function onDrop(e) {
  e.preventDefault();

  if (e.dataTransfer.items) {
    if ([...e.dataTransfer.items].length === 1) {
      [...e.dataTransfer.items].forEach((item, i) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();

          if (file.type === 'application/json') {
            value.value = file;
          } else {
            $q.notify({
              message: 'Тип файла не подходит к форме',
              color: 'none',
            });
          }
        }
      });
    } else {
      $q.notify({
        message: 'Загрузите только один файл с формой',
        color: 'none',
      });
    }
  }

  onDragLeave(e);
}

watch(value, () => {
  emits('update:modelValue', value.value);
});
</script>

<template>
  <div
    class="uploader"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <label class="uploader__label">
      {{ label }}

      <div class="uploader__content" style="pointer-events: none">
        <svg
          class="uploader__icon"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p class="uploader__text">
          <span class="text-weight-bold">Нажмите для загрузки </span> или
          перенесите файл
        </p>
      </div>

      <input
        class="hidden"
        type="file"
        accept="application/json"
        @change="uploadFile"
      />
    </label>
  </div>
</template>

<style lang="scss">
.drag-enter {
  outline-style: dashed;
  overflow: auto;
}

.uploader {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  position: absolute;
  margin-bottom: 20px;

  &__label {
    border-width: 2px;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    width: 100%;
    height: 16rem;
    display: flex;
    border-style: dashed;
    border-radius: 8px;
    justify-content: center;
  }

  &__content {
    align-items: center;
    flex-direction: column;
    display: flex;
    padding-bottom: 24px;
    padding-top: 20px;
    justify-content: center;
  }

  &__icon {
    width: 2rem;
    height: 2rem;
    margin-bottom: 16px;
    display: block;
  }

  &__text {
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-bottom: 8px;
  }

  &__files {
    font-size: 0.75rem;
    line-height: 1rem;
    margin: 0;
  }
}

.body--light .uploader {
  &__label {
    border-color: #c7cbd2;
  }
}

.body--dark .uploader {
  &__label {
    border-color: #323232;
  }
}
</style>
