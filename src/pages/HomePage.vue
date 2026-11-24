<script setup>
import { categories, products } from '../data/products';
import AppCarousel from '../components/AppCarousel.vue';
import CategoryIcon from '../components/CategoryIcon.vue';
import ParallaxSection from '../components/ParallaxSection.vue';
import ProductCard from '../components/ProductCard.vue';

const slides = [
  { title: 'Весенний сбор 2026', text: 'Свежие зелёные чаи из Китая и Японии', to: '/catalog/green', bg: 'linear-gradient(120deg,#2f5d3a,#7fb77e)' },
  { title: 'Улуны с Тайваня', text: 'Цветочные и медовые ароматы гор', to: '/catalog/oolong', bg: 'linear-gradient(120deg,#6b5a2a,#d8c07a)' },
  { title: 'Посуда для церемоний', text: 'Гайвани, пиалы и исинские чайники', to: '/catalog/teaware', bg: 'linear-gradient(120deg,#35506a,#8fb1cc)' },
];

const newProducts = products.filter((p) => p.isNew).slice(0, 4);
</script>

<template>
  <div class="wrapper mt-4">
    <!-- слот с данными: карусель отдаёт слайд (item), а как его нарисовать, решаем здесь -->
    <AppCarousel :items="slides">
      <template #default="{ item }">
        <div class="carousel__content">
          <h2 class="carousel__title">{{ item.title }}</h2>
          <p class="carousel__text">{{ item.text }}</p>
          <RouterLink :to="item.to" class="btn btn_variant_light">Смотреть</RouterLink>
        </div>
      </template>
    </AppCarousel>
  </div>

  <section class="section wrapper">
    <h2 class="section__title">Категории</h2>
    <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <RouterLink
        v-for="c in categories"
        :key="c.id"
        :to="`/catalog/${c.id}`"
        class="category-tile"
        :style="{ '--category-color': c.color }"
      >
        <CategoryIcon :id="c.id" class="category-tile__icon" :size="32" :stroke-width="1.5" />
        <span class="category-tile__name">{{ c.name }}</span>
      </RouterLink>
    </div>
  </section>

  <div class="wrapper">
    <ParallaxSection>
      <h2 class="parallax__title">Чай — это пауза в суете</h2>
      <p class="parallax__text">Более 20 сортов из Китая, Японии, Индии и Тайваня</p>
      <RouterLink to="/catalog" class="btn btn_variant_light btn_size_lg">Перейти в каталог</RouterLink>
    </ParallaxSection>
  </div>

  <section class="section wrapper">
    <h2 class="section__title">Новинки</h2>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <ProductCard v-for="p in newProducts" :key="p.id" :product="p" class="fade-in" />
    </div>
  </section>
</template>
