<script setup>
import { computed, ref, watch } from 'vue';
import { History, Search, X } from 'lucide-vue-next';
import { matchesQuery, products } from '../data/products';
import { useSearchHistory } from '../stores/searchHistory';
import { useProductLink } from '../composables/useProductLink';
import { formatPrice } from '../utils/format';
import ProductImage from './ProductImage.vue';

// Поле поиска с подсказками: «Вы искали» (5 последних запросов) и «Товары».
// v-model — текст запроса. Событие submit — пользователь нажал Enter или выбрал старый запрос.
// live — каталог фильтруется на лету, поэтому запрос запоминается ещё и при уходе с поля.
const props = defineProps({
  modelValue: { type: String, default: '' },
  id: { type: String, required: true },
  placeholder: { type: String, default: 'Поиск чая…' },
  live: { type: Boolean, default: false },
  variant: { type: String, default: 'page' }, // page | header
});
const emit = defineEmits(['update:modelValue', 'submit']);

const { history, remember, forget, clearHistory } = useSearchHistory();
const { openProduct } = useProductLink();

const input = ref(null);
const open = ref(false); // показан ли список подсказок
const active = ref(-1); // какая подсказка подсвечена стрелками

const text = computed(() => props.modelValue.trim());

// старые запросы, в которых есть введённый текст; поле пустое — все 5
const recent = computed(() => {
  const t = text.value.toLowerCase();
  return t ? history.value.filter((q) => q.toLowerCase().includes(t)) : history.value;
});

// до 4 товаров, подходящих под запрос (от 2 символов)
const found = computed(() =>
  text.value.length >= 2 ? products.filter((p) => matchesQuery(p, text.value)).slice(0, 4) : []
);

// обе группы одним списком — чтобы стрелки ↑↓ ходили по всем подсказкам
const options = computed(() => [
  ...recent.value.map((q) => ({ type: 'recent', q })),
  ...found.value.map((p) => ({ type: 'product', p })),
]);
const showList = computed(() => open.value && options.value.length > 0);

watch(options, () => (active.value = -1)); // список поменялся — подсветку сбрасываем

function submit(value = text.value) {
  remember(value); // запрос попадает в историю
  open.value = false;
  emit('submit', value);
}

function choose(option) {
  if (option.type === 'recent') {
    emit('update:modelValue', option.q); // подставить старый запрос и искать
    submit(option.q);
  } else {
    remember(text.value);
    open.value = false;
    input.value.blur();
    openProduct(option.p.id); // товар — сразу на его страницу
  }
}

function onKeydown(e) {
  const n = options.value.length;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    open.value = true;
    if (!n) return;
    const step = e.key === 'ArrowDown' ? 1 : -1;
    // по кругу: ничего (-1) → 0 → … → n-1 → снова ничего
    active.value = ((active.value + 1 + step + n + 1) % (n + 1)) - 1;
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (showList.value && active.value >= 0) choose(options.value[active.value]);
    else submit();
  } else if (e.key === 'Escape') {
    open.value = false;
  }
}

function onBlur() {
  open.value = false;
  if (props.live && text.value) remember(text.value);
}

function clearInput() {
  emit('update:modelValue', '');
  if (props.live) emit('submit', '');
  input.value.focus();
  open.value = true;
}

const optionId = (i) => `${props.id}-option-${i}`;
</script>

<template>
  <div :class="['search', `search_variant_${variant}`]">
    <Search class="search__icon" :size="18" aria-hidden="true" />
    <input
      :id="id"
      ref="input"
      class="search__input field__input"
      type="search"
      autocomplete="off"
      role="combobox"
      :aria-expanded="showList"
      :aria-controls="`${id}-list`"
      :aria-activedescendant="active >= 0 ? optionId(active) : undefined"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value); open = true"
      @focus="open = true"
      @click="open = true"
      @blur="onBlur"
      @keydown="onKeydown"
    />
    <button v-if="modelValue" type="button" class="search__clear" aria-label="Очистить поле" @mousedown.prevent @click="clearInput">
      <X :size="16" />
    </button>

    <!-- mousedown.prevent: без него поле теряет фокус раньше клика, и список закрывается до выбора -->
    <div v-if="showList" :id="`${id}-list`" class="search__list" role="listbox" @mousedown.prevent>
      <template v-if="recent.length">
        <div class="search__group">
          Вы искали
          <button type="button" class="search__group-action" @click="clearHistory">Очистить</button>
        </div>
        <div
          v-for="(q, i) in recent"
          :id="optionId(i)"
          :key="'q' + q"
          role="option"
          :aria-selected="active === i"
          :class="['search__option', { search__option_active: active === i }]"
          @click="choose({ type: 'recent', q })"
          @mouseenter="active = i"
        >
          <History class="search__option-icon" :size="16" />
          <span class="search__option-text">{{ q }}</span>
          <!-- .stop — чтобы клик по крестику не запускал поиск по этому запросу -->
          <button type="button" class="search__forget" :aria-label="`Удалить «${q}» из истории`" @click.stop="forget(q)">
            <X :size="14" />
          </button>
        </div>
      </template>

      <template v-if="found.length">
        <div class="search__group">Товары</div>
        <div
          v-for="(p, j) in found"
          :id="optionId(recent.length + j)"
          :key="'p' + p.id"
          role="option"
          :aria-selected="active === recent.length + j"
          :class="['search__option', { search__option_active: active === recent.length + j }]"
          @click="choose({ type: 'product', p })"
          @mouseenter="active = recent.length + j"
        >
          <ProductImage class="search__thumb" :product="p" size="sm" />
          <span class="search__option-text">{{ p.name }}</span>
          <span class="search__option-price">{{ formatPrice(p.price) }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
