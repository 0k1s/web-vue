<script setup>
import { computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

// Пагинация с «окном» страниц: 1 … 4 5 6 … 12.
// Сама страницу не меняет — сообщает родителю событием change.
const props = defineProps({
  page: { type: Number, required: true },
  total: { type: Number, required: true },
});
const emit = defineEmits(['change']);

// какие номера показать: первую, последнюю, текущую и соседей; разрывы — «…»
const pages = computed(() => {
  const set = new Set([1, props.total, props.page - 1, props.page, props.page + 1]);
  const sorted = [...set].filter((p) => p >= 1 && p <= props.total).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (i && p - prev === 2) result.push(prev + 1); // пропущена одна страница — показываем её номер, а не «…»
    else if (i && p - prev > 2) result.push('gap' + p);
    result.push(p);
  });
  return result;
});
</script>

<template>
  <nav v-if="total > 1" class="pagination" aria-label="Страницы">
    <button class="pagination__item" :disabled="page === 1" aria-label="Предыдущая" @click="emit('change', page - 1)">
      <ChevronLeft :size="18" />
    </button>
    <template v-for="p in pages" :key="p">
      <span v-if="typeof p === 'string'" class="pagination__gap">…</span>
      <button
        v-else
        :class="['pagination__item', { pagination__item_active: p === page }]"
        :aria-current="p === page ? 'page' : undefined"
        @click="emit('change', p)"
      >
        {{ p }}
      </button>
    </template>
    <button class="pagination__item" :disabled="page === total" aria-label="Следующая" @click="emit('change', page + 1)">
      <ChevronRight :size="18" />
    </button>
  </nav>
</template>
