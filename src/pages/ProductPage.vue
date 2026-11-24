<script setup>
import { computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Star } from 'lucide-vue-next';
import { getCategory, getProduct, products } from '../data/products';
import { useCart } from '../stores/cart';
import { formatPrice } from '../utils/format';
import AddToCart from '../components/AddToCart.vue';
import FavoriteButton from '../components/FavoriteButton.vue';
import ProductCard from '../components/ProductCard.vue';
import ProductImage from '../components/ProductImage.vue';
import NotFoundPage from './NotFoundPage.vue';

const route = useRoute();
const router = useRouter();
const cart = useCart();

// id из адреса /product/:id. Страница пересоздаётся для каждого адреса (:key в App.vue)
const product = getProduct(route.params.id);
const category = product && getCategory(product.category);
const related = product ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : [];

watchEffect(() => {
  document.title = product ? `${product.name} — Чайная лавка` : 'Товар не найден — Чайная лавка';
});

// откуда пришли — это записал useProductLink в state истории браузера
const { backTo, backSteps } = window.history.state ?? {};

const backLabel = computed(() => {
  if (!backSteps) return `К разделу «${category?.name}»`;
  if (backTo.startsWith('/cart')) return 'Назад в корзину';
  if (backTo.startsWith('/favorites')) return 'Назад в избранное';
  if (backTo.startsWith('/catalog')) return 'Назад к каталогу';
  if (backTo === '/') return 'На главную';
  return 'Назад';
});

// router.go(-backSteps) возвращает на тот же адрес с фильтрами, а scrollBehavior — прокрутку.
// Открыли по прямой ссылке — ведём в раздел каталога.
function goBack() {
  if (backSteps) router.go(-backSteps);
  else router.push(`/catalog/${category.id}`);
}
</script>

<template>
  <NotFoundPage v-if="!product" />
  <div v-else class="product wrapper fade-in">
    <button type="button" class="product__back" @click="goBack">
      <ArrowLeft :size="18" />
      {{ backLabel }}
    </button>

    <div class="grid gap-8 md:grid-cols-2">
      <ProductImage :product="product" size="lg" />
      <div>
        <RouterLink :to="`/catalog/${category.id}`" class="product__category">{{ category.name }}</RouterLink>
        <h1 class="product__title">{{ product.name }}</h1>
        <div class="rating"><Star :size="18" class="rating__star" /> {{ product.rating }}</div>
        <p class="product__desc">{{ product.description }}</p>
        <ul class="product__props">
          <li v-if="product.weight">Вес: {{ product.weight }} г</li>
          <li>Артикул: TEA-{{ String(product.id).padStart(4, '0') }}</li>
          <li>В наличии</li>
        </ul>
        <div class="product__price">{{ formatPrice(product.price) }}</div>
        <div class="product__buy">
          <AddToCart :product="product" size="lg" />
          <FavoriteButton :product="product" variant="wide" size="lg" />
          <RouterLink v-if="cart.qtyOf(product.id)" to="/cart" class="btn btn_variant_ghost btn_size_lg">Перейти в корзину</RouterLink>
        </div>
      </div>
    </div>

    <section v-if="related.length" class="section">
      <h2 class="section__title">Похожие товары</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="p in related" :key="p.id" :product="p" />
      </div>
    </section>
  </div>
</template>
