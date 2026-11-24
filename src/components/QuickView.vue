<script setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Star } from 'lucide-vue-next';
import { getCategory, getProduct } from '../data/products';
import { closeQuickView, ui } from '../stores/ui';
import { formatPrice } from '../utils/format';
import AddToCart from './AddToCart.vue';
import AppModal from './AppModal.vue';
import FavoriteButton from './FavoriteButton.vue';
import ProductImage from './ProductImage.vue';
import ProductLink from './ProductLink.vue';

// Быстрый (предварительный) просмотр товара. Стоит один раз в App.vue,
// открывается из любой карточки через openQuickView(id).
const product = computed(() => (ui.quickViewId ? getProduct(ui.quickViewId) : null));

// ушли на другую страницу (например, кнопкой «Назад» браузера) — окно закрываем
const route = useRoute();
watch(() => route.fullPath, closeQuickView);
</script>

<template>
  <AppModal v-if="product" class="quick-view" :label="product.name" @close="closeQuickView">
    <div class="grid gap-6 md:grid-cols-[5fr_7fr]">
      <ProductImage :key="product.id" :product="product" size="lg" />
      <div>
        <div class="quick-view__category">{{ getCategory(product.category).name }}</div>
        <h3 class="quick-view__title">{{ product.name }}</h3>
        <div class="rating"><Star :size="16" class="rating__star" /> {{ product.rating }}</div>
        <p>{{ product.description }}</p>
        <div class="quick-view__price">{{ formatPrice(product.price) }}</div>
        <div class="flex flex-wrap items-center gap-2">
          <AddToCart :product="product" />
          <FavoriteButton :product="product" variant="wide" />
          <ProductLink :id="product.id" class="btn btn_variant_ghost" @navigate="closeQuickView">Подробнее</ProductLink>
        </div>
      </div>
    </div>
  </AppModal>
</template>
