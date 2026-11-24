<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

// Параллакс: фон сдвигается медленнее, чем прокручивается страница.
// Сдвиг пишем в CSS-переменную --parallax-shift, двигает фон CSS.
const el = ref(null);
let frame = 0;

function update() {
  frame = 0;
  if (!el.value) return;
  const offset = el.value.getBoundingClientRect().top;
  el.value.style.setProperty('--parallax-shift', `${offset * -0.3}px`);
}
// requestAnimationFrame — пересчитываем не чаще раза за кадр
const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(update);
};

onMounted(() => {
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  cancelAnimationFrame(frame);
});
</script>

<template>
  <section ref="el" class="parallax">
    <div class="parallax__bg" />
    <div class="parallax__content"><slot /></div>
  </section>
</template>
