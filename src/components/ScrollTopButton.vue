<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ArrowUp } from 'lucide-vue-next';

// Кнопка «наверх»: появляется после прокрутки на 400px
const visible = ref(false);
const onScroll = () => (visible.value = window.scrollY > 400);

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true }); // компонент появился — подписались
});
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll)); // исчезает — отписались

const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
</script>

<template>
  <button
    type="button"
    :class="['floating scroll-top', { 'scroll-top_visible': visible }]"
    aria-label="Наверх"
    :tabindex="visible ? 0 : -1"
    @click="toTop"
  >
    <ArrowUp :size="22" />
  </button>
</template>
