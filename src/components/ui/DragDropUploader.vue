<script setup>
import { watch, ref, shallowRef } from "vue";

const emits = defineEmits(["update:modelValue"]);
const value = ref(modelValue);
const newLabel = shallowRef();

const { modelValue } = defineProps({
  modelValue: [File, String],
  label: String,
  id: String,
});

const uploadFile = (e) => {
  const [file] = e.target.files;
  value.value = file;
  newLabel.value = "Загружен файл" + "\n" + value.value.name;
};

watch(value, () => {
  emits("update:modelValue", value.value);
});
</script>

<template>
  <div class="uploader" draggable="true">
    <label style="white-space: pre" class="uploader__label" :for="id">
      {{ newLabel || label }}

      <div class="uploader__content">
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
          <span class="text-weight-bold">Нажмите для загрузки </span>
          <!-- или перенесите файл  -->
          <!-- on future -->
        </p>
        <!-- <p class="uploader__files">SVG, PNG, JPG или GIF</p> -->
      </div>

      <input
        class="hidden"
        :id="id"
        type="file"
        accept="application/json"
        @change="uploadFile"
      />
    </label>
  </div>
</template>

<style lang="scss">
.uploader {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  position: relative;
  margin-bottom: 20px;

  &__label {
    // background-color: rgb(249, 250, 251);
    // background-color: $light-body;
    // border-color: rgb(209, 213, 219);
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
    // color: rgb(107, 114, 128);
    width: 2rem;
    height: 2rem;
    margin-bottom: 16px;
    display: block;
  }

  &__text {
    // color: rgb(107, 114, 128);

    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-bottom: 8px;
    // margin: 0;
  }

  &__files {
    // color: rgb(107, 114, 128);
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
    // border-color: rgb(209, 213, 219);
    border-color: #323232;
  }
}
</style>
