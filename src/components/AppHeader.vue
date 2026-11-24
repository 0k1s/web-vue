<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Heart, ShoppingCart } from 'lucide-vue-next';
import { useCart } from '../stores/cart';
import { useFavorites } from '../stores/favorites';
import { navLinks } from './navLinks';
import SearchBox from './SearchBox.vue';

// Шапка. На телефоне меню, Избранное и корзина переезжают в нижнюю панель (MobileNav).
const logoSrc = 'favicon.svg'; // файл из public/, путь относительный — работает и в собранном сайте
const route = useRoute();
const router = useRouter();
const { count: cartCount } = useCart();
const { count: favCount } = useFavorites();

// поиск из любого места сайта → каталог с ?q=
const query = ref('');
watch(() => route.query.q, (q) => (query.value = typeof q === 'string' ? q : ''), { immediate: true });

function search(q) {
  router.push({ path: route.path.startsWith('/catalog') ? route.path : '/catalog', query: q ? { q } : {} });
}
</script>

<template>
  <header class="header">
    <nav class="header__inner wrapper">
      <RouterLink to="/" class="header__logo">
        <img :src="logoSrc" alt="" class="header__logo-icon" />
        Чайная лавка
      </RouterLink>

      <ul class="header__menu">
        <li v-for="l in navLinks" :key="l.to">
          <RouterLink :to="l.to" :class="['header__link', { header__link_active: l.match(route.path) }]">{{ l.label }}</RouterLink>
        </li>
      </ul>

      <SearchBox
        id="header-search"
        v-model="query"
        class="header__search"
        variant="header"
        placeholder="Поиск по каталогу…"
        @submit="search"
      />

      <div class="header__actions">
        <RouterLink
          to="/favorites"
          :class="['header__icon', { header__icon_filled: favCount, header__icon_current: route.path === '/favorites' }]"
          aria-label="Избранное"
          title="Избранное"
        >
          <Heart :size="24" />
          <!-- :key — новое число пересоздаёт значок, и анимация «прыжка» запускается снова -->
          <span v-if="favCount" :key="favCount" class="badge">{{ favCount }}</span>
        </RouterLink>
        <RouterLink
          to="/cart"
          :class="['header__icon', { header__icon_filled: cartCount, header__icon_current: route.path === '/cart' }]"
          aria-label="Корзина"
          title="Корзина"
        >
          <ShoppingCart :size="24" />
          <span v-if="cartCount" :key="cartCount" class="badge">{{ cartCount }}</span>
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
