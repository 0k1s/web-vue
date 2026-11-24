<script setup>
// Чайника в lucide нет — рисуем в том же стиле (24×24, линия 2)
defineProps({
  size: { type: [Number, String], default: 24 },
  strokeWidth: { type: [Number, String], default: 2 },
});
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M10 5h4" />
    <path d="M12 5V3.5" />
    <path d="M5 10h14v3a7 7 0 0 1-7 7h0a7 7 0 0 1-7-7z" />
    <path d="M19 11.5h1.5a2 2 0 0 1 0 4H18.5" />
    <path d="M5 12 2.5 9.5" />
    <path d="M7 10a5 5 0 0 1 10 0" />
  </svg>
</template>
