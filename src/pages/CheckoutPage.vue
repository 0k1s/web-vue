<script setup>
import { reactive, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { CircleCheck } from 'lucide-vue-next';
import { useCart } from '../stores/cart';
import { storage } from '../utils/storage';
import { formatPrice } from '../utils/format';

const ORDERS_KEY = 'tea-shop-orders';
const router = useRouter();
const cart = useCart();
const { lines, total, delivery, grandTotal } = cart;

// reactive — объект формы целиком реактивный; v-model связывает поля с его свойствами
const form = reactive({ name: '', phone: '', email: '', address: '', delivery: 'courier', payment: 'card', comment: '' });
const validated = ref(false); // после первой попытки отправки подсвечиваем ошибки
const orderId = ref(null);

// корзина пуста и заказ ещё не оформлен — оформлять нечего
watchEffect(() => {
  if (!orderId.value && !lines.value.length) router.replace('/cart');
});

function submit(e) {
  validated.value = true;
  if (!e.target.checkValidity()) return; // браузер сам проверяет required, pattern, type=email
  // Серверной части нет — сохраняем заказ в localStorage
  const id = Date.now().toString().slice(-6);
  const orders = storage.get(ORDERS_KEY, []);
  orders.push({
    id,
    ...form,
    lines: lines.value.map((l) => ({ id: l.product.id, qty: l.qty })),
    total: grandTotal.value,
    date: new Date().toISOString(),
  });
  storage.set(ORDERS_KEY, orders);
  orderId.value = id;
  cart.clear();
}
</script>

<template>
  <div v-if="orderId" class="checkout checkout_done wrapper fade-in">
    <CircleCheck class="checkout__done-icon" :size="72" :stroke-width="1.5" />
    <h1 class="my-3 text-3xl font-extrabold">Заказ №{{ orderId }} оформлен!</h1>
    <p class="mb-6">Мы свяжемся с вами по телефону {{ form.phone }} для подтверждения.</p>
    <RouterLink to="/catalog" class="btn btn_variant_primary">Продолжить покупки</RouterLink>
  </div>

  <div v-else-if="lines.length" class="checkout wrapper fade-in">
    <h1 class="checkout__title">Оформление заказа</h1>
    <div class="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
      <!-- novalidate: браузер не показывает свои подсказки, ошибки рисуем сами; .prevent — без перезагрузки -->
      <form class="checkout__form" novalidate @submit.prevent="submit">
        <div class="grid gap-4 md:grid-cols-2">
          <label :class="['field', { field_validated: validated }]">
            <span class="field__label">Имя *</span>
            <input v-model.trim="form.name" class="field__input" name="name" autocomplete="name" required />
            <span class="field__error">Укажите имя</span>
          </label>
          <label :class="['field', { field_validated: validated }]">
            <span class="field__label">Телефон *</span>
            <input
              v-model.trim="form.phone"
              class="field__input"
              name="phone"
              type="tel"
              autocomplete="tel"
              required
              pattern="\+?[0-9 \(\)\-]{10,}"
              placeholder="+7 900 000-00-00"
            />
            <span class="field__error">Введите корректный телефон</span>
          </label>
          <label :class="['field md:col-span-2', { field_validated: validated }]">
            <span class="field__label">E-mail</span>
            <input v-model.trim="form.email" class="field__input" name="email" type="email" autocomplete="email" />
            <span class="field__error">Некорректный e-mail</span>
          </label>
          <label class="field">
            <span class="field__label">Доставка</span>
            <select v-model="form.delivery" class="field__input" name="delivery">
              <option value="courier">Курьер</option>
              <option value="pickup">Самовывоз</option>
              <option value="post">Почта России</option>
            </select>
          </label>
          <label class="field">
            <span class="field__label">Оплата</span>
            <select v-model="form.payment" class="field__input" name="payment">
              <option value="card">Картой при получении</option>
              <option value="cash">Наличными</option>
            </select>
          </label>
          <label v-if="form.delivery !== 'pickup'" :class="['field md:col-span-2', { field_validated: validated }]">
            <span class="field__label">Адрес *</span>
            <input v-model.trim="form.address" class="field__input" name="address" autocomplete="street-address" required />
            <span class="field__error">Укажите адрес доставки</span>
          </label>
          <label class="field md:col-span-2">
            <span class="field__label">Комментарий</span>
            <textarea v-model="form.comment" class="field__input" name="comment" rows="3" />
          </label>
        </div>
        <button class="btn btn_variant_primary btn_size_lg mt-6">Подтвердить заказ</button>
      </form>

      <aside class="cart__summary">
        <div v-for="l in lines" :key="l.product.id" class="cart__summary-row">
          <span>{{ l.product.name }} × {{ l.qty }}</span><span>{{ formatPrice(l.sum) }}</span>
        </div>
        <div class="cart__summary-row"><span>Доставка</span><span>{{ delivery ? formatPrice(delivery) : 'бесплатно' }}</span></div>
        <div class="cart__summary-row cart__summary-row_total"><span>Итого</span><span>{{ formatPrice(grandTotal) }}</span></div>
      </aside>
    </div>
  </div>
</template>
