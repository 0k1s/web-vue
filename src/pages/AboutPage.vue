<script setup>
import { Globe, GraduationCap, Truck } from 'lucide-vue-next';

const features = [
  { icon: Globe, title: 'Прямые поставки', text: 'Работаем с плантациями Китая, Японии, Индии и Тайваня.' },
  { icon: Truck, title: 'Быстрая доставка', text: 'Отправляем заказы в течение суток после оформления.' },
  { icon: GraduationCap, title: 'Консультации', text: 'Поможем выбрать чай и расскажем, как его заваривать.' },
];
</script>

<template>
  <div class="wrapper mt-4 fade-in">
    <h1 class="mb-3 text-3xl font-extrabold">О нас</h1>
    <p class="text-xl text-gray-600">«Чайная лавка» — небольшой магазин для тех, кто любит настоящий листовой чай.</p>
    <div class="mt-6 grid gap-6 md:grid-cols-3">
      <div v-for="f in features" :key="f.title" class="feature">
        <component :is="f.icon" class="feature__icon" :size="36" :stroke-width="1.5" />
        <h5 class="feature__title">{{ f.title }}</h5>
        <p class="text-gray-600">{{ f.text }}</p>
      </div>
    </div>
  </div>
</template>
