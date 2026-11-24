import { onBeforeUnmount, onMounted, ref } from 'vue';

// true, пока медиазапрос выполняется; обновляется при изменении размера окна
export function useMediaQuery(query) {
  const mql = window.matchMedia(query);
  const matches = ref(mql.matches);
  const onChange = () => (matches.value = mql.matches);

  onMounted(() => mql.addEventListener('change', onChange));
  onBeforeUnmount(() => mql.removeEventListener('change', onChange));
  return matches;
}
