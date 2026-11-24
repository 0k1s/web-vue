<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SearchX } from 'lucide-vue-next';
import { categories, getCategory, matchesQuery, products } from '../data/products';
import { storage } from '../utils/storage';
import { plural } from '../utils/format';
import AppPagination from '../components/AppPagination.vue';
import CategoryIcon from '../components/CategoryIcon.vue';
import ProductCard from '../components/ProductCard.vue';
import SearchBox from '../components/SearchBox.vue';
import ViewSwitcher, { VIEWS } from '../components/ViewSwitcher.vue';
import NotFoundPage from './NotFoundPage.vue';

const PAGE_SIZES = [8, 16, 24]; // делятся на 1, 2 и 4 колонки
const VIEW_KEY = 'tea-shop-catalog-view';

const sorters = {
  default: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name, 'ru'),
};

const route = useRoute();
const router = useRouter();

// Все фильтры живут в адресе (#/catalog/green?q=…&sort=…&size=…&page=…):
// ссылкой можно поделиться, а «Назад» возвращает к тем же фильтрам.
const category = computed(() => route.params.category ?? '');
const query = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''));
const sort = computed(() => (route.query.sort in sorters ? route.query.sort : 'default'));
const size = computed(() => (PAGE_SIZES.includes(Number(route.query.size)) ? Number(route.query.size) : 16));

// поменять параметры адреса; сменился любой фильтр — номер страницы сбрасываем
function update(patch, { replace = false } = {}) {
  const next = { ...route.query, ...patch };
  if (!('page' in patch)) delete next.page;
  for (const k of Object.keys(next)) if (next[k] === '' || next[k] == null) delete next[k];
  router[replace ? 'replace' : 'push']({ query: next });
}

// Поле поиска связано с адресом двумя watch: поле отвечает сразу, адрес догоняет.
// replace — чтобы «Назад» не листал историю по буквам.
const search = ref(query.value);
watch(search, (v) => v.trim() !== query.value && update({ q: v.trim() }, { replace: true }));
watch(query, (q) => q !== search.value.trim() && (search.value = q));

// вид каталога — настройка интерфейса, а не фильтр: запоминаем в localStorage
const savedView = storage.get(VIEW_KEY, 'grid-large');
const view = ref(VIEWS.includes(savedView) ? savedView : 'grid-large');
watch(view, (v) => storage.set(VIEW_KEY, v));

// фильтр по категории и тексту + сортировка
const filtered = computed(() =>
  products
    .filter((p) => !category.value || p.category === category.value)
    .filter((p) => matchesQuery(p, query.value))
    .sort(sorters[sort.value])
);

// Динамическая пагинация: число страниц само пересчитывается от фильтров, поиска и «по N»
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / size.value)));
const page = computed(() => Math.min(totalPages.value, Math.max(1, Number(route.query.page) || 1))); // ?page=999 → последняя
const visible = computed(() => filtered.value.slice((page.value - 1) * size.value, page.value * size.value));

const list = ref(null);
async function goPage(p) {
  update({ page: p > 1 ? p : undefined });
  await nextTick();
  const top = list.value.getBoundingClientRect().top + window.scrollY - 140;
  if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
}

const title = computed(() => (category.value ? getCategory(category.value)?.name : 'Каталог'));
</script>

<template>
  <NotFoundPage v-if="category && !getCategory(category)" />
  <div v-else class="catalog wrapper">
    <h1 class="catalog__title">{{ title }}</h1>

    <div class="catalog__categories">
      <RouterLink :to="{ path: '/catalog', query: query ? { q: query } : {} }" :class="['catalog__chip', { catalog__chip_active: !category }]">
        Все
      </RouterLink>
      <RouterLink
        v-for="c in categories"
        :key="c.id"
        :to="{ path: `/catalog/${c.id}`, query: query ? { q: query } : {} }"
        :class="['catalog__chip', { catalog__chip_active: category === c.id }]"
      >
        <CategoryIcon :id="c.id" :size="16" /> {{ c.name }}
      </RouterLink>
    </div>

    <div class="catalog__toolbar">
      <SearchBox id="catalog-search" v-model="search" class="catalog__search" live placeholder="Поиск: улун, Япония…" />
      <select class="catalog__sort field__input" aria-label="Сортировка" :value="sort" @change="update({ sort: $event.target.value === 'default' ? '' : $event.target.value })">
        <option value="default">По умолчанию</option>
        <option value="price-asc">Сначала дешевле</option>
        <option value="price-desc">Сначала дороже</option>
        <option value="name">По названию</option>
      </select>
      <select class="catalog__size field__input" aria-label="Товаров на странице" :value="size" @change="update({ size: $event.target.value })">
        <option v-for="s in PAGE_SIZES" :key="s" :value="s">по {{ s }}</option>
      </select>
      <ViewSwitcher v-model="view" />
    </div>

    <p class="catalog__count">
      Найдено: {{ filtered.length }} {{ plural(filtered.length, ['товар', 'товара', 'товаров']) }}
      <template v-if="totalPages > 1"> · страница {{ page }} из {{ totalPages }}</template>
    </p>

    <div v-if="visible.length" ref="list" :key="`${page}-${size}-${sort}`" :class="['catalog__items', `catalog__items_view_${view}`]">
      <ProductCard v-for="p in visible" :key="p.id" :product="p" :view="view === 'list' ? 'list' : ''" class="fade-in" />
    </div>
    <div v-else ref="list" class="catalog__empty">
      <SearchX :size="48" :stroke-width="1.5" />
      Ничего не найдено
      <button v-if="query" type="button" class="btn btn_variant_ghost btn_size_sm" @click="search = ''">Сбросить поиск</button>
    </div>

    <AppPagination :page="page" :total="totalPages" @change="goPage" />
  </div>
</template>
