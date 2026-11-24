<script setup>
import { computed, ref, watch } from 'vue';
import { getCategory } from '../data/products';
import CategoryIcon from './CategoryIcon.vue';

// Фото товара (PNG без фона) на градиенте цвета категории.
// Нет фото или оно не загрузилось — показываем иконку категории.
const props = defineProps({
  product: { type: Object, required: true },
  size: { type: String, default: 'md' }, // sm | md | lg
});

const category = computed(() => getCategory(props.product.category));
const failed = ref(false);
watch(() => props.product.id, () => (failed.value = false)); // другой товар — пробуем фото заново
</script>

<template>
  <div :class="['product-image', `product-image_size_${size}`]" :style="{ '--product-color': category.color }">
    <img
      v-if="product.image && !failed"
      class="product-image__photo"
      :src="product.image"
      :alt="product.name"
      loading="lazy"
      @error="failed = true"
    />
    <CategoryIcon v-else :id="category.id" class="product-image__icon" :stroke-width="1.25" />
  </div>
</template>
