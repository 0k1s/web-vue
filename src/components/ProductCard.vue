<script setup>
import { formatPrice } from '../utils/format';
import { openQuickView } from '../stores/ui';
import AddToCart from './AddToCart.vue';
import FavoriteButton from './FavoriteButton.vue';
import ProductImage from './ProductImage.vue';
import ProductLink from './ProductLink.vue';

// Карточка товара. view: '' — обычная, 'list' — горизонтальная строка
defineProps({
  product: { type: Object, required: true },
  view: { type: String, default: '' },
});
</script>

<template>
  <article :class="['product-card group', view && `product-card_view_${view}`]">
    <span v-if="product.isNew" class="product-card__badge">Новинка</span>
    <div class="product-card__image">
      <ProductLink :id="product.id" tabindex="-1" aria-hidden="true">
        <ProductImage :product="product" />
      </ProductLink>
      <FavoriteButton :product="product" class="product-card__favorite" />
      <button type="button" class="product-card__preview" @click="openQuickView(product.id)">Быстрый просмотр</button>
    </div>
    <div class="product-card__body">
      <ProductLink :id="product.id" class="product-card__title">{{ product.name }}</ProductLink>
      <p class="product-card__desc">{{ product.description }}</p>
      <div class="product-card__footer">
        <span class="product-card__price">{{ formatPrice(product.price) }}</span>
        <AddToCart :product="product" :size="view === 'list' ? '' : 'sm'" class="product-card__buy" />
      </div>
    </div>
  </article>
</template>
