<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Heart, House, ShoppingCart, Store } from 'lucide-vue-next';
import { categories } from '../data/products';
import { useCart } from '../stores/cart';
import { useFavorites } from '../stores/favorites';
import CategoryIcon from './CategoryIcon.vue';
import { navLinks } from './navLinks';

// Нижняя панель навигации на телефоне + бургер-меню в виде шторки
const route = useRoute();
const { count: cartCount } = useCart();
const { count: favCount } = useFavorites();
const open = ref(false);

watch(() => route.fullPath, () => (open.value = false)); // перешли куда-то — шторку закрываем

const tabs = [
  { to: '/', label: 'Главная', icon: House, match: (p) => p === '/' },
  { to: '/catalog', label: 'Каталог', icon: Store, match: (p) => p.startsWith('/catalog') || p.startsWith('/product') },
  { to: '/favorites', label: 'Избранное', icon: Heart, match: (p) => p === '/favorites', badge: favCount },
  { to: '/cart', label: 'Корзина', icon: ShoppingCart, match: (p) => p === '/cart' || p === '/checkout', badge: cartCount },
];
</script>

<template>
  <div v-if="open" class="mobile-menu">
    <div class="mobile-menu__overlay" @click="open = false" />
    <div class="mobile-menu__sheet" role="dialog" aria-label="Меню">
      <div class="mobile-menu__title">Меню</div>
      <nav class="mobile-menu__list">
        <RouterLink
          v-for="l in navLinks"
          :key="l.to"
          :to="l.to"
          :class="['mobile-menu__link', { 'mobile-menu__link_active': l.match(route.path) }]"
        >
          {{ l.label }}
        </RouterLink>
      </nav>
      <div class="mobile-menu__title">Категории</div>
      <nav class="mobile-menu__list">
        <RouterLink
          v-for="c in categories"
          :key="c.id"
          :to="`/catalog/${c.id}`"
          class="mobile-menu__link"
          exact-active-class="mobile-menu__link_active"
        >
          <CategoryIcon :id="c.id" :size="18" /> {{ c.name }}
        </RouterLink>
      </nav>
    </div>
  </div>

  <nav class="mobile-nav" aria-label="Нижняя навигация">
    <!-- custom v-slot: RouterLink отдаёт href и navigate, а ссылку и подсветку рисуем сами -->
    <RouterLink v-for="t in tabs" :key="t.to" :to="t.to" custom v-slot="{ href, navigate }">
      <a :href="href" :class="['mobile-nav__item', { 'mobile-nav__item_active': t.match(route.path) }]" @click="navigate">
        <span class="mobile-nav__icon">
          <component :is="t.icon" :size="22" />
          <span v-if="t.badge?.value" :key="t.badge.value" class="badge">{{ t.badge.value }}</span>
        </span>
        {{ t.label }}
      </a>
    </RouterLink>
    <button
      type="button"
      :class="['mobile-nav__item', { 'mobile-nav__item_active': open }]"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span :class="['mobile-nav__burger', { 'mobile-nav__burger_open': open }]">
        <span class="mobile-nav__burger-line" />
        <span class="mobile-nav__burger-line" />
        <span class="mobile-nav__burger-line" />
      </span>
      Меню
    </button>
  </nav>
</template>
