<script setup>
import { nextTick, ref, watch } from 'vue';
import { MessageCircle, SendHorizontal, X } from 'lucide-vue-next';
import { useCart } from '../stores/cart';
import { useFavorites } from '../stores/favorites';
import { formatPrice, plural } from '../utils/format';

// Простой чат-бот на правилах: ключевое слово → ответ.
// Ответ может быть функцией — тогда бот смотрит в корзину и Избранное.
const cart = useCart();
const favorites = useFavorites();

const goods = (n) => `${n} ${plural(n, ['товар', 'товара', 'товаров'])}`;

const rules = [
  [/привет|здравств|добр/i, 'Здравствуйте! Чем могу помочь? Спросите про доставку, оплату, избранное или подбор чая.'],
  [/избран|сердеч|отлож/i, () =>
    favorites.count.value
      ? `В избранном ${goods(favorites.count.value)}: ${favorites.items.value.slice(0, 3).map((p) => p.name).join(', ')}${favorites.count.value > 3 ? '…' : ''}. Всё есть на странице «Избранное».`
      : 'В избранном пока пусто. Нажмите на сердечко у товара, чтобы отложить его.'],
  [/корзин/i, () =>
    cart.count.value
      ? `В корзине ${goods(cart.count.value)} на ${formatPrice(cart.total.value)}.`
      : 'Корзина пока пуста — загляните в каталог.'],
  [/достав/i, 'Доставляем по всей России за 2–7 дней. От 3000 ₽ — бесплатно.'],
  [/оплат/i, 'Оплата картой или наличными при получении.'],
  [/возврат/i, 'Нераспечатанный товар можно вернуть в течение 14 дней.'],
  [/зел[её]н/i, 'Из зелёных советую Лунцзин или Сенчу — загляните в раздел «Зелёный чай».'],
  [/кофеин|вечер|сон/i, 'Без кофеина: Иван-чай, Ройбуш, Ромашка и мята.'],
  [/подар/i, 'Для подарка отлично подойдёт набор пиал или исинский чайник.'],
  [/спасиб/i, 'Пожалуйста! Хорошего чаепития.'],
];

function answer(text) {
  const rule = rules.find(([re]) => re.test(text));
  if (!rule) return 'Не совсем понял вопрос. Попробуйте спросить про доставку, оплату, возврат, избранное или подбор чая.';
  return typeof rule[1] === 'function' ? rule[1]() : rule[1];
}

const open = ref(false);
const input = ref('');
const messages = ref([{ from: 'bot', text: 'Привет! Я чайный помощник. Задайте вопрос.' }]);
const list = ref(null);

// новое сообщение или открыли чат — прокручиваем вниз
watch([() => messages.value.length, open], async () => {
  await nextTick();
  list.value?.scrollTo(0, list.value.scrollHeight);
});

function send() {
  const text = input.value.trim();
  if (!text) return;
  messages.value.push({ from: 'user', text });
  input.value = '';
  setTimeout(() => messages.value.push({ from: 'bot', text: answer(text) }), 500); // бот «печатает»
}
</script>

<template>
  <div :class="['floating chat', { chat_open: open }]">
    <div v-if="open" class="chat__window">
      <div class="chat__header">
        Чайный помощник
        <button type="button" class="close close_light" aria-label="Закрыть" @click="open = false"><X :size="18" /></button>
      </div>
      <div ref="list" class="chat__messages">
        <div v-for="(m, i) in messages" :key="i" :class="['chat__message', `chat__message_from_${m.from}`]">{{ m.text }}</div>
      </div>
      <!-- .prevent отменяет перезагрузку страницы формой -->
      <form class="chat__form" @submit.prevent="send">
        <input v-model="input" class="field__input py-1.5 text-sm" placeholder="Ваш вопрос…" aria-label="Ваш вопрос" />
        <button class="btn btn_variant_primary btn_size_sm" aria-label="Отправить"><SendHorizontal :size="16" /></button>
      </form>
    </div>
    <button type="button" class="chat__toggle" aria-label="Чат" @click="open = !open">
      <X v-if="open" :size="24" />
      <MessageCircle v-else :size="24" />
    </button>
  </div>
</template>
