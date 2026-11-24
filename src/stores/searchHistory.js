import { ref, watch } from 'vue';
import { storage } from '../utils/storage';

// 5 последних поисковых запросов
const STORAGE_KEY = 'tea-shop-search-history';
const LIMIT = 5;

function load() {
  const saved = storage.get(STORAGE_KEY, []);
  return Array.isArray(saved) ? saved.filter((x) => typeof x === 'string').slice(0, LIMIT) : [];
}

const history = ref(load());
watch(history, (value) => storage.set(STORAGE_KEY, value), { deep: true });

// запомнить запрос: новый — первым, такой же старый убираем, всего не больше 5
function remember(raw) {
  const q = String(raw ?? '').trim().replace(/\s+/g, ' ');
  if (q.length < 2) return; // одну букву не запоминаем
  const rest = history.value.filter((x) => x.toLowerCase() !== q.toLowerCase());
  history.value = [q, ...rest].slice(0, LIMIT);
}

const forget = (q) => {
  history.value = history.value.filter((x) => x !== q);
};
const clearHistory = () => {
  history.value = [];
};

export function useSearchHistory() {
  return { history, remember, forget, clearHistory };
}
