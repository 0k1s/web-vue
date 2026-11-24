<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronRight } from 'lucide-vue-next';
import { getCategory, getProduct } from '../data/products';

// Хлебные крошки: строятся по текущему адресу, «Главная» добавляется сама
const titles = { catalog: 'Каталог', cart: 'Корзина', checkout: 'Оформление заказа', about: 'О нас', favorites: 'Избранное' };
const route = useRoute();

const crumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean);
  const list = [{ to: '/', label: 'Главная' }];

  if (parts[0] === 'product') {
    const p = getProduct(parts[1]);
    list.push({ to: '/catalog', label: 'Каталог' });
    if (p) {
      list.push({ to: `/catalog/${p.category}`, label: getCategory(p.category).name });
      list.push({ label: p.name });
    }
    return list;
  }
  if (parts[0] === 'checkout') list.push({ to: '/cart', label: 'Корзина' });

  parts.forEach((part, i) => {
    const label = titles[part] ?? getCategory(part)?.name ?? part;
    list.push({ to: '/' + parts.slice(0, i + 1).join('/'), label });
  });
  return list;
});
</script>

<template>
  <nav v-if="route.path !== '/' && route.name !== 'not-found'" class="breadcrumbs wrapper" aria-label="Хлебные крошки">
    <ol class="breadcrumbs__list">
      <li
        v-for="(c, i) in crumbs"
        :key="i"
        :class="['breadcrumbs__item', { breadcrumbs__item_active: i === crumbs.length - 1 }]"
      >
        <ChevronRight v-if="i > 0" :size="14" class="breadcrumbs__separator" aria-hidden="true" />
        <span v-if="i === crumbs.length - 1 || !c.to" aria-current="page">{{ c.label }}</span>
        <RouterLink v-else class="breadcrumbs__link" :to="c.to">{{ c.label }}</RouterLink>
      </li>
    </ol>
  </nav>
</template>
