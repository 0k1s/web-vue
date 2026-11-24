<script setup>
import { ShoppingCart, Trash2 } from 'lucide-vue-next';
import { FREE_DELIVERY_FROM, useCart } from '../stores/cart';
import { formatPrice } from '../utils/format';
import ProductImage from '../components/ProductImage.vue';
import ProductLink from '../components/ProductLink.vue';
import QtyControl from '../components/QtyControl.vue';
import FavoriteButton from '../components/FavoriteButton.vue';

const cart = useCart();
const { lines, count, total, delivery, grandTotal } = cart;
</script>

<template>
  <div v-if="!lines.length" class="cart cart_empty wrapper fade-in">
    <ShoppingCart class="cart__empty-icon" :size="96" :stroke-width="1.25" />
    <h1 class="cart__title">Корзина пуста</h1>
    <p class="my-4">Загляните в каталог или в избранное — там много вкусного.</p>
    <div class="flex flex-wrap justify-center gap-2">
      <RouterLink to="/catalog" class="btn btn_variant_primary">В каталог</RouterLink>
      <RouterLink to="/favorites" class="btn btn_variant_ghost">Избранное</RouterLink>
    </div>
  </div>

  <div v-else class="cart wrapper fade-in">
    <h1 class="cart__title">Корзина</h1>
    <div class="cart__layout">
      <div>
        <ul class="cart__list">
          <li v-for="{ product, qty, sum } in lines" :key="product.id" class="cart__item">
            <div class="cart__item-image"><ProductImage :product="product" size="sm" /></div>
            <div class="cart__item-content">
              <div class="cart__item-head">
                <div class="cart__item-info">
                  <ProductLink :id="product.id" class="cart__item-name">{{ product.name }}</ProductLink>
                  <div class="cart__item-price">{{ formatPrice(product.price) }} / шт.</div>
                </div>
                <div class="cart__item-tools">
                  <FavoriteButton :product="product" variant="icon" />
                  <button type="button" class="close cart__item-remove" aria-label="Удалить" @click="cart.remove(product.id)">
                    <Trash2 :size="18" />
                  </button>
                </div>
              </div>
              <div class="cart__item-controls">
                <!-- без v-model: значение приходит из строки корзины, меняется через setQty -->
                <QtyControl size="sm" :model-value="qty" @update:model-value="cart.setQty(product.id, $event)" />
                <div class="cart__item-sum">{{ formatPrice(sum) }}</div>
              </div>
            </div>
          </li>
        </ul>
        <button type="button" class="btn btn_variant_danger btn_size_sm" @click="cart.clear()">Очистить корзину</button>
      </div>
      <aside class="cart__summary">
        <div class="cart__summary-row"><span>Товаров</span><span>{{ count }} шт.</span></div>
        <div class="cart__summary-row"><span>Сумма</span><span>{{ formatPrice(total) }}</span></div>
        <div class="cart__summary-row"><span>Доставка</span><span>{{ delivery ? formatPrice(delivery) : 'бесплатно' }}</span></div>
        <p v-if="delivery" class="cart__hint">До бесплатной доставки — {{ formatPrice(FREE_DELIVERY_FROM - total) }}</p>
        <div class="cart__summary-row cart__summary-row_total"><span>Итого</span><span>{{ formatPrice(grandTotal) }}</span></div>
        <RouterLink to="/checkout" class="btn btn_variant_primary btn_wide mt-4">Оформить заказ</RouterLink>
      </aside>
    </div>
  </div>
</template>
