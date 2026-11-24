<script setup>
import { Check, Heart, X } from 'lucide-vue-next';
import { ui } from '../stores/ui';

const icons = { check: Check, heart: Heart, x: X };
</script>

<template>
  <!-- TransitionGroup анимирует появление и исчезновение уведомлений (классы .toast-*) -->
  <TransitionGroup tag="div" name="toast" class="toaster" aria-live="polite">
    <div v-for="t in ui.toasts" :key="t.id" class="toaster__item">
      <component :is="icons[t.icon]" :size="16" :fill="t.icon === 'heart' ? 'currentColor' : 'none'" :class="['toaster__icon', `toaster__icon_${t.icon}`]" />
      {{ t.text }}
    </div>
  </TransitionGroup>
</template>
