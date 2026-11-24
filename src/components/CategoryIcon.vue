<script setup>
import { Coffee, Disc3, Flower2, Leaf, Sprout } from 'lucide-vue-next';
import TeapotIcon from './TeapotIcon.vue';

// Иконка категории. component :is рисует компонент, который лежит в переменной.
const icons = { green: Leaf, black: Coffee, oolong: Sprout, puer: Disc3, herbal: Flower2, teaware: TeapotIcon };

defineProps({ id: { type: String, required: true } });
</script>

<template>
  <component :is="icons[id] ?? Leaf" aria-hidden="true" />
</template>
