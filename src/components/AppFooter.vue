<script setup>
import { categories } from '../data/products';

const year = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="wrapper grid grid-cols-2 gap-6 md:grid-cols-4">
      <div class="col-span-2 md:col-span-1">
        <h5 class="footer__title">Чайная лавка</h5>
        <p>Чай со всего света с доставкой по России.</p>
      </div>
      <div>
        <h5 class="footer__title">Каталог</h5>
        <ul class="footer__list">
          <li v-for="c in categories" :key="c.id">
            <RouterLink class="footer__link" :to="`/catalog/${c.id}`">{{ c.name }}</RouterLink>
          </li>
        </ul>
      </div>
      <div>
        <h5 class="footer__title">Покупателям</h5>
        <ul class="footer__list">
          <li><RouterLink class="footer__link" to="/favorites">Избранное</RouterLink></li>
          <li><RouterLink class="footer__link" to="/cart">Корзина</RouterLink></li>
          <li><RouterLink class="footer__link" to="/about">О нас</RouterLink></li>
        </ul>
      </div>
      <div>
        <h5 class="footer__title">Контакты</h5>
        <ul class="footer__list">
          <li>+7 (000) 000-00-00</li>
          <li>hello@tea-shop.example</li>
          <li>Ежедневно 10:00–22:00</li>
        </ul>
      </div>
    </div>
    <div class="footer__copy">© {{ year }} Чайная лавка</div>
  </footer>
</template>
