<script setup>
import { ref } from 'vue';
import { Heart, ShoppingCart, Trash2 } from 'lucide-vue-next';
import { useFavorites } from '../stores/favorites';
import { useShopActions } from '../composables/useShopActions';
import { notify } from '../stores/ui';
import { formatPrice, plural } from '../utils/format';
import ProductCard from '../components/ProductCard.vue';

// Страница «Избранное»: все отмеченные сердечком товары
const favorites = useFavorites();
const { addAllToCart } = useShopActions();
const confirmClear = ref(false); // показан ли вопрос «Точно очистить?»

const goods = (n) => `${n} ${plural(n, ['товар', 'товара', 'товаров'])}`;
const sum = () => favorites.items.value.reduce((s, p) => s + p.price, 0);

function allToCart() {
  const n = addAllToCart(favorites.items.value);
  notify(n ? `В корзину добавлено: ${goods(n)}` : 'Все товары из избранного уже в корзине', 'check');
}

function clearAll() {
  favorites.clear();
  confirmClear.value = false;
  notify('Избранное очищено', 'x');
}

// TransitionGroup: убранная карточка плавно исчезает, соседние съезжают на её место.
// Перед исчезновением фиксируем её размер и место — иначе в сетке она «схлопнется».
function beforeLeave(el) {
  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = el;
  Object.assign(el.style, {
    position: 'absolute',
    left: `${offsetLeft}px`,
    top: `${offsetTop}px`,
    width: `${offsetWidth}px`,
    height: `${offsetHeight}px`,
  });
}
</script>

<template>
  <div class="favorites wrapper">
    <div v-if="!favorites.count.value" class="favorites_empty fade-in">
      <Heart class="favorites__empty-icon" :size="96" :stroke-width="1.25" />
      <h1 class="favorites__title">В избранном пусто</h1>
      <p class="my-4">Нажмите на сердечко у товара — он появится здесь и сохранится, даже если закрыть браузер.</p>
      <RouterLink to="/catalog" class="btn btn_variant_primary">Перейти в каталог</RouterLink>
    </div>

    <template v-else>
      <div class="favorites__head">
        <div>
          <h1 class="favorites__title">Избранное</h1>
          <p class="favorites__summary">{{ goods(favorites.count.value) }} на {{ formatPrice(sum()) }}</p>
        </div>
        <div class="favorites__actions">
          <button type="button" class="btn btn_variant_primary" @click="allToCart">
            <ShoppingCart :size="18" /> Всё в корзину
          </button>
          <button v-if="!confirmClear" type="button" class="btn btn_variant_danger" @click="confirmClear = true">
            <Trash2 :size="18" /> Очистить
          </button>
          <div v-else class="favorites__confirm" role="alert">
            Очистить избранное?
            <button type="button" class="btn btn_variant_danger btn_size_sm" @click="clearAll">Да</button>
            <button type="button" class="btn btn_variant_ghost btn_size_sm" @click="confirmClear = false">Отмена</button>
          </div>
        </div>
      </div>

      <TransitionGroup tag="div" name="fav" class="favorites__grid" @before-leave="beforeLeave">
        <ProductCard v-for="p in favorites.items.value" :key="p.id" :product="p" />
      </TransitionGroup>
    </template>
  </div>
</template>
