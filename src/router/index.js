import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import CatalogPage from '../pages/CatalogPage.vue';
import ProductPage from '../pages/ProductPage.vue';
import FavoritesPage from '../pages/FavoritesPage.vue';
import CartPage from '../pages/CartPage.vue';
import CheckoutPage from '../pages/CheckoutPage.vue';
import AboutPage from '../pages/AboutPage.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';

// Таблица «адрес → страница»
const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/catalog', name: 'catalog', component: CatalogPage, meta: { title: 'Каталог' } },
  { path: '/catalog/:category', name: 'category', component: CatalogPage, meta: { title: 'Каталог' } },
  { path: '/product/:id', name: 'product', component: ProductPage }, // :id — переменная часть адреса
  { path: '/favorites', name: 'favorites', component: FavoritesPage, meta: { title: 'Избранное' } },
  { path: '/cart', name: 'cart', component: CartPage, meta: { title: 'Корзина' } },
  { path: '/checkout', name: 'checkout', component: CheckoutPage, meta: { title: 'Оформление заказа' } },
  { path: '/about', name: 'about', component: AboutPage, meta: { title: 'О нас' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage, meta: { title: 'Страница не найдена' } },
];

export const router = createRouter({
  // адреса вида сайт/#/catalog: часть после # не уходит на сервер,
  // поэтому сайт работает на любом хостинге без настройки сервера
  history: createWebHashHistory(),
  routes,
  // куда прокрутить после перехода
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition; // «Назад» в браузере — туда, где были
    if (to.path === from.path) return false; // сменились только фильтры каталога — стоим на месте
    return { top: 0 }; // новая страница — наверх
  },
});

// заголовок вкладки (у страницы товара его ставит сама страница)
router.afterEach((to) => {
  if (to.name !== 'product') {
    document.title = to.meta.title ? `${to.meta.title} — Чайная лавка` : 'Чайная лавка';
  }
});
