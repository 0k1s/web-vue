<script setup>
import { useProductLink } from '../composables/useProductLink';

// Ссылка на страницу товара. Обычный клик — переход с запоминанием, откуда пришли
// (см. useProductLink). Ctrl/Cmd/Shift-клик и средняя кнопка — браузер откроет новую вкладку как обычно.
defineOptions({ inheritAttrs: false }); // class и прочие атрибуты кладём на саму ссылку <a>
const props = defineProps({ id: { type: Number, required: true } });
const emit = defineEmits(['navigate']);
const { openProduct } = useProductLink();

function onClick(e) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  emit('navigate'); // например, быстрый просмотр закрывает окно
  openProduct(props.id);
}
</script>

<template>
  <!-- custom: RouterLink не рисует ссылку сам, а отдаёт href — ссылку рисуем мы -->
  <RouterLink :to="{ name: 'product', params: { id } }" custom v-slot="{ href }">
    <a :href="href" v-bind="$attrs" @click="onClick"><slot /></a>
  </RouterLink>
</template>
