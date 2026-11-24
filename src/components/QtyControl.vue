<script setup>
import { Minus, Plus } from 'lucide-vue-next';
import { MAX_QTY } from '../stores/cart';

// Счётчик «− n +». Работает с v-model:
// v-model="qty" — это :model-value="qty" + @update:model-value="qty = $event"
const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 },
  max: { type: Number, default: MAX_QTY },
  size: { type: String, default: '' }, // sm | lg
});
const emit = defineEmits(['update:modelValue']);

const change = (delta) => emit('update:modelValue', Math.min(props.max, Math.max(props.min, props.modelValue + delta)));
</script>

<template>
  <div :class="['qty', size && `qty_size_${size}`]">
    <button type="button" class="qty__btn" :disabled="modelValue <= min" aria-label="Уменьшить" @click="change(-1)">
      <Minus :size="16" />
    </button>
    <span class="qty__value" aria-live="polite">{{ modelValue }}</span>
    <button type="button" class="qty__btn" :disabled="modelValue >= max" aria-label="Увеличить" @click="change(1)">
      <Plus :size="16" />
    </button>
  </div>
</template>
