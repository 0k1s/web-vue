import { computed, ref, watch } from 'vue';
import { getProduct } from '../data/products';
import { storage } from '../utils/storage';

// Избранное: список id товаров. ref создаётся один раз при импорте модуля —
// шапка, карточки и страница «Избранное» видят один и тот же список.
const STORAGE_KEY = 'tea-shop-favorites';

// при старте читаем сохранённый список: только существующие товары и без повторов
function load() {
  const saved = storage.get(STORAGE_KEY, []);
  if (!Array.isArray(saved)) return [];
  return [...new Set(saved.map(Number))].filter((id) => getProduct(id));
}

const ids = ref(load());

// поменялся список — сразу сохраняем в localStorage
watch(ids, (value) => storage.set(STORAGE_KEY, value), { deep: true });

const has = (id) => ids.value.includes(id);

// добавить или убрать; вернёт true, если товар добавлен
function toggle(id) {
  if (has(id)) {
    ids.value = ids.value.filter((x) => x !== id);
    return false;
  }
  ids.value.unshift(id); // новое — в начало списка
  return true;
}

const remove = (id) => {
  ids.value = ids.value.filter((x) => x !== id);
};
const clear = () => {
  ids.value = [];
};

const items = computed(() => ids.value.map(getProduct).filter(Boolean)); // сами товары для страницы
const count = computed(() => items.value.length);

export function useFavorites() {
  return { ids, items, count, has, toggle, remove, clear };
}
