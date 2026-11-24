<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

// Карусель. Сама не знает, как выглядит слайд: отдаёт каждый элемент наружу
// через слот с данными (scoped slot), а рисует его родитель.
const props = defineProps({
  items: { type: Array, required: true },
  interval: { type: Number, default: 4000 },
});

const index = ref(0);
const paused = ref(false);
let timer = null;

const go = (d) => (index.value = (index.value + d + props.items.length) % props.items.length);

// листаем сами, пока не навели мышь; сменился слайд или пауза — таймер заново
watch(
  [index, paused],
  () => {
    clearTimeout(timer);
    if (!paused.value) timer = setTimeout(() => go(1), props.interval);
  },
  { immediate: true }
);
onBeforeUnmount(() => clearTimeout(timer)); // убрали компонент — убрали таймер

// свайп на телефоне
let startX = null;
const onPointerDown = (e) => (startX = e.clientX);
function onPointerUp(e) {
  if (startX === null) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  startX = null;
}
</script>

<template>
  <section
    class="carousel"
    aria-roledescription="карусель"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
  >
    <div class="carousel__track" :style="{ transform: `translateX(-${index * 100}%)` }">
      <!-- :inert — у скрытых слайдов ссылки не ловят Tab -->
      <div v-for="(item, i) in items" :key="i" class="carousel__slide" :inert="i !== index" :style="{ background: item.bg }">
        <slot :item="item" :index="i" />
      </div>
    </div>
    <button type="button" class="carousel__arrow carousel__arrow_prev" aria-label="Предыдущий слайд" @click="go(-1)">
      <ChevronLeft :size="24" />
    </button>
    <button type="button" class="carousel__arrow carousel__arrow_next" aria-label="Следующий слайд" @click="go(1)">
      <ChevronRight :size="24" />
    </button>
    <div class="carousel__dots">
      <button
        v-for="(item, i) in items"
        :key="i"
        type="button"
        :class="['carousel__dot', { carousel__dot_active: i === index }]"
        :aria-label="`Слайд ${i + 1}`"
        @click="index = i"
      />
    </div>
  </section>
</template>
