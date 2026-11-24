import { computed, reactive, watch } from 'vue';
import { getProduct } from '../data/products';
import { storage } from '../utils/storage';

// Корзина. Модуль выполняется один раз при первом импорте,
// поэтому все компоненты получают один и тот же объект state.
const STORAGE_KEY = 'tea-shop-cart';
export const MAX_QTY = 99;
export const FREE_DELIVERY_FROM = 3000; // от этой суммы доставка бесплатная
const DELIVERY_PRICE = 300;

// В корзине храним только { [id товара]: количество }. Цены берутся из каталога по id.
function load() {
  const saved = storage.get(STORAGE_KEY, {});
  const items = {};
  if (saved && typeof saved === 'object') {
    for (const [id, qty] of Object.entries(saved)) {
      const n = Math.floor(Number(qty));
      if (getProduct(id) && n > 0) items[id] = Math.min(n, MAX_QTY); // мусор из localStorage отбрасываем
    }
  }
  return items;
}

const state = reactive({ items: load() });

// любое изменение корзины сразу записываем в localStorage
watch(() => state.items, (items) => storage.set(STORAGE_KEY, items), { deep: true });

// строки корзины: товар, количество, сумма
const lines = computed(() =>
  Object.entries(state.items)
    .map(([id, qty]) => ({ product: getProduct(id), qty }))
    .filter((l) => l.product)
    .map((l) => ({ ...l, sum: l.product.price * l.qty }))
);
const count = computed(() => lines.value.reduce((s, l) => s + l.qty, 0));
const total = computed(() => lines.value.reduce((s, l) => s + l.sum, 0)); // сумма товаров
const delivery = computed(() => (total.value >= FREE_DELIVERY_FROM ? 0 : DELIVERY_PRICE));
const grandTotal = computed(() => total.value + delivery.value); // итог с доставкой

function setQty(id, qty) {
  if (qty <= 0) delete state.items[id];
  else state.items[id] = Math.min(qty, MAX_QTY);
}
const add = (id, qty = 1) => setQty(id, (state.items[id] ?? 0) + qty);
const remove = (id) => setQty(id, 0);
const qtyOf = (id) => state.items[id] ?? 0;
function clear() {
  state.items = {};
}

export function useCart() {
  return { lines, count, total, delivery, grandTotal, add, setQty, remove, clear, qtyOf };
}
