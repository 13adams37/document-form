<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const step = ref(1);
</script>

<template>
  <q-page class="q-mx-md column">
    <div class="column items-center">
      <h3 class="q-my-md">Приложение создания и использования форм</h3>

      <q-stepper
        class="column"
        v-model="step"
        :active-color="!$q.dark.mode ? 'grey-10' : 'grey-2'"
        :done-color="!$q.dark.mode ? 'grey-9' : 'grey-4'"
        :inactive-color="!$q.dark.mode ? 'grey-7' : 'grey-5'"
        active-icon="none"
        header-nav
        animated
        vertical
        flat
      >
        <q-step
          :name="1"
          title="Создавайте форму"
          icon="post_add"
          :done="step > 1"
        >
          <div class="q-mb-xs">
            Создайте форму документа для последующего её заполнения.
          </div>

          <div>
            В используемых документах должны быть созданы переменные в тексте
            для заполнения.
            <div>
              Пример: В документе &#123;&#123;название_переменной&#125;&#125;
              описано ...
              <div>
                После заполнения поля на "пример" в экспортированном документе
                текст будет: В документе пример описано ...
              </div>
            </div>
          </div>
          <div class="q-mt-xs">
            Ограничения: В одном параграфе не более 4 переменных. Использование
            только формата docx.
          </div>
          <q-stepper-navigation>
            <q-btn @click="step = 2" label="Продолжить" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="Редактируйте форму"
          caption=""
          icon="create"
          :done="step > 2"
        >
          <div class="">Редактируйте созданную или использованную форму.</div>

          <q-stepper-navigation>
            <q-btn @click="step = 3" label="Продолжить" />
            <q-btn flat @click="step = 1" label="Назад" class="q-ma-sm" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="3"
          title="Используйте форму"
          caption=""
          icon="description"
          :done="step > 3"
        >
          <div>
            Загрузите новую или уже использованную форму для заполнения полей.
          </div>
          <div>
            Если вы загрузили использованную форму, все заполненные поля
            автоматически подставляются.
          </div>
          <div class="q-mt-sm">
            При вводе текста в поле можно использовать переменные
            "&#123;&#123;название_переменной&#125;&#125;".
          </div>

          <q-stepper-navigation>
            <q-btn @click="step = 4" label="Продолжить" />
            <q-btn flat @click="step = 2" label="Назад" class="q-ma-sm" />
          </q-stepper-navigation>
        </q-step>

        <q-step :name="4" title="Сохраняйте форму и файлы" icon="save_as">
          <div>Сохраните созданную форму.</div>
          <div>
            Сохранение после использования формы происходит в выбранной папке,
            при сохранении создаются документы и копия формы с заполненными
            полями, которые вы можете использовать повторно.
          </div>
          <q-stepper-navigation>
            <q-btn label="Закрыть" @click="step = 0" />
            <q-btn flat @click="step = 3" label="Назад" class="q-ma-sm" />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
h1 {
  word-break: break-word;
  text-align: center;
}

h3 {
  font-size: min(max(1rem, 8vw), 3rem);
  line-height: normal;
  word-break: break-word;
  text-align: center;
}

body.body--dark .q-stepper--vertical {
  color: #e2e2e2;
  background-color: $dark-page;
}

body.body--light .q-stepper--vertical {
  color: #202020;
  background-color: $light-body;
}

body.screen--xs .q-stepper--vertical {
  width: 100%;
}

.q-stepper--vertical {
  width: 75%;
}
</style>
