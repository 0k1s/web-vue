<script setup>
import { computed } from 'vue';
import { Heart } from 'lucide-vue-next';
import { useFavorites } from '../stores/favorites';
import { useShopActions } from '../composables/useShopActions';

// Сердечко «Избранное». Нажали — товар добавлен (сердце закрашено), ещё раз — убран.
// variant: round — круглая кнопка на фото карточки; wide — кнопка с текстом.
const props = defineProps({
  product: { type: Object, required: true },
  variant: { type: String, default: 'round' },
  size: { type: String, default: '' },
});

const favorites = useFavorites();
const { toggleFavorite } = useShopActions();
const active = computed(() => favorites.has(props.product.id)); // в избранном или нет
const label = computed(() => (active.value ? 'Убрать из избранного' : 'Добавить в избранное'));
</script>

<template>
  <button
    type="button"
    :class="[
      'favorite',
      `favorite_variant_${variant}`,
      { favorite_active: active },
      variant === 'wide' && ['btn btn_variant_ghost', size && `btn_size_${size}`],
    ]"
    :aria-pressed="active"
    :aria-label="variant === 'round' ? label : undefined"
    :title="label"
    @click="toggleFavorite(product)"
  >
    <!-- :key — при смене состояния иконка пересоздаётся и заново проигрывает анимацию -->
    <Heart :key="String(active)" class="favorite__icon" :size="variant === 'round' ? 20 : 18" :fill="active ? 'currentColor' : 'none'" />
    <span v-if="variant === 'wide'">{{ active ? 'В избранном' : 'В избранное' }}</span>
  </button>
</template>
