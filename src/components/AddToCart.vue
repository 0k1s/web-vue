<script setup>
import { computed } from 'vue';
import { useCart } from '../stores/cart';
import QtyControl from './QtyControl.vue';

// Кнопка «В корзину», которая после добавления превращается в счётчик.
// Уменьшили до 0 — товар убран из корзины, снова кнопка.
const props = defineProps({
  product: { type: Object, required: true },
  size: { type: String, default: '' },
});
const cart = useCart();

// computed с get и set: v-model на счётчике читает и меняет количество в корзине
const qty = computed({
  get: () => cart.qtyOf(props.product.id),
  set: (n) => cart.setQty(props.product.id, n),
});
</script>

<template>
  <button
    v-if="!qty"
    type="button"
    :class="['add-to-cart btn btn_variant_primary', size && `btn_size_${size}`]"
    @click="cart.add(product.id)"
  >
    В корзину
  </button>
  <QtyControl v-else v-model="qty" class="add-to-cart add-to-cart_active" :min="0" :size="size" />
</template>
