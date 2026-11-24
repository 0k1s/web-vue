<script setup>
import { computed } from 'vue';
import { Columns2, Grid2x2, List, RectangleVertical } from 'lucide-vue-next';
import { useMediaQuery } from '../composables/useMediaQuery';

// Переключатель вида каталога (v-model).
// grid-large: 1 колонка на телефоне / 2 на ПК; grid-small: 2 на телефоне / 4 на ПК
defineProps({ modelValue: { type: String, required: true } });
const emit = defineEmits(['update:modelValue']);

const isDesktop = useMediaQuery('(min-width: 768px)');

// подписи и иконки зависят от ширины экрана
const options = computed(() =>
  isDesktop.value
    ? [
        { id: 'list', label: 'Списком', icon: List },
        { id: 'grid-large', label: 'Сетка по 2 столбца', icon: Columns2 },
        { id: 'grid-small', label: 'Сетка по 4 столбца', icon: Grid2x2 },
      ]
    : [
        { id: 'list', label: 'Списком', icon: List },
        { id: 'grid-large', label: 'Сетка в 1 столбец', icon: RectangleVertical },
        { id: 'grid-small', label: 'Сетка в 2 столбца', icon: Columns2 },
      ]
);
</script>

<script>
export const VIEWS = ['list', 'grid-large', 'grid-small'];
</script>

<template>
  <div class="view-switcher" role="radiogroup" aria-label="Вид каталога">
    <button
      v-for="o in options"
      :key="o.id"
      type="button"
      role="radio"
      :aria-checked="modelValue === o.id"
      :title="o.label"
      :aria-label="o.label"
      :class="['view-switcher__btn', { 'view-switcher__btn_active': modelValue === o.id }]"
      @click="emit('update:modelValue', o.id)"
    >
      <component :is="o.icon" :size="18" />
    </button>
  </div>
</template>
