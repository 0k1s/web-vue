<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { X } from 'lucide-vue-next';

// Оболочка модального окна. Что внутри — не знает: содержимое приходит через слот.
// Показывать через v-if у родителя. Закрывается по Esc, клику по фону и крестику → событие close.
defineOptions({ inheritAttrs: false }); // class от родителя кладём на само окно, а не на Teleport
defineProps({ label: { type: String, default: '' } });
const emit = defineEmits(['close']);

const dialog = ref(null);
let opener = null; // кнопка, которая открыла окно — вернём на неё фокус

const focusable = () =>
  [...dialog.value.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')];

function onKeydown(e) {
  if (e.key === 'Escape') emit('close');
  if (e.key === 'Tab') {
    // Tab ходит по кругу внутри окна
    const items = focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

onMounted(async () => {
  opener = document.activeElement;
  document.addEventListener('keydown', onKeydown);
  document.body.style.overflow = 'hidden'; // страница под окном не прокручивается
  await nextTick();
  dialog.value?.focus();
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
  if (opener?.isConnected) opener.focus();
});
</script>

<template>
  <!-- Teleport переносит окно в конец body: его не обрежут overflow и z-index родителей -->
  <Teleport to="body">
    <div class="modal" @click.self="emit('close')">
      <div ref="dialog" class="modal__dialog" role="dialog" aria-modal="true" :aria-label="label" tabindex="-1" v-bind="$attrs">
        <button type="button" class="modal__close close" aria-label="Закрыть" @click="emit('close')"><X :size="20" /></button>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
